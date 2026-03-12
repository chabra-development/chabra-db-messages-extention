"use server"

import { api } from "@/lib/axios"
import { LimeCollectionResponse } from "@/types/lime-collection-response.types"
import { randomUUID } from "node:crypto"

/**
 * Busca uma página de contatos da API
 */
export async function fetchContactsPage(
    routerApiKey: string,
    skip: number,
    TAKE: number
): Promise<LimeCollectionResponse> {

    const url = "https://chabra.http.msging.net/commands"

    const body = {
        id: randomUUID(),
        method: "get",
        uri: `/contacts?$skip=${skip}&$take=${TAKE}`
    }

    const response = await api.post<LimeCollectionResponse>(url, body, {
        headers: {
            Authorization: `Key ${routerApiKey}`,
        },
    })

    return response.data
}