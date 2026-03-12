"use server"

type IsUriAccessibleProps = {
    uri: string
    deskApiKey: string
}

/**
 * Verifica se a URI está acessível via HEAD com a BLIP_DESK_API_KEY
 */
export async function isUriAccessible({
    uri, deskApiKey
}: IsUriAccessibleProps): Promise<boolean> {
    try {

        const response = await fetch(uri, {
            method: "HEAD",
            headers: { Authorization: `Key ${deskApiKey}` },
            signal: AbortSignal.timeout(5000),
        })

        const contentType = response.headers.get("Content-Type") ?? ""

        return response.ok && !contentType.includes("xml")
    } catch {
        return false
    }
}