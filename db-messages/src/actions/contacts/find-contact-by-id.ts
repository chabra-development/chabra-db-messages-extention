"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type FindContactByIdProps = Omit<Prisma.ContactFindUniqueArgs, "where">

export async function findContactById<T>(id: string, props: FindContactByIdProps = {}) {
    return await prisma.contact.findUniqueOrThrow({
        where: {
            id
        },
        ...props,
    }) as T
}