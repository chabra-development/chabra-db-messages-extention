"use server"


import { prisma } from "@/lib/prisma"
import { findContactById } from "../contacts/find-contact-by-id"
import { getSessionOrRedirect } from "@/functions/get-session"

export async function togglePinnedContact(contactId: string) {

    await findContactById(contactId, {
        select: {
            id: true
        }
    })

    const { user } = await getSessionOrRedirect()

    const userId = user.id

    const preference = await prisma.contactUserPreference.upsert({
        where: {
            contactId_userId: { contactId, userId },
        },
        create: {
            contactId,
            userId,
            pinned: true,
            pinnedAt: new Date(),
        },
        update: {},
    })

    const updated = await prisma.contactUserPreference.update({
        where: {
            contactId_userId: { contactId, userId },
        },
        data: {
            pinned: !preference.pinned,
            pinnedAt: !preference.pinned ? new Date() : null,
        },
    })

    return updated
}