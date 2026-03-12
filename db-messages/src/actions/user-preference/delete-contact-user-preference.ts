"use server"

import { prisma } from "@/lib/prisma"
import { findContactById } from "../contacts/find-contact-by-id"
import { getSessionOrRedirect } from "@/functions/get-session"

export async function deleteContactUserPreference(contactId: string) {

    await findContactById(contactId, {
        select: {
            id: true
        }
    })

    const { user } = await getSessionOrRedirect()

    const userId = user.id

    const deleted = await prisma.contactUserPreference.delete({
        where: {
            contactId_userId: { contactId, userId },
        },
    })

    return deleted
}