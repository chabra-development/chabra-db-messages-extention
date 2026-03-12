"use server"

import { uploadFile } from "../supabase/upload-files"
import { isAllowedMediaType } from "./is-allowed-media-type"

type UploadMediaFromUriProps = {
    uri: string
    messageId: string
}

/**
 * Faz o download e upload de uma URI de mídia para o Supabase.
 * Retorna a URL pública ou null se falhar.
 */
export async function uploadMediaFromUri({
    uri, messageId
}: UploadMediaFromUriProps): Promise<string | null> {

    const response = await fetch(uri)

    const blob = await response.blob()
    const file = new File([blob], messageId, { type: blob.type })

    if (!isAllowedMediaType(file.type)) {
        throw new Error(`Tipo de mídia não permitido: ${blob.type}`)
    }

    return await uploadFile(file, messageId)
}