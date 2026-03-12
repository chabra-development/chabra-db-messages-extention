"use server"

import { prisma } from "@/lib/prisma"
import { LimeContact } from "@/types/lime-collection-response.types"
import { findContactNameByNumberPhone } from "../blip/find-contact-name-by-number-phone"
import { appendImportJobFailure } from "../import-job/append-import-job-failure"

/**
 * Processa um único contato (upsert)
 */
export async function processContact(
    jobId: string,
    contact: LimeContact
): Promise<{ success: boolean; error?: string }> {

    const {
        identity,
        source,
        phoneNumber,
        email,
        taxDocument,
        group,
        extras,
        lastMessageDate,
        lastUpdateDate
    } = contact

    try {

        if (!identity) {
            throw new Error("Identity é obrigatório")
        }

        const name = await findContactNameByNumberPhone({
            numberPhone: phoneNumber,
            alternativeName: contact.name
        })

        await prisma.contact.upsert({
            where: { identity },
            create: {
                identity,
                name: name ?? "sem nome",
                source,
                phoneNumber,
                email,
                taxDocument,
                group,
                extras: extras ?? undefined,
                lastMessageDate: lastMessageDate ? new Date(lastMessageDate) : undefined,
                lastUpdateDate: lastUpdateDate ? new Date(lastUpdateDate) : undefined,
            },
            update: {
                name,
                source,
                phoneNumber,
                email,
                taxDocument,
                group,
                extras: extras ?? undefined,
                lastMessageDate: lastMessageDate ? new Date(lastMessageDate) : undefined,
                lastUpdateDate: lastUpdateDate ? new Date(lastUpdateDate) : undefined,
            },
        })

        return { success: true }

    } catch (error) {
        
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"

        await appendImportJobFailure(jobId, {
            identity,
            reason: errorMessage,
            timestamp: new Date(),
        })

        return { success: false, error: errorMessage }
    }
}