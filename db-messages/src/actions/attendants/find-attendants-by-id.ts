"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type FindAttendantsByIdProps = Omit<Prisma.UserFindUniqueArgs, "where">

export async function findAttendantsById<T>(id: string, props: FindAttendantsByIdProps = {}) {
    return await prisma.user.findUniqueOrThrow({
        where: {
            id
        },
        ...props
    }) as T
}