"use server"

import { findMessagesByIdentifyContact } from "../blip/find-messages-by-identify-contact"
import { appendImportJobFailure } from "../import-job/append-import-job-failure"
import { processMessage } from "../messages/process-message"

type ProcessContactMessagesProps = {
    id: string
    identity: string
}

type ProcessContactMessagesResponse = {
    success: boolean
    created: number
    skipped: number
}

/**
 * Processa todas as mensagens de um único contato
 */
export async function processContactMessages(
    jobId: string,
    contact: ProcessContactMessagesProps
): Promise<ProcessContactMessagesResponse> {

    try {

        const response = await findMessagesByIdentifyContact(contact.identity)

        const messages = response.resource.items

        let created = 0
        let skipped = 0

        // Processa mensagens sequencialmente para evitar race conditions no banco
        for (const message of messages) {

            const result = await processMessage(contact.id, message)

            if (result.success && result.created) created++
            if (result.success && !result.created) skipped++
        }

        return { success: true, created, skipped }

    } catch (error) {
        
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"

        await appendImportJobFailure(jobId, {
            identity: contact.identity,
            reason: errorMessage,
            timestamp: new Date(),
        })

        return { success: false, created: 0, skipped: 0 }
    }
}