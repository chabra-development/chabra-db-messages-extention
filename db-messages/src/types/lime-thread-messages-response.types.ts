export const KNOWN_MESSAGE_TYPES = [
    "text/plain",
    "application/vnd.lime.select+json",
    "application/vnd.lime.reply+json",
    "application/vnd.lime.media-link+json",
] as const

export const KNOWN_MEDIA_MIME_TYPES = [
    // 📹 Vídeo
    "video/mp4",

    // 🖼️ Imagem
    "image/jpeg",
    "image/png",
    "image/webp",

    // 🎧 Áudio
    "audio/ogg",
    "audio/ogg; codecs=opus",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",

    // 🧩 Sticker
    "sticker/webp",
] as const

export type KnownMessageType = typeof KNOWN_MESSAGE_TYPES[number]
export type KnownMediaMimeType = typeof KNOWN_MEDIA_MIME_TYPES[number]

/* ======================================================
 * LIME Thread Messages – Response
 * ====================================================== */

export type LimeThreadMessagesResponse = {
    type: "application/vnd.lime.collection+json"
    method: "get"
    status: "success" | "failure"
    id: string
    from: string
    to: string
    resource: LimeThreadMessagesResource
}

export type LimeThreadMessagesResource = {
    total: number
    itemType: "application/vnd.iris.thread-message+json"
    items: LimeThreadMessage[]
}

export type LimeThreadMessage = {
    id: string
    direction: "sent" | "received"
    type: string
    date: string
    status: "consumed" | "dispatched"
    content: LimeMessageContent
    metadata?: LimeMetadata
}

export type LimeMetadata = {
    $elapsedTimeToStorage?: string
    $originator?: string
    $internalId?: string
    $claims?: string
    $originatorSessionRemoteNode?: string

    date_created?: string
    "#date_processed"?: string

    "#message.agentIdentity": string
    "#message.ticketId": string
    "#messageId"?: string
    "#messageKind"?: "Response" | "Notification" | string
    "#previousStateId"?: string
    "#previousStateName"?: string
    "#stateId"?: string
    "#stateName"?: string

    "#uniqueId"?: string
    "#inReplyToId"?: string
    "#messageReferenceInternalID"?: string

    "#wa.timestamp"?: string
    "#wa.context.from"?: string
    "#wa.context.id"?: string
    "#wa.message.id"?: string
    "#wa.interactive.list.id"?: string
    "#wa.interactive.button.id"?: string
    "#wa.forwarded"?: boolean | null
    "#wa.frequently_forwarded"?: boolean | null
    "#wa.context.group_id"?: string | null

    "#tunnel.owner"?: string
    "#tunnel.originator"?: string
    "#tunnel.originalFrom"?: string
    "#tunnel.originalTo"?: string

    traceparent?: string

    [key: string]: unknown
}

/* ======================================================
 * Content Union
 * ====================================================== */

export type LimeMessageContent =
    // Conteúdos diretos
    | LimeTextContent
    | LimeMediaContent
    | LimeSelectContent
    | LimeTemplateContent
    | LimeTicketContent
    | LimeContactPayload
    | LimeEmojiReaction
    // Interativos
    | LimeInteractiveMessage
    // Replies
    | LimeReplyToInteractive       // era: LimeReplyContent
    | LimeReplyToText              // era: LimeReplyTextContent
    | LimeReplyToSelect            // era: LimeReplyToSelectContent
    | LimeReplyToMedia             // era: LimeMediaContentResponse
    | LimeReplyToContact           // era: LimeContactContentResponse
    | LimeReplyToUnknown           // era: LimeContentReply

/* ======================================================
 * Primitivos compartilhados
 * ====================================================== */

export type LimeDirection = "sent" | "received"

export type LimeRepliedText = {
    type: "text/plain"
    value: string
}

export type LimeInReplyToBase = {
    id: string
    direction: LimeDirection
}

/* ======================================================
 * Conteúdos diretos
 * ====================================================== */

export type LimeTextContent = string

export type LimeMediaContent = {
    type: string
    uri: string
}

export type LimeSelectContent = {
    scope?: "immediate"
    text: string
    options: Array<{ text: string }>
}

export type LimeTemplateContent = {
    type: "template"
    template: {
        name: string
        language: {
            code: string
            policy: string
        }
        components: Array<{
            type: string
            parameters: Array<{
                type: string
                text?: string
            }>
        }>
    }
}

// Ticket completo (enviado pelo agente/sistema)
export type LimeTicketContent = {
    id: string
    sequentialId: number
    ownerIdentity: string
    customerIdentity: string
    customerDomain: string
    provider: string
    status: string
    storageDate: string
    rating: number
    closed: boolean
    priority: number
    // opcionais — ausentes em alguns payloads
    externalId?: string
    team?: string
    unreadMessages?: number
    parentSequentialId?: number
    customerInput?: {
        type: string
        value: string
    }
}

export type LimeContactPayload = {
    name: string
    phoneNumber: string
    cellPhoneNumber: string
    firstName: string
    extras: {
        org: string | null
    }
}

export type LimeEmojiReaction = {
    emoji: {
        values: number[]
    }
    inReactionTo: {
        id: string
        type: string
        value: string
        direction: LimeDirection
    }
}

/* ======================================================
 * Interactive
 * ====================================================== */

export type LimeInteractiveMessage = {
    recipient_type: "individual"
    type: "interactive"
    interactive: LimeInteractiveContent
}

export type LimeInteractiveContent =
    | LimeInteractiveButton
    | LimeInteractiveList
    | LimeReceivedInteractiveObject

export type LimeReceivedInteractiveObject = {
    direction: LimeDirection
    object: LimeInteractiveList
}

export type LimeInteractiveButton = {
    type: "button"
    body: { text: string }
    action: {
        buttons: LimeInteractiveReplyButton[]
    }
}

export type LimeInteractiveReplyButton = {
    type: "reply"
    reply: {
        id: number | string
        title: string
    }
}

export type LimeInteractiveList = {
    type: "list"
    body: { text: string }
    action: {
        button: string
        sections: Array<{
            title: string
            rows: Array<{
                id: string
                title: string
                description?: string
            }>
        }>
    }
}

/* ======================================================
 * Replies
 * ====================================================== */

// Reply a uma mensagem interativa
// era: LimeReplyContent
export type LimeReplyToInteractive = {
    replied: {
        type: string
        value: string
    }
    inReplyTo: LimeInReplyToBase & {
        type: string
        value: LimeInteractiveMessage
    }
}

// Reply a um texto simples
// era: LimeReplyTextContent
export type LimeReplyToText = {
    replied: LimeRepliedText
    inReplyTo: {
        id?: string          // ✅ opcional
        type: "text/plain"
        value: string
        direction: LimeDirection
    }
}

// Reply a um select/menu
// era: LimeReplyToSelectContent
export type LimeReplyToSelect = {
    replied: LimeRepliedText
    inReplyTo: LimeInReplyToBase & {
        type: "application/vnd.lime.select+json"
        value: LimeSelectContent
    }
}

// Reply a uma mídia (imagem, vídeo, etc)
// era: LimeMediaContentResponse
export type LimeReplyToMedia = {
    replied: LimeRepliedText
    inReplyTo: LimeInReplyToBase & {
        type: "application/vnd.lime.media-link+json"
        value: LimeMediaContent
    }
}

// Reply a um contato
// era: LimeContactContentResponse
export type LimeReplyToContact = {
    replied: LimeRepliedText
    inReplyTo: LimeInReplyToBase & {
        type: "application/vnd.lime.contact+json"
        value: LimeContactPayload
    }
}

// Reply genérico onde só temos o id do inReplyTo
// era: LimeContentReply
export type LimeReplyToUnknown = {
    replied: {
        type: string
        value: string
    }
    inReplyTo: {
        id: string
    }
}