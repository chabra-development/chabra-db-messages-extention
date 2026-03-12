"use server"

import { refreshMediaUri } from "./refresh-media-uri"
import { isUriAccessible } from "./is-uri-acessible"

type ResolveMediaUriProps = {
    uri: string,
    deskApiKey: string
}

/**
 * Obtém a URI válida — verifica acessibilidade e renova se necessário
 */
export async function resolveMediaUri({
    uri, deskApiKey
}: ResolveMediaUriProps): Promise<string | null> {

    const accessible = await isUriAccessible({ uri, deskApiKey })

    if (accessible) return uri

    return await refreshMediaUri({ expiredUri: uri, deskApiKey })
}