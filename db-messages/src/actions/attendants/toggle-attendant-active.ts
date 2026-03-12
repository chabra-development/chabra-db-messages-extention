"use server"

import { prisma } from "@/lib/prisma"

export async function toggleAttendantActive({ attendantId }: { attendantId: string }) {

    const attendant = await prisma.user.findUniqueOrThrow({
        where: {
            id: attendantId
        },
        select: {
            id: true,
            name: true,
            isActive: true
        }
    })

    const updated = await prisma.user.update({
        where: {
            id: attendantId
        },
        data: {
            isActive: !attendant.isActive
        },
        select: {
            name: true,
            isActive: true
        },
    })

    return updated
}