"use server"

import { api } from "@/lib/axios"
import { BodyBlib } from "@/types/index.types"

import { env } from "@/env"
import { BlipAttendantsResponse } from "@/types/blip-attendants-response.types"
import { randomUUID } from "node:crypto"
import { z } from "zod"

const findContactIdByNumberPhoneSchema = z.object({
    BLIP_DESK_API_KEY: z
        .string()
        .nonempty("A BLIP_DESK_API_KEY é obrigatória."),
})

export async function findManyAttendants() {

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
        uri: "/attendants"
    }

    const response = await api.post<BlipAttendantsResponse>(url, body, {
        headers: {
            Authorization: `Key ${BLIP_DESK_API_KEY}`,
        },
    })

    return response.data
}
