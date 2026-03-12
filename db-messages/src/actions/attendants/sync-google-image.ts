"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function syncGoogleImage() {
    
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) throw new Error("Não autenticado")

    const googleAccount = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: "google",
        },
        select: { idToken: true },
    })

    if (!googleAccount?.idToken) return null

    const payload = JSON.parse(
        Buffer.from(googleAccount.idToken.split(".")[1], "base64").toString()
    )

    if (!payload.picture) return null

    await prisma.user.update({
        where: { id: session.user.id },
        data: { image: payload.picture },
    })

    return payload.picture
}