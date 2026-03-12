type GenerateNameFileParams = {
    contactId: string
    type: string
}

const EXTENSION_MAP: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
    "audio/wav": "wav",
    "video/mp4": "mp4",
    "video/ogg": "ogv",
    "video/webm": "webm",
    "application/pdf": "pdf",
    "text/plain": "txt",
    "text/csv": "csv",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/zip": "zip",
    "application/x-rar-compressed": "rar",
    "application/x-7z-compressed": "7z",
    "application/gzip": "gz",
}

const FOLDER_MAP: Record<string, string> = {
    "image/jpeg": "images",
    "image/png": "images",
    "image/gif": "images",
    "image/webp": "images",
    "image/svg+xml": "images",
    "audio/ogg": "audios",
    "audio/mpeg": "audios",
    "audio/mp4": "audios",
    "audio/aac": "audios",
    "audio/wav": "audios",
    "video/mp4": "videos",
    "video/ogg": "videos",
    "video/webm": "videos",
    "application/pdf": "documents",
    "text/plain": "documents",
    "text/csv": "documents",
    "application/msword": "documents",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "documents",
    "application/vnd.ms-excel": "documents",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "documents",
    "application/vnd.ms-powerpoint": "documents",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "documents",
    "application/zip": "archives",
    "application/x-rar-compressed": "archives",
    "application/x-7z-compressed": "archives",
    "application/gzip": "archives",
}

export function generateNameFile({ contactId, type }: GenerateNameFileParams): string {
    
    const ext = EXTENSION_MAP[type] ?? "bin"
    const folder = FOLDER_MAP[type] ?? "others"
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

    // {folder}/{contactId}_{timestamp}.{ext}
    // ex: images/abc123_2026-03-06T10-30-00-000Z.jpg
    return `${folder}/${contactId}_${timestamp}.${ext}`
}