"use server"

import { env } from "@/env"
import { delay } from "@/functions/delay"
import z from "zod"
import { createImportJob } from "../import-job/create-import-job"
import { deleteImportJob } from "../import-job/delete-import-job"
import { updateImportJobStatus } from "../import-job/update-import-job-status"
import { createImportLog } from "../import-logs/create-import-log"
import { fetchAllContacts } from "./fetch-all-contacts"
import { processBatch } from "./process-batch"

// Configurações de importação
const TAKE = 100 // Máximo suportado pela API
const BATCH_SIZE = 10 // Processa 10 contatos por vez
const DELAY_BETWEEN_BATCHES = 500 // 500ms entre lotes (rate limiting)
const JOB_CLEANUP_DELAY = 60_000 // 1 minuto para limpar job concluído

const importContactsEnvSchema = z.object({
    ROUTER_API_KEY: z
        .string()
        .nonempty("A ROUTER_API_KEY é obrigatória.")
})

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
 * Função principal de importação de contatos
 */
export async function importContacts(): Promise<ImportResult> {

    const result = importContactsEnvSchema.safeParse({
        ROUTER_API_KEY: env.ROUTER_API_KEY,
    })

    if (!result.success) {
        throw new Error(result.error.issues[0].message)
    }

    const { ROUTER_API_KEY } = result.data

    const contacts = await fetchAllContacts(ROUTER_API_KEY, TAKE)
    const payloadSize = Buffer.byteLength(JSON.stringify(contacts), "utf-8")

    const uniqueContacts = Array.from(
        new Map(contacts.map(c => [c.identity, c])).values()
    )

    const deduplicatedCount = contacts.length - uniqueContacts.length

    const job = await createImportJob({
        total: uniqueContacts.length,
        metadata: {
            deduplicatedCount,
            batchSize: BATCH_SIZE,
            startedAt: new Date().toISOString(),
        },
    })

        // Processa em background (não bloqueia a resposta)
        ; (async () => {
            const startedAt = Date.now()

            try {
                await updateImportJobStatus(job.id, "RUNNING")

                const batches = chunkArray(uniqueContacts, BATCH_SIZE)

                let totalSucceeded = 0
                let totalFailed = 0

                for (let i = 0; i < batches.length; i++) {

                    const { succeeded, failed } = await processBatch(job.id, batches[i])

                    totalSucceeded += succeeded
                    totalFailed += failed

                    if (i < batches.length - 1) {
                        await delay(DELAY_BETWEEN_BATCHES)
                    }
                }

                await updateImportJobStatus(job.id, "COMPLETED", {
                    deduplicatedCount,
                    batchSize: BATCH_SIZE,
                    totalSucceeded,
                    totalFailed,
                    completedAt: new Date().toISOString(),
                })

                await createImportLog({
                    type: "CONTACTS",
                    total: uniqueContacts.length,
                    succeeded: totalSucceeded,
                    failed: totalFailed,
                    duration: Date.now() - startedAt,
                    payloadSize,
                })

            } catch (error) {
                console.error("Import contacts job failed:", error)

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
        total: uniqueContacts.length,
        message: deduplicatedCount > 0
            ? `Importação iniciada. ${deduplicatedCount} duplicata(s) removida(s).`
            : "Importação iniciada com sucesso."
    }
}