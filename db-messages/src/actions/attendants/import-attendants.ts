"use server"

import { delay } from "@/functions/delay"
import { extractNameFromBlipIdentity } from "@/functions/extract-name-from-blip-identity"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ImportAttendantsProps } from "@/schemas/import-attendants-schema"

// Configurações de importação
const BATCH_SIZE = 10 // Processa 10 atendentes por vez
const DELAY_BETWEEN_BATCHES = 500 // 500ms entre lotes (rate limiting)
const JOB_CLEANUP_DELAY = 60_000 // 1 minuto para limpar job concluído

interface ImportResult {
    jobId: string
    total: number
    message: string
}

/**
 * Divide array em lotes menores
 */
function chunkArray<T>(array: T[], size: number): T[][] {
    
    const chunks: T[][] = []
    
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }

    return chunks
}


/**
 * Valida e-mail básico
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Processa um único atendente
 */
async function processAttendant(
    jobId: string,
    attendant: { identity: string; email: string; teams: string[] }
): Promise<{ success: boolean; error?: string }> {
    
    const { identity, email, teams } = attendant

    try {
        // Validação básica
        if (!identity || !email) {
            throw new Error("Identity e email são obrigatórios")
        }

        if (!isValidEmail(email)) {
            throw new Error("Email inválido")
        }

        // Verifica se já existe
        const exists = await prisma.user.findUnique({
            where: { identity },
            select: { id: true, email: true }
        })

        if (exists) {
            // Atualiza teams se necessário
            if (teams && teams.length > 0) {
                await prisma.user.update({
                    where: { identity },
                    data: { teams }
                })
                return { success: true }
            }

            // Já existe e não precisa atualizar
            return { success: true }
        }

        // Cria novo usuário
        await auth.api.signUpEmail({
            body: {
                email,
                name: extractNameFromBlipIdentity(identity),
                password: "Chabra@123", // TODO: Gerar senha aleatória
                identity,
                teams: teams ?? []
            },
        })

        return { success: true }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"

        // Registra falha no job
        await prisma.importJob.update({
            where: { id: jobId },
            data: {
                failed: {
                    push: {
                        identity,
                        email,
                        reason: errorMessage,
                        timestamp: new Date()
                    },
                },
            },
        }).catch(() => {
            // Ignora erro ao registrar falha
            console.error(`Failed to log error for ${email}:`, errorMessage)
        })

        return { success: false, error: errorMessage }
    }
}

/**
 * Processa um lote de atendentes
 */
async function processBatch(
    jobId: string,
    batch: Array<{ identity: string; email: string; teams: string[] }>
): Promise<{ succeeded: number; failed: number }> {
    
    let succeeded = 0
    let failed = 0

    // Processa em paralelo dentro do lote
    const results = await Promise.allSettled(
        batch.map(attendant => processAttendant(jobId, attendant))
    )

    for (const result of results) {
        if (result.status === "fulfilled" && result.value.success) {
            succeeded++
        } else {
            failed++
        }
    }

    // Atualiza progresso no job
    await prisma.importJob.update({
        where: { id: jobId },
        data: {
            processed: { increment: batch.length },
            succeeded: { increment: succeeded },
            failedCount: { increment: failed }
        },
    }).catch(() => {
        console.error("Failed to update job progress")
    })

    return { succeeded, failed }
}

/**
 * Função principal de importação
 */
export async function importAttendants({
    attendents
}: ImportAttendantsProps): Promise<ImportResult> {

    // Remove duplicatas por identity
    const uniqueAttendants = Array.from(
        new Map(
            attendents.map(a => [a.identity, a])
        ).values()
    )

    const deduplicatedCount = attendents.length - uniqueAttendants.length

    // Cria job de importação
    const job = await prisma.importJob.create({
        data: {
            total: uniqueAttendants.length,
            processed: 0,
            succeeded: 0,
            failedCount: 0,
            status: "PENDING",
            metadata: {
                deduplicatedCount,
                batchSize: BATCH_SIZE,
                startedAt: new Date().toISOString()
            }
        },
    })

        // Processa em background (não bloqueia a resposta)
        ; (async () => {
            try {
                // Atualiza status para running
                await prisma.importJob.update({
                    where: { id: job.id },
                    data: {
                        status: "RUNNING",
                        startedAt: new Date()
                    },
                })

                // Divide em lotes
                const batches = chunkArray(uniqueAttendants, BATCH_SIZE)

                let totalSucceeded = 0
                let totalFailed = 0

                // Processa cada lote
                for (let i = 0; i < batches.length; i++) {
                    const batch = batches[i]

                    const { succeeded, failed } = await processBatch(job.id, batch)

                    totalSucceeded += succeeded
                    totalFailed += failed

                    // Aguarda entre lotes (rate limiting)
                    if (i < batches.length - 1) {
                        await delay(DELAY_BETWEEN_BATCHES)
                    }
                }

                // Finaliza job
                await prisma.importJob.update({
                    where: { id: job.id },
                    data: {
                        status: "COMPLETED",
                        completedAt: new Date(),
                        metadata: {
                            deduplicatedCount,
                            batchSize: BATCH_SIZE,
                            totalSucceeded,
                            totalFailed,
                            completedAt: new Date().toISOString()
                        }
                    },
                })

            } catch (error) {
                console.error("Import job failed:", error)

                // Marca job como erro
                await prisma.importJob.update({
                    where: { id: job.id },
                    data: {
                        status: "FAILED",
                        completedAt: new Date(),
                        metadata: {
                            error: error instanceof Error ? error.message : "Unknown error",
                            failedAt: new Date().toISOString()
                        }
                    },
                }).catch(() => {
                    console.error("Failed to mark job as error")
                })

            } finally {
                // Agenda limpeza do job
                setTimeout(async () => {
                    try {
                        await prisma.importJob.delete({
                            where: { id: job.id },
                        })
                    } catch (error) {
                        console.error(`Failed to cleanup job ${job.id}:`, error)
                    }
                }, JOB_CLEANUP_DELAY)
            }
        })()

    return {
        jobId: job.id,
        total: uniqueAttendants.length,
        message: deduplicatedCount > 0
            ? `Importação iniciada. ${deduplicatedCount} duplicata(s) removida(s).`
            : "Importação iniciada com sucesso."
    }
}