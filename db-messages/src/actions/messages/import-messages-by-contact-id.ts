import { Prisma } from "@prisma/client"
import { findContactById } from "../contacts/find-contact-by-id"
import { createImportJob } from "../import-job/create-import-job"
import { deleteImportJob } from "../import-job/delete-import-job"
import { updateImportJobStatus } from "../import-job/update-import-job-status"
import { processBatch } from "./process-batch"

type Contact = Prisma.ContactGetPayload<{
    select: {
        id: true,
        identity: true
    }
}>

export async function importContactMessagesByContactId(contactId: string) {

    const contact = await findContactById<Contact>(contactId, {
        select: {
            id: true,
            identity: true
        }
    })

    // 2. Cria o job
    const job = await createImportJob({
        total: 1,
        metadata: { contactId, startedAt: new Date().toISOString() },
    })

        // 3. Processa em background
        ; (async () => {
            try {
                await updateImportJobStatus(job.id, "RUNNING")

                // Reusa o processBatch com array de 1 contato
                const { succeeded, failed, messagesCreated } = await processBatch(job.id, [contact])

                await updateImportJobStatus(job.id, "COMPLETED", {
                    totalMessagesCreated: messagesCreated,
                    succeeded,
                    failed,
                    completedAt: new Date().toISOString(),
                })

            } catch (error) {
                await updateImportJobStatus(job.id, "FAILED", {
                    error: error instanceof Error ? error.message : "Unknown error",
                    failedAt: new Date().toISOString(),
                })
            } finally {
                setTimeout(async () => {
                    await deleteImportJob(job.id)
                }, 30_000) // 30s — job menor, cleanup mais rápido
            }
        })()

    return {
        jobId: job.id,
        total: 1,
        message: "Importação de mensagens do contato iniciada.",
    }
}