"use server"

import { prisma } from "@/lib/prisma"
import { CreateTagsProps } from "@/schemas/create-tags-schema"

type CreateContactTagsProps = CreateTagsProps & {
    contactId: string
    headers: Headers
}

export async function createContactTags({ tags, contactId, headers }: CreateContactTagsProps) {

    const token = headers.get("cookie")
        ?.split(";")
        .find(c => c.trim().startsWith("better-auth.session_token="))
        ?.split("=")[1]

    const session = token ? await prisma.session.findUnique({
        where: { token },
        include: { user: true }
    }) : null

    if (!session) {
        throw new Error("Sessão inválida, tente conectar novamente.")
    }

    const createdById = session.user.id

    const contact = await prisma.contact.findFirst({
        where: {
            OR: [{ id: contactId }, { identity: contactId }]
        },
        select: { id: true }
    })

    if (!contact) {
        throw new Error("Contato não encontrado.")
    }

    const resolvedContactId = contact.id

    // busca as tags já associadas ao contato
    const existingContactTags = await prisma.contactTag.findMany({
        where: { contactId: resolvedContactId },
        include: { tag: true }
    })

    const newTagNames = tags.map(({ name }) => name)
    const existingTagNames = existingContactTags.map(({ tag }) => tag.name)

    // tagIds a desassociar do contato
    const tagIdsToDelete = existingContactTags
        .filter(({ tag }) => !newTagNames.includes(tag.name))
        .map(({ tagId }) => tagId)

    // nomes de tags novas a criar/associar
    const tagsToCreate = tags.filter(({ name }) => !existingTagNames.includes(name))

    const [deletedTags, ...createdTags] = await prisma.$transaction([
        prisma.contactTag.deleteMany({
            where: {
                contactId: resolvedContactId,
                tagId: { in: tagIdsToDelete }
            }
        }),
        ...tagsToCreate.map(({ name }) =>
            prisma.contactTag.create({
                data: {
                    contact: { connect: { id: resolvedContactId } },
                    tag: {
                        connectOrCreate: {
                            where: { name },
                            create: { name, createdById }
                        }
                    }
                }
            })
        )
    ])

    return { deletedTags, createdTags }
}