"use server"

import { getSessionOrRedirect } from "@/functions/get-session"
import { prisma } from "@/lib/prisma"

export async function findFavoriteContactsByUserId() {

    const { user } = await getSessionOrRedirect()

    const userId = user.id

    return prisma.contactUserPreference.findMany({
        where: { userId, favorite: true },
        include: { contact: true },
        orderBy: { favoritedAt: "desc" },
    })
}