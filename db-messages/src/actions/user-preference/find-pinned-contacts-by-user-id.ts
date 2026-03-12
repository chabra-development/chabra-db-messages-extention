"use server"

import { getSessionOrRedirect } from "@/functions/get-session"
import { prisma } from "@/lib/prisma"

export async function findPinnedContactsByUserId() {

    const { user } = await getSessionOrRedirect()

    const userId = user.id

    return prisma.contactUserPreference.findMany({
        where: { userId, pinned: true },
        include: { contact: true },
        orderBy: { pinnedAt: "desc" },
    })
}