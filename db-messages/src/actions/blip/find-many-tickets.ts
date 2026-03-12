"use server"

import { env } from "@/env"
import { api } from "@/lib/axios"
import { BodyBlib } from "@/types/index.types"
import { LimeCollectionResponse } from "@/types/lime-ticket-response.types"
import { randomUUID } from "node:crypto"
import { z } from "zod"

const findContactIdByNumberPhoneSchema = z.object({
    BLIP_DESK_API_KEY: z
        .string()
        .nonempty("A BLIP_DESK_API_KEY é obrigatória."),
})

export async function findManyTickets() {

    const url = "https://chabra.http.msging.net/commands"

    const result = findContactIdByNumberPhoneSchema.safeParse({
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
        uri: "/tickets?$skip=0&$take=100"
    }

    const response = await api.post<LimeCollectionResponse>(url, body, {
        headers: {
            Authorization: `Key ${BLIP_DESK_API_KEY}`,
        },
    })

    return response.data
}
