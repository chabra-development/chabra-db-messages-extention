const ACCEPTED_FILE_TYPES = [
    // imagens
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // audio
    "audio/ogg",
    "audio/mpeg",
    "audio/mp4",
    "audio/aac",
    "audio/wav",
    // vídeo
    "video/mp4",
    "video/ogg",
    "video/webm",
    // documentos
    "application/pdf",
    "text/plain",
    "text/csv",
    // office
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",   // .docx
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",         // .xlsx
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    // compactados
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/gzip",
]

export function isAllowedMediaType(type: string): boolean {
    return ACCEPTED_FILE_TYPES.includes(type)
}