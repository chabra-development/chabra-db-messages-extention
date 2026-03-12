"use server"

import { api } from "@/lib/axios"
import { randomUUID } from "node:crypto"

type RefreshMediaUriProps = {
    expiredUri: string
    deskApiKey: string
}

/**
 * Renova uma URI de mídia expirada do BLiP
 */
export async function refreshMediaUri({
    deskApiKey, expiredUri
}: RefreshMediaUriProps): Promise<string | null> {

    const response = await api.post(
        "https://chabra.http.msging.net/commands",
        {
            id: randomUUID(),
            to: "postmaster@media.msging.net",
            method: "set",
            uri: "/refresh-media-uri",
            type: "text/plain",
            resource: expiredUri,
        },
        {
            headers: { Authorization: `Key ${deskApiKey}` },
        }
    )

    if (response.data.status !== "success") return null

    return response.data.resource as string
}