"use server"

import { env } from "@/env"
import { api } from "@/lib/axios"
import type { BlipAccountResponse } from "@/types/blip-account-response.types"
import { BodyBlib } from "@/types/index.types"
import { randomUUID } from "node:crypto"
import { z } from "zod"

const findContactIdByNumberPhoneSchema = z.object({
  ROUTER_API_KEY: z
    .string()
    .nonempty("A ROUTER_API_KEY é obrigatória."),
  numberPhone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .superRefine((value, ctx) => {

      const phone = value.startsWith("55") ? value.slice(2) : value

      if (![10, 11].includes(phone.length)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "O telefone deve conter DDD + número (10 dígitos para fixo ou 11 para celular).",
        })
        return
      }

      const ddd = phone.slice(0, 2)
      const number = phone.slice(2)

      if (ddd.startsWith("0")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "DDD inválido. O DDD não pode começar com 0.",
        })
      }

      if (number.length === 9 && !number.startsWith("9")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Número de celular inválido. Deve começar com 9.",
        })
      }

      if (number.length === 8 && !/^[2-5]/.test(number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Número fixo inválido. Deve começar com 2, 3, 4 ou 5.",
        })
      }
    }),
})

export async function findContactIdByNumberPhone(numberPhone: string) {

  const url = "https://chabra.http.msging.net/commands"

  const result = findContactIdByNumberPhoneSchema.safeParse({
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

  const response = await api.post<BlipAccountResponse>(url, body, {
    headers: {
      Authorization: `Key ${ROUTER_API_KEY}`,
    },
  })

  return response.data
}
