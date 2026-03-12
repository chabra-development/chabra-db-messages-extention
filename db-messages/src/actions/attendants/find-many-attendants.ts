"use server"

import { prisma } from "@/lib/prisma"
import { findManyAttendantsSchema } from "@/schemas/find-many-attendants-schema"
import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"

type FindManyAttendantsProps = Omit<Prisma.UserFindManyArgs, "take" | "skip"> & {
    take: string | null
    skip: string | null
    search: string | null
    team?: string
}

export async function findManyAttendants({
    skip,
    take,
    search,
    team,
    ...props
}: FindManyAttendantsProps) {

    const { data, error } = findManyAttendantsSchema.safeParse({ skip, take })

    if (error) redirect("/attendants?skip=0&take=10")

    const where: Prisma.UserWhereInput = {
        ...((props.where as Prisma.UserWhereInput) ?? {}),
        ...(search ? {
            name: {
                contains: search,
                mode: "insensitive",
            },
        } : {}),
        ...(team ? {
            teams: {
                has: team,
            },
        } : {}),
    }

    const [attendants, count] = await Promise.all([
        prisma.user.findMany({
            take: data.take,
            skip: data.skip,
            where,
            ...props,
        }),
        prisma.user.count({ where }),
    ])

    const page = Math.floor(data.skip / data.take) + 1
    const totalPages = Math.ceil(count / data.take)

    return {
        count,
        data: attendants,
        page,
        totalPages,
    }
}