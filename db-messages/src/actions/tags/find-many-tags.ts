"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function findManyTags(props: Prisma.TagFindManyArgs = {}) {
    return await prisma.tag.findMany(props)
}