"use server"

import { prisma } from "@/lib/prisma"
import { getSessionOrRedirect } from "@/functions/get-session"

export async function findContactPreferencesByUserId() {

    const { user } = await getSessionOrRedirect()

    const userId = user.id

    return prisma.contactUserPreference.findMany({
        where: { userId },
        include: { contact: true },
        orderBy: { updatedAt: "desc" },
    })
}