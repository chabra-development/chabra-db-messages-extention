"use client"

import imageCompression from "browser-image-compression"

const IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]

const COMPRESSION_OPTIONS = {
    maxSizeMB: 1,           // máximo 1MB após compressão
    maxWidthOrHeight: 1920, // máximo 1920px
    useWebWorker: true,     // não bloqueia a UI
    preserveExif: false,    // remove metadados desnecessários
}

export function isCompressibleImage(file: File): boolean {
    return IMAGE_TYPES.includes(file.type) && file.type !== "image/gif"
}

export async function compressImageFile(file: File): Promise<File> {
    if (!isCompressibleImage(file)) return file

    // Só comprime se o arquivo for maior que 1MB
    if (file.size <= 1 * 1024 * 1024) return file

    const compressed = await imageCompression(file, COMPRESSION_OPTIONS)

    // Retorna o menor entre o original e o comprimido
    return compressed.size < file.size ? compressed : file
}