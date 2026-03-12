"use server"

import { env } from "@/env"
import { api } from "@/lib/axios"
import {
    LimeThreadMessage,
    LimeThreadMessagesResponse
} from "@/types/lime-thread-messages-response.types"
import { randomUUID, type UUID } from "node:crypto"
import z from "zod"

const findManyContactsSchema = z.object({
    ROUTER_API_KEY: z
        .string()
        .nonempty("A ROUTER_API_KEY é obrigatória."),
})

interface FindMessagesOptions {
    limit?: number
}

export async function findMessagesByIdentifyContact(
    identify: string,
    options: FindMessagesOptions = {}
): Promise<LimeThreadMessagesResponse> {
    
    const url = "https://chabra.http.msging.net/commands"

    const result = findManyContactsSchema.safeParse({
        ROUTER_API_KEY: env.ROUTER_API_KEY,
    })

    if (!result.success) {
        throw new Error(result.error.issues[0].message)
    }

    const { ROUTER_API_KEY } = result.data

    const TAKE = 100
    const { limit = Infinity } = options

    let allMessages: LimeThreadMessage[] = []
    let responseId = "" as unknown as UUID
    let responseFrom = ""
    let responseTo = ""
    let lastStorageDate: string | undefined = undefined
    let isFirstRequest = true

    try {
        while (allMessages.length < limit) {
            const currentTake = Math.min(TAKE, limit - allMessages.length)

            const uri: string = lastStorageDate
                ? `/threads/${identify}?$take=${currentTake}&direction=desc&storageDate=${lastStorageDate}&refreshExpiredMedia=true`
                : `/threads/${identify}?$take=${currentTake}&refreshExpiredMedia=true`

            const body = {
                id: randomUUID(),
                method: "get",
                uri,
            }
            
            const response = await api.post<LimeThreadMessagesResponse>(url, body, {
                headers: {
                    Authorization: `Key ${ROUTER_API_KEY}`,
                },
            })

            if (response.data.status !== "success") {
                throw new Error(
                    `Falha ao buscar mensagens: ${response.data.status}`
                )
            }

            const { resource, id, from, to } = response.data

            if (isFirstRequest) {
                responseId = id as UUID
                responseFrom = from
                responseTo = to
                isFirstRequest = false
            }

            const items = resource.items

            if (items.length === 0) break

            const lastItem = items[items.length - 1]
            const lastItemCursorDate = lastItem.date

            if (!lastItemCursorDate) break

            if (lastStorageDate === lastItemCursorDate) break

            allMessages.push(...items)

            if (items.length < currentTake) break

            lastStorageDate = lastItemCursorDate

            await new Promise(resolve => setTimeout(resolve, 100))
        }

        const limitedMessages = allMessages.slice(0, limit)

        return {
            type: "application/vnd.lime.collection+json",
            method: "get",
            status: "success",
            id: responseId,
            from: responseFrom,
            to: responseTo,
            resource: {
                total: limitedMessages.length,
                itemType: "application/vnd.iris.thread-message+json",
                items: limitedMessages,
            },
        }
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error)
        throw error
    }
}