"use server"

import { env } from "@/env"
import {
    isLimeMediaContent,
    isLimeReplyToMedia,
} from "@/guards/lime-thread-messages.guards"
import { LimeThreadMessage } from "@/types/lime-thread-messages-response.types"
import z from "zod"
import { resolveMediaUri } from "./resolve-media-uri"
import { uploadMediaFromUri } from "./upload-media-fro-uri"

const processMessageContentSchema = z.object({
    BLIP_DESK_API_KEY: z.string().nonempty("A BLIP_DESK_API_KEY é obrigatória."),
})

export async function processMessageContent(message: LimeThreadMessage): Promise<{
    content: LimeThreadMessage["content"]
    metadata?: LimeThreadMessage["metadata"]
}> {

    // Caso 1: content é mídia direta — { type, uri }
    if (isLimeMediaContent(message.content)) {
        try {
            
            const { data, error } = processMessageContentSchema.safeParse({
                BLIP_DESK_API_KEY: env.BLIP_DESK_API_KEY,
            })

            if (error) throw new Error(error.issues[0].message)

            const uri = await resolveMediaUri({
                uri: message.content.uri,
                deskApiKey: data.BLIP_DESK_API_KEY
            })

            if (!uri) throw new Error(`Não foi possível resolver a URI: ${message.content.uri}`)

            const publicUrl = await uploadMediaFromUri({
                uri,
                messageId: message.id
            })

            if (!publicUrl) throw new Error(`Falha ao fazer upload da mídia: ${message.id}`)

            return {
                content: { ...message.content, uri: publicUrl },
                metadata: message.metadata,
            }

        } catch (error) {
            console.error(`Failed to upload media for message ${message.id}:`, error)
        }
    }

    // Caso 2: content é reply com mídia no inReplyTo — { replied, inReplyTo: { value: { type, uri } } }
    if (isLimeReplyToMedia(message.content)) {
        try {
            
            const { data, error } = processMessageContentSchema.safeParse({
                BLIP_DESK_API_KEY: env.BLIP_DESK_API_KEY,
            })

            if (error) throw new Error(error.issues[0].message)

            const mediaUri = message.content.inReplyTo.value.uri

            const uri = await resolveMediaUri({
                uri: mediaUri,
                deskApiKey: data.BLIP_DESK_API_KEY
            })

            if (!uri) throw new Error(`Não foi possível resolver a URI: ${mediaUri}`)

            const publicUrl = await uploadMediaFromUri({
                uri,
                messageId: message.id
            })

            if (!publicUrl) throw new Error(`Falha ao fazer upload da mídia: ${message.id}`)

            return {
                content: {
                    ...message.content,
                    inReplyTo: {
                        ...message.content.inReplyTo,
                        value: {
                            ...message.content.inReplyTo.value,
                            uri: publicUrl,
                        },
                    },
                },
                metadata: message.metadata,
            }

        } catch (error) {
            console.error(`Failed to upload reply media for message ${message.id}:`, error)
        }
    }

    // Demais tipos — retorna content original sem modificação
    return {
        content: message.content,
        metadata: message.metadata,
    }
}