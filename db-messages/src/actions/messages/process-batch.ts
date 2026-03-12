"use server"

import { processContactMessages } from "../contacts/process-contact-messages";
import { updateImportJobProgress } from "../import-job/update-import-job-progress";

/**
 * Processa um lote de contatos
 */
export async function processBatch(
    jobId: string,
    batch: Array<{ id: string; identity: string }>
): Promise<{ succeeded: number; failed: number; messagesCreated: number }> {
    
    let succeeded = 0
    let failed = 0
    let messagesCreated = 0

    const results = await Promise.allSettled(
        batch.map(contact => processContactMessages(jobId, contact))
    )

    for (const result of results) {
        if (result.status === "fulfilled" && result.value.success) {
            succeeded++
            messagesCreated += result.value.created
        } else {
            failed++
        }
    }

    await updateImportJobProgress(jobId, {
        processedIncrement: batch.length,
        succeededIncrement: succeeded,
        failedIncrement: failed,
    })

    return { succeeded, failed, messagesCreated }
}