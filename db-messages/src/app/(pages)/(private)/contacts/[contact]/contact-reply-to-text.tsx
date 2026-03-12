import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { stringToHTML } from "@/functions/string-to-HTML"
import { cn } from "@/lib/utils"
import { MessageDirection } from "@prisma/client"
import { formatDate } from "date-fns"

export const ContactReplyToText = ({
    direction,
    date,
    response,
    title
}: {
    direction: MessageDirection
    date: Date
    response: string
    title: string
}) => {

    const isSent = direction === MessageDirection.SENT

    return (
        <Card
            className={cn(
                "w-full max-w-md text-sm",
                "@max-5xl/chat:max-w-[90%] pt-1 pb-2 gap-2",
                isSent
                    ? "bg-message rounded-tr-none"
                    : "bg-muted rounded-tl-none"
            )}
        >
            <CardHeader className="px-1">
                <CardTitle className="bg-card/30 py-2.5 px-4 rounded-sm text-muted-foreground wrap-break-word">
                    {stringToHTML(response)}
                </CardTitle>
            </CardHeader>
            <CardHeader className="px-1">
                <CardTitle className="px-2 rounded-md wrap-break-word">
                    {stringToHTML(title)}
                </CardTitle>
            </CardHeader>
            <CardFooter className="ml-auto">
                <CardDescription>
                    {formatDate(date, "HH:mm")}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}
