import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { stringToHTML } from "@/functions/string-to-HTML"
import { cn } from "@/lib/utils"
import { MessageDirection } from "@/constants/prisma-enums"
import { formatDate } from "date-fns"

export const ContactReplyToSelectResponse = ({
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
                "w-full max-w-md text-sm py-2 gap-2",
                "@max-5xl/chat:max-w-[90%]",
                isSent
                    ? "bg-message rounded-tr-none"
                    : "bg-muted rounded-tl-none"
            )}
        >
            <CardHeader className="px-1">
                <CardTitle className="max-h-8 h-fit bg-card/30 py-2.5 px-4 rounded-sm text-muted-foreground truncate">
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
