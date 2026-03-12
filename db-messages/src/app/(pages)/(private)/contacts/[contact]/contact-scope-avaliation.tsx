import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { stringToHTML } from "@/functions/string-to-HTML"
import { cn } from "@/lib/utils"
import { LimeSelectContent } from "@/types/lime-thread-messages-response.types"
import { MessageDirection } from "@prisma/client"
import { formatDate } from "date-fns"

export const ContactScopeAvaliation = ({
    direction,
    date,
    content: { options, text }
}: {
    content: LimeSelectContent
    direction: MessageDirection
    date: Date
}) => {

    const isSent = direction === MessageDirection.SENT

    return (
        <Card className={cn(
            "w-1/2 text-sm",
            "@max-5xl/chat:w-9/10",
            isSent
                ? "bg-message rounded-tr-none"
                : "dark:bg-muted bg-zinc-100 rounded-tl-none"
        )}>
            <CardHeader>
                <CardTitle>
                    {stringToHTML(text)}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {
                    options
                        .map(({ text }, index) => (
                            <Button
                                key={index}
                                className="w-full select-none"
                                variant={"outline"}
                                type="button"
                            >
                                {text}
                            </Button>
                        ))
                }
            </CardContent>
            <CardFooter>
                <CardDescription className="ml-auto">
                    {formatDate(date, "HH:mm")}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}
