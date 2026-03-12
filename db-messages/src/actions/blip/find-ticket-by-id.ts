"use server"

import { env } from "@/env"
import { api } from "@/lib/axios"
import { BodyBlib } from "@/types/index.types"
import { IrisTicketResponse } from "@/types/lime-ticket-response.types"
import { randomUUID } from "node:crypto"
import { z } from "zod"

const findTicketByIdSchema = z.object({
    id: z.uuid(),
    BLIP_DESK_API_KEY: z
        .string()
        .nonempty("A BLIP_DESK_API_KEY é obrigatória."),
})

export async function findTicketById(id: string) {

    const url = "https://chabra.http.msging.net/commands"

    const result = findTicketByIdSchema.safeParse({
        id,
        BLIP_DESK_API_KEY: env.BLIP_DESK_API_KEY,
    })

    if (!result.success) {
        throw new Error(result.error.issues[0].message)
    }

    const { BLIP_DESK_API_KEY, id: parsedId } = result.data

    const body: BodyBlib = {
        id: randomUUID(),
        to: "postmaster@desk.msging.net",
        method: "get",
        uri: `/ticket/${parsedId}`,
    }

    const response = await api.post<IrisTicketResponse>(url, body, {
        headers: {
            Authorization: `Key ${BLIP_DESK_API_KEY}`,
        },
    })


    return response.data
}
