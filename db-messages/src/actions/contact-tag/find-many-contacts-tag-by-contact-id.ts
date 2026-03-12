"use server"

import { prisma } from "@/lib/prisma"
import { findContactById } from "../contacts/find-contact-by-id"

export async function findManyContactsTagByContactId(contactId: string) {
    
    await findContactById(contactId)

    return await prisma.contactTag.findMany({
        where: {
            contactId
        },
        select: {
            tag: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    })
}
