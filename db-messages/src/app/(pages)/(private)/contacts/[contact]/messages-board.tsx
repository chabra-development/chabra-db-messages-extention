import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { isUnknownContent } from "@/guards/lime-thread-messages.guards"
import { cn } from "@/lib/utils"
import type { Message } from "@prisma/client"
import { MessageRenderer } from "./message-renderer"
import { SystemInfoDate } from "./system-info-date"

type MessagesBoardProps = {
    messages: Pick<Message, "id" | "direction" | "content" | "sentAt" | "status">[]
}

export const MessagesBoard = ({ messages }: MessagesBoardProps) => {

    if (messages.length === 0) {
        return (
            <Card className="flex-1 h-full bg-transparent border-none">
                <CardContent className="size-full flex justify-center">
                    <CardDescription className="text-xl">
                        Esse contato ainda não possui uma conversa
                    </CardDescription>
                </CardContent>
            </Card>
        )
    }

    // ✅ valida uma vez, fora do map
    const unknownMessage = messages.find(
        ({ content }) => isUnknownContent(content)
    )

    if (unknownMessage) {

        console.log(unknownMessage)

        throw new Error(`tipo não tratado: ${JSON.stringify(unknownMessage.content)}`)
    }

    return (
        <CardContent className="space-y-2 px-2">
            {messages.map((message, index, array) => (
                <div
                    key={message.id}
                    className={cn(
                        "w-full max-w-full min-w-0 flex flex-col",
                        message.direction === "SENT" ? "items-end" : "items-start"
                    )}
                >
                    <SystemInfoDate
                        index={index}
                        array={array}
                        date={message.sentAt}
                    />
                    <MessageRenderer message={message} />
                </div>
            ))}
        </CardContent>
    )
}