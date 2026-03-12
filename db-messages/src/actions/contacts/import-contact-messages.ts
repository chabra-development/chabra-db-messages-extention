"use server"

import { delay } from "@/functions/delay"
import { prisma } from "@/lib/prisma"
import { createImportJob } from "../import-job/create-import-job"
import { deleteImportJob } from "../import-job/delete-import-job"
import { updateImportJobStatus } from "../import-job/update-import-job-status"
import { createImportLog } from "../import-logs/create-import-log"
import { processBatch } from "../messages/process-batch"

// Configurações de importação
const BATCH_SIZE = 10 // Processa 10 contatos por vez
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
 * Função principal de importação de mensagens — executada via cron diário
 */
export async function importContactMessages(): Promise<ImportResult> {

    const contacts = await prisma.contact.findMany({
        select: { id: true, identity: true },
        orderBy: { lastMessageDate: "desc" },
    })

    const payloadSize = Buffer.byteLength(JSON.stringify(contacts), "utf-8")

    const job = await createImportJob({
        total: contacts.length,
        metadata: {
            batchSize: BATCH_SIZE,
            startedAt: new Date().toISOString(),
        },
    })

        // Processa em background (não bloqueia a resposta)
        ; (async () => {
            const startedAt = Date.now()

            try {
                await updateImportJobStatus(job.id, "RUNNING")

                const batches = chunkArray(contacts, BATCH_SIZE)

                let totalSucceeded = 0
                let totalFailed = 0
                let totalMessagesCreated = 0

                for (let i = 0; i < batches.length; i++) {
                    const { succeeded, failed, messagesCreated } = await processBatch(job.id, batches[i])

                    totalSucceeded += succeeded
                    totalFailed += failed
                    totalMessagesCreated += messagesCreated

                    if (i < batches.length - 1) {
                        await delay(DELAY_BETWEEN_BATCHES)
                    }
                }

                await updateImportJobStatus(job.id, "COMPLETED", {
                    batchSize: BATCH_SIZE,
                    totalContactsProcessed: contacts.length,
                    totalSucceeded,
                    totalFailed,
                    totalMessagesCreated,
                    completedAt: new Date().toISOString(),
                })

                await createImportLog({
                    type: "MESSAGES",
                    total: contacts.length,
                    succeeded: totalSucceeded,
                    failed: totalFailed,
                    duration: Date.now() - startedAt,
                    payloadSize,
                })

            } catch (error) {
                console.error("Import contact messages job failed:", error)

                await updateImportJobStatus(job.id, "FAILED", {
                    error: error instanceof Error ? error.message : "Unknown error",
                    failedAt: new Date().toISOString(),
                })

            } finally {
                setTimeout(async () => {
                    await deleteImportJob(job.id)
                }, JOB_CLEANUP_DELAY)
            }
        })()

    return {
        jobId: job.id,
        total: contacts.length,
        message: "Importação de mensagens iniciada com sucesso.",
    }
}