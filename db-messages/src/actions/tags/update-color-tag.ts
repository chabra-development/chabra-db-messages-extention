"use server"

import { prisma } from "@/lib/prisma"
import { findTagById } from "./find-tag-by-id"

type UpdateColorTagProps = {
    id: string
    color: string
}

export async function updateColorTag({ id, color }: UpdateColorTagProps) {

    await findTagById(id)

    return await prisma.tag.update({
        where: {
            id
        },
        data: {
            color
        }
    })
}