"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function findTagById(
    id: string,
    props: Prisma.TagFindUniqueOrThrowArgs = {
        where: {
            id
        }
    }
) {
    return await prisma.tag.findUniqueOrThrow(props)
}