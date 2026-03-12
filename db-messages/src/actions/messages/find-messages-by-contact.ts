"use server"

import { prisma } from "@/lib/prisma"
import type { Message } from "@prisma/client"

type Response = {
    messages: Pick<Message, "id" | "direction" | "content" | "sentAt" | "status">[]
    nextCursor: string | null
    total: number
}

type Params = {
    contactId: string
    take?: number
    cursor?: string | null
}

export async function findMessagesByContact({
    contactId,
    take = 20,
    cursor,
}: Params): Promise<Response> {

    const [rawMessages, total] = await prisma.$transaction([
        prisma.message.findMany({
            where: { contactId },
            take: take + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            orderBy: [
                { sentAt: "desc" },
                { id: "desc" },
            ],
            select: {
                id: true,
                direction: true,
                content: true,
                sentAt: true,
                status: true,
            },
        }),
        prisma.message.count({
            where: { contactId },
        }),
    ])

    const hasMore = rawMessages.length > take
    const messages = hasMore ? rawMessages.slice(0, take) : rawMessages

    return {
        messages,
        nextCursor: hasMore ? messages.at(-1)!.id : null,
        total,
    }
}