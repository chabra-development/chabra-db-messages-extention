"use server"


import { prisma } from "@/lib/prisma"
import { findAttendantsById } from "../attendants/find-attendants-by-id"
import { findContactById } from "../contacts/find-contact-by-id"
import { getSessionOrRedirect } from "@/functions/get-session"

export async function toggleFavoriteContact(contactId: string) {

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
            favorite: true,
            favoritedAt: new Date(),
        },
        update: {},
    })

    const updated = await prisma.contactUserPreference.update({
        where: {
            contactId_userId: { contactId, userId },
        },
        data: {
            favorite: !preference.favorite,
            favoritedAt: !preference.favorite ? new Date() : null,
        },
    })

    return updated
}