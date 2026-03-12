"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

const DEFAULT_TAKE = 20

interface PaginationArgs {
    cursor?: string
    take?: number
}

type FindManyContactsArgs = Omit<Prisma.ContactFindManyArgs, "cursor" | "take" | "skip"> & PaginationArgs

type PaginatedContacts<T> = {
    data: T[]
    nextCursor: string | null
    hasNextPage: boolean
}

type FindManyContactsResponse<T extends Prisma.ContactFindManyArgs> = PaginatedContacts<Prisma.ContactGetPayload<T>>

export async function findManyContacts<T extends Prisma.ContactFindManyArgs>(
    { 
        cursor, 
        take = DEFAULT_TAKE, 
        ...props 
    }: FindManyContactsArgs = {}
): Promise<FindManyContactsResponse<T>> {
    
    const limit = take + 1

    const items = await prisma.contact.findMany({
        ...props,
        take: limit,
        ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
        }),
    })

    const hasNextPage = items.length > take
    const data = hasNextPage ? items.slice(0, -1) : items
    const nextCursor = hasNextPage ? data.at(-1)!.id : null

    return { data, nextCursor, hasNextPage } as PaginatedContacts<Prisma.ContactGetPayload<T>>
}