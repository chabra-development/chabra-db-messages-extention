"use server"

import { env } from "@/env"
import { api } from "@/lib/axios"
import type { BlipAccountResponse } from "@/types/blip-account-response.types"
import { BodyBlib } from "@/types/index.types"
import { randomUUID } from "node:crypto"
import { z } from "zod"

const findContactNameByNumberPhoneSchema = z.object({
  ROUTER_API_KEY: z
    .string()
    .nonempty("A ROUTER_API_KEY é obrigatória."),
  numberPhone: z
    .string()
    .transform(phone => {
      if (phone.startsWith("+5555")) {
        return phone.slice(3)
      }
      return phone
    })
    .optional(),
})

type FindContactNameByNumberPhoneProps = {
  numberPhone: string
  alternativeName: string
}

export async function findContactNameByNumberPhone({
  alternativeName, numberPhone
}: FindContactNameByNumberPhoneProps) {

  const url = "https://chabra.http.msging.net/commands"

  const result = findContactNameByNumberPhoneSchema.safeParse({
    ROUTER_API_KEY: env.ROUTER_API_KEY,
    numberPhone,
  })

  if (!result.success) {
    throw new Error(result.error.issues[0].message)
  }

  const { ROUTER_API_KEY, numberPhone: parsedPhone } = result.data

  const body: BodyBlib = {
    id: randomUUID(),
    to: "postmaster@wa.gw.msging.net",
    method: "get",
    uri: `lime://wa.gw.msging.net/accounts/+${parsedPhone}`,
  }

  if (!parsedPhone) {
    return alternativeName
  }

  const response = await api.post<BlipAccountResponse>(url, body, {
    headers: {
      Authorization: `Key ${ROUTER_API_KEY}`,
    },
  })

  if (!response.data.resource.fullName) {
    return alternativeName
  }

  return response.data.resource.fullName
}
