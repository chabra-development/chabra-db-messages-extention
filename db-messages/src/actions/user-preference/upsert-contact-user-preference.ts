"use server"

import { getSessionOrRedirect } from "@/functions/get-session"
import { prisma } from "@/lib/prisma"
import { findContactById } from "../contacts/find-contact-by-id"

export async function upsertContactUserPreference(contactId: string) {

    await findContactById(contactId, {
        select: {
            id: true
        }
    })

    const { user } = await getSessionOrRedirect()

    const userId = user.id

    return prisma.contactUserPreference.upsert({
        where: {
            contactId_userId: {
                contactId,
                userId
            },
        },
        create: {
            contactId,
            userId,
        },
        update: {},
    })
}