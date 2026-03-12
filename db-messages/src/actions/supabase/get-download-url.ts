"use server"

import { BUCKET_NAME } from "@/constraints/bucket"
import { supabase } from "@/lib/supabase"

function extractPath(input: string): string {
    // Se for URL completa, extrai o path após o bucket name
    if (input.startsWith("http")) {
        const marker = `${BUCKET_NAME}/`
        const index = input.indexOf(marker)
        if (index === -1) throw new Error("URL inválida — bucket não encontrado")
        return input.slice(index + marker.length)
    }
    // Se já for path relativo, retorna direto
    return input
}

export async function getDownloadUrl(input: string) {

    const path = extractPath(input)

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(path, 60)

    if (error) throw new Error(error.message)

    return {
        url: data.signedUrl,
        fileName: path.split("/").at(-1) ?? "arquivo"
    }
}