"use server"

import { env } from "@/env"
import { api } from "@/lib/axios"
import { BodyBlib } from "@/types/index.types"
import {
    LimeThreadMessagesResponse
} from "@/types/lime-thread-messages-response.types"
import { randomUUID } from "node:crypto"
import { z } from "zod"

const findMessagesByTicketIdSchema = z.object({
    BLIP_DESK_API_KEY: z
        .string()
        .nonempty("A BLIP_DESK_API_KEY é obrigatória."),
})

export async function findMessagesByTicketId(ticketId: string) {

    const url = "https://chabra.http.msging.net/commands"

    const result = findMessagesByTicketIdSchema.safeParse({
        BLIP_DESK_API_KEY: env.BLIP_DESK_API_KEY
    })

    if (!result.success) {
        throw new Error(result.error.issues[0].message)
    }

    const { BLIP_DESK_API_KEY } = result.data

    const body: BodyBlib = {
        id: randomUUID(),
        to: "postmaster@desk.msging.net",
        method: "get",
        uri: `/tickets/${ticketId}/messages?getFromOwnerIfTunnel=true`
    }

    const response = await api.post<LimeThreadMessagesResponse>(url, body, {
        headers: {
            Authorization: `Key ${BLIP_DESK_API_KEY}`,
        },
    })

    return response.data
}
