"use server"

import { LimeContact } from "@/types/lime-collection-response.types"
import { updateImportJobProgress } from "../import-job/update-import-job-progress"
import { processContact } from "./process-contact"

/**
 * Processa um lote de contatos
 */
export async function processBatch(
    jobId: string,
    batch: LimeContact[]
): Promise<{ succeeded: number; failed: number }> {
    let succeeded = 0
    let failed = 0

    const results = await Promise.allSettled(
        batch.map(contact => processContact(jobId, contact))
    )

    for (const result of results) {
        if (result.status === "fulfilled" && result.value.success) {
            succeeded++
        } else {
            failed++
        }
    }

    await updateImportJobProgress(jobId, {
        processedIncrement: batch.length,
        succeededIncrement: succeeded,
        failedIncrement: failed,
    })

    return { succeeded, failed }
}