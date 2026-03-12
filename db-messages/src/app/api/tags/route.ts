import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const querySchema = z.object({
    take: z.coerce.number().int().positive().optional(),
    skip: z.coerce.number().int().nonnegative().optional(),
    search: z.string().min(1).optional(),
})

const postSchema = z.object({
    tags: z.array(z.string().min(1).max(50)).min(1),
})

export async function GET(req: NextRequest) {

    const parsed = querySchema.safeParse(
        Object.fromEntries(req.nextUrl.searchParams)
    )

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    const { take, skip, search } = parsed.data

    const tags = await prisma.tag.findMany({
        take,
        skip,
        where: search ? {
            name: { contains: search, mode: "insensitive" }
        } : undefined,
        orderBy: { name: "asc" }
    })

    return NextResponse.json(tags, { status: 200 })
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null)
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    const created = await Promise.all(
        parsed.data.tags.map((name) =>
            prisma.tag.upsert({
                where: { name: name.toLowerCase() },
                update: {},
                create: { name: name.toLowerCase() },
            })
        )
    )

    return NextResponse.json(created, { status: 201 })
}
