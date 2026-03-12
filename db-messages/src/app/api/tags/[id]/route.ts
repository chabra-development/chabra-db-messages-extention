import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

interface Params {
    params: Promise<{ id: string }>
}

async function findContact(contactId: string) {
    return prisma.contact.findFirst({
        where: {
            OR: [{ id: contactId }, { identity: contactId }]
        },
        select: { id: true }
    })
}

export async function GET(_: NextRequest, { params }: Params) {

    const { id: contactId } = await params

    const contact = await findContact(contactId)

    if (!contact) {
        return NextResponse.json(
            { error: "Não foi encontrado o contato selecionado." },
            { status: 404 }
        )
    }

    const tags = await prisma.tag.findMany({
        where: {
            contacts: {
                some: { contactId: contact.id }
            }
        }
    })

    return NextResponse.json(tags, { status: 200 })
}

const putSchema = z.object({
    tagIds: z.array(z.uuid()).default([]),
})

export async function PUT(req: NextRequest, { params }: Params) {
    const { id: contactId } = await params

    const body = await req.json().catch(() => null)
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    const contact = await findContact(contactId)

    if (!contact) {
        return NextResponse.json(
            { error: "Não foi encontrado o contato selecionado." },
            { status: 404 }
        )
    }

    const { tagIds } = parsed.data

    await prisma.$transaction([
        prisma.contactTag.deleteMany({ where: { contactId: contact.id } }),
        ...(tagIds.length > 0
            ? [prisma.contactTag.createMany({
                data: tagIds.map((tagId) => ({ contactId: contact.id, tagId })),
                skipDuplicates: true,
              })]
            : []),
    ])

    const tags = await prisma.tag.findMany({
        where: { contacts: { some: { contactId: contact.id } } },
    })

    return NextResponse.json(tags, { status: 200 })
}
