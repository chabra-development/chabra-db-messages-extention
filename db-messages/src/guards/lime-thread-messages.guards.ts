import { z } from "zod"
import type {
    LimeMediaContent,
    LimeEmojiReaction,
    LimeSelectContent,
    LimeInteractiveMessage,
    LimeReplyToInteractive,
    LimeReplyToText,
    LimeReplyToSelect,
    LimeReplyToMedia,
    LimeReplyToContact,
    LimeReplyToUnknown,
    LimeTicketContent,
    LimeContactPayload,
} from "@/types/lime-thread-messages-response.types"

/* ======================================================
 * Primitivos reutilizáveis
 * ====================================================== */

const DirectionSchema = z.enum(["sent", "received"])

const RepliedTextSchema = z.object({
    type: z.literal("text/plain"),
    value: z.string()
})

const InReplyToBaseSchema = z.object({
    id: z.string(),
    direction: DirectionSchema
})

const LimeContactValueSchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
    cellPhoneNumber: z.string(),
    firstName: z.string(),
    extras: z.object({
        org: z.string().nullable()
    })
})

/* ======================================================
 * Media
 * ====================================================== */

const LimeMediaContentSchema = z.object({
    type: z.string(),
    uri: z.string()
})

export function isLimeMediaContent(value: unknown): value is LimeMediaContent {
    return LimeMediaContentSchema.safeParse(value).success
}

/* ======================================================
 * Emoji
 * ====================================================== */

const LimeEmojiReactionSchema = z.object({
    emoji: z.object({
        values: z.array(z.number())
    }),
    inReactionTo: z.object({
        id: z.string(),
        type: z.string(),
        value: z.string(),
        direction: DirectionSchema
    })
})

export function isLimeEmojiReaction(value: unknown): value is LimeEmojiReaction {
    return LimeEmojiReactionSchema.safeParse(value).success
}

/* ======================================================
 * Select
 * ====================================================== */

const LimeSelectContentSchema = z.object({
    scope: z.literal("immediate").optional(),
    text: z.string(),
    options: z.array(z.object({ text: z.string() }))
})

export function isLimeSelectContent(value: unknown): value is LimeSelectContent {
    return LimeSelectContentSchema.safeParse(value).success
}

/* ======================================================
 * Interactive – Button
 * ====================================================== */

const LimeInteractiveButtonSchema = z.object({
    type: z.literal("button"),
    body: z.object({ text: z.string() }),
    action: z.object({
        buttons: z.array(z.unknown())
    })
})

export function isLimeInteractiveButton(value: unknown): value is z.infer<typeof LimeInteractiveButtonSchema> {
    return LimeInteractiveButtonSchema.safeParse(value).success
}

/* ======================================================
 * Interactive – List
 * ====================================================== */

const LimeInteractiveListSchema = z.object({
    type: z.literal("list"),
    body: z.object({ text: z.string() }),
    action: z.object({
        button: z.string(),
        sections: z.array(z.object({
            title: z.string(),
            rows: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().optional()
            }))
        }))
    })
})

export function isLimeInteractiveList(value: unknown): value is z.infer<typeof LimeInteractiveListSchema> {
    return LimeInteractiveListSchema.safeParse(value).success
}

/* ======================================================
 * Interactive Message
 * ====================================================== */

const LimeInteractiveMessageSchema = z.object({
    type: z.literal("interactive"),
    recipient_type: z.literal("individual"),
    interactive: z.unknown()
})

export function isLimeInteractiveMessage(value: unknown): value is LimeInteractiveMessage {
    return LimeInteractiveMessageSchema.safeParse(value).success
}

/* ======================================================
 * Ticket
 * ====================================================== */

const LimeTicketContentSchema = z.object({
    id: z.string(),
    sequentialId: z.number(),
    ownerIdentity: z.string(),
    customerIdentity: z.string(),
    customerDomain: z.string(),
    provider: z.string(),
    status: z.string(),
    storageDate: z.string(),
    rating: z.number(),
    closed: z.boolean(),
    priority: z.number(),
    // opcionais
    externalId: z.string().optional(),
    team: z.string().optional(),
    unreadMessages: z.number().optional(),
    parentSequentialId: z.number().optional(),
    customerInput: z.object({
        type: z.string(),
        value: z.string()
    }).optional()
})

export function isLimeTicketContent(content: unknown): content is LimeTicketContent {
    return LimeTicketContentSchema.safeParse(content).success
}

/* ======================================================
 * Contact Payload
 * ====================================================== */

export function isLimeContactPayload(value: unknown): value is LimeContactPayload {
    return LimeContactValueSchema.safeParse(value).success
}

/* ======================================================
 * Reply – inReplyTo Interactive
 * era: isLimeReplyContent
 * ====================================================== */

const LimeReplyToInteractiveSchema = z.object({
    replied: z.object({
        type: z.string(),
        value: z.string()
    }),
    inReplyTo: InReplyToBaseSchema.extend({
        type: z.string(),
        value: LimeInteractiveMessageSchema
    })
})

export function isLimeReplyToInteractive(value: unknown): value is LimeReplyToInteractive {
    return LimeReplyToInteractiveSchema.safeParse(value).success
}

/* ======================================================
 * Reply – inReplyTo Text (value string)
 * era: isLimeReplyToText
 * ====================================================== */

const LimeReplyToTextSchema = z.object({
    replied: RepliedTextSchema,
    inReplyTo: z.object({
        id: z.string().optional(),   // ✅ opcional
        type: z.literal("text/plain"),
        value: z.string(),
        direction: DirectionSchema
    })
})

export function isLimeReplyToText(value: unknown): value is LimeReplyToText {
    return LimeReplyToTextSchema.safeParse(value).success
}

/* ======================================================
 * Reply – inReplyTo Select
 * era: isLimeReplyToSelectContent
 * ====================================================== */

const LimeReplyToSelectSchema = z.object({
    replied: RepliedTextSchema,
    inReplyTo: InReplyToBaseSchema.extend({
        type: z.literal("application/vnd.lime.select+json"),
        value: LimeSelectContentSchema
    })
})

export function isLimeReplyToSelect(content: unknown): content is LimeReplyToSelect {
    return LimeReplyToSelectSchema.safeParse(content).success
}

/* ======================================================
 * Reply – inReplyTo Media
 * era: isLimeMediaContentResponse
 * ====================================================== */

const LimeReplyToMediaSchema = z.object({
    replied: RepliedTextSchema,
    inReplyTo: InReplyToBaseSchema.extend({
        type: z.literal("application/vnd.lime.media-link+json"),
        value: LimeMediaContentSchema
    })
})

export function isLimeReplyToMedia(content: unknown): content is LimeReplyToMedia {
    return LimeReplyToMediaSchema.safeParse(content).success
}

/* ======================================================
 * Reply – inReplyTo Contact
 * era: isLimeContactContentResponse
 * ====================================================== */

const LimeReplyToContactSchema = z.object({
    replied: RepliedTextSchema,
    inReplyTo: InReplyToBaseSchema.extend({
        type: z.literal("application/vnd.lime.contact+json"),
        value: LimeContactValueSchema
    })
})

export function isLimeReplyToContact(value: unknown): value is LimeReplyToContact {
    return LimeReplyToContactSchema.safeParse(value).success
}

/* ======================================================
 * Reply – inReplyTo Unknown (só id)
 * era: isLimeContentReply
 * ====================================================== */

const LimeReplyToUnknownSchema = z.object({
    replied: z.object({
        type: z.string(),
        value: z.string()
    }),
    inReplyTo: z.object({
        id: z.string()
    })
})

export function isLimeReplyToUnknown(content: unknown): content is LimeReplyToUnknown {
    return LimeReplyToUnknownSchema.safeParse(content).success
}

/* ======================================================
 * Unknown Content
 * ====================================================== */

const KNOWN_CONTENT_GUARDS = [
    isLimeReplyToText,
    isLimeReplyToInteractive,
    isLimeTicketContent,
    isLimeSelectContent,
    isLimeMediaContent,
    isLimeEmojiReaction,
    isLimeInteractiveButton,
    isLimeInteractiveList,
    isLimeInteractiveMessage,
    isLimeReplyToSelect,
    isLimeReplyToMedia,
    isLimeContactPayload,
    isLimeReplyToContact,
    isLimeReplyToUnknown,
] as const

export function isUnknownContent(content: unknown): boolean {
    if (content == null) return true
    if (typeof content === "string") return false
    return !KNOWN_CONTENT_GUARDS.some(guard => guard(content))
}