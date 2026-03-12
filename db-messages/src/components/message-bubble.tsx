"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkPreviewCard } from "@/components/link-preview-card"

const URL_REGEX =
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*/g

export interface Message {
    id: string
    content: string
    sender: "me" | "other"
    senderName?: string
    senderAvatar?: string
    timestamp: Date
}

function parseMessageContent(content: string) {
    
    const parts: { type: "text" | "link"; value: string }[] = []
    let lastIndex = 0
    const urls: string[] = []

    let match: RegExpExecArray | null
    const regex = new RegExp(URL_REGEX)

    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({
                type: "text",
                value: content.slice(lastIndex, match.index),
            })
        }
        parts.push({ type: "link", value: match[0] })
        urls.push(match[0])
        lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
        parts.push({ type: "text", value: content.slice(lastIndex) })
    }

    return { parts, urls }
}

export function MessageBubble({ message }: { message: Message }) {
    
    const isMe = message.sender === "me"
    const { parts, urls } = parseMessageContent(message.content)

    return (
        <div
            className={cn(
                "flex items-end gap-2",
                isMe ? "flex-row-reverse" : "flex-row"
            )}
        >
            {!isMe && (
                <Avatar className="size-8 shrink-0">
                    {message.senderAvatar && (
                        <AvatarImage src={message.senderAvatar} alt={message.senderName || "User"} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {(message.senderName || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            )}

            <div
                className={cn(
                    "flex max-w-xs flex-col sm:max-w-sm md:max-w-md",
                    isMe ? "items-end" : "items-start"
                )}
            >
                {!isMe && message.senderName && (
                    <span className="mb-1 ml-1 text-xs font-medium text-muted-foreground">
                        {message.senderName}
                    </span>
                )}

                <div
                    className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        isMe
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md bg-secondary text-secondary-foreground"
                    )}
                >
                    {parts.map((part, i) =>
                        part.type === "link" ? (
                            <a
                                key={i}
                                href={part.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "underline decoration-1 underline-offset-2 transition-colors",
                                    isMe
                                        ? "text-primary-foreground/90 hover:text-primary-foreground"
                                        : "text-primary hover:text-primary/80"
                                )}
                            >
                                {part.value}
                            </a>
                        ) : (
                            <span key={i}>{part.value}</span>
                        )
                    )}
                </div>

                {urls.map((url) => (
                    <div key={url} className="w-full">
                        <LinkPreviewCard url={url} />
                    </div>
                ))}

                <span
                    className={cn(
                        "mt-1 text-[10px] text-muted-foreground",
                        isMe ? "mr-1" : "ml-1"
                    )}
                >
                    {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>
    )
}
