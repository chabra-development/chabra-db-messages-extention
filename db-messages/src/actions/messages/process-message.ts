"use server"

import { prisma } from "@/lib/prisma";
import { LimeThreadMessage } from "@/types/lime-thread-messages-response.types";
import { processMessageContent } from "./process-message-content";

type ProcessMessageProps = {
    success: boolean
    created: boolean
    error?: string
}

/**
 * Processa uma única mensagem — verifica se já existe pelo blipId antes de salvar
 */
export async function processMessage(
    contactId: string,
    message: LimeThreadMessage
): Promise<ProcessMessageProps> {
    
    try {
        const exists = await prisma.message.findUnique({
            where: { blipId: message.id },
            select: { id: true },
        })

        if (exists) {
            return { success: true, created: false }
        }

        const { content, metadata } = await processMessageContent(message)

        await prisma.message.create({
            data: {
                blipId: message.id,
                direction: message.direction === "sent" ? "SENT" : "RECEIVED",
                type: message.type,
                content,
                status: message.status === "consumed" ? "CONSUMED" : "DISPATCHED",
                metadata: JSON.stringify(metadata),
                sentAt: new Date(message.date),
                contactId,
            },
        })

        return { success: true, created: true }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
        return { success: false, created: false, error: errorMessage }
    }
}