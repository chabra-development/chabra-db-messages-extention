import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CardContent } from "@/components/ui/card"
import { formatDate } from "date-fns"
import { Triangle } from "lucide-react"

type Message = {
    id: string
    to: string
    from: string
    type: string
    createdAt: Date
    content: string
}

type ChatMessagesProps = {
    messages: Message[]
    currentUser: string
}

export const ChatMessages = ({ messages, currentUser }: ChatMessagesProps) => {
    return (
        <CardContent className="flex-1 flex flex-col gap-3 p-4 border-t">
            {
                messages.map(({ content, id, type, from, createdAt }) => {

                    if (type === "system") {
                        return (
                            <Alert
                                key={id}
                                className="mx-auto rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground w-fit"
                            >
                                <AlertTitle>
                                    {content}
                                </AlertTitle>
                            </Alert>
                        );
                    }

                    const isSender = from === currentUser;

                    return (
                        <div
                            key={id}
                            className={cn("flex", isSender ? "justify-end" : "justify-start")}
                        >
                            <Alert className={cn(
                                "max-w-[70%] w-fit px-4 py-2 text-sm text-foreground shadow-2xl after:absolute",
                                "max-w-[70%] rounded-lg bg-muted p-4",
                                isSender
                                    ? "dark:bg-[#144d37] bg-[#d9fdd3] rounded-tr-none"
                                    : "dark:bg-muted bg-zinc-100 rounded-tl-none"
                            )}>
                                <AlertDescription className="text-primary capitalize font-semibold mb-1.5">
                                    {from}
                                </AlertDescription>
                                <AlertTitle className="font-normal tracking-normal leading-normal break-words whitespace-pre-wrap block">
                                    {content}
                                </AlertTitle>
                                <AlertDescription>
                                    {formatDate(createdAt, "HH:mm")}
                                </AlertDescription>
                            </Alert>
                        </div>
                    );
                })}
        </CardContent>
    )
}