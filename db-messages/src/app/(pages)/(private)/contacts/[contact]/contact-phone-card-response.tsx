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
import { CircleUserRound } from "lucide-react"

export const ContactPhoneCardResponse = ({
    direction,
    date,
    title,
    response
}: {
    direction: MessageDirection
    date: Date
    title: string
    response: string
}) => {

    const isSent = direction === MessageDirection.SENT

    return (
        <Card className={cn(
            "w-1/3 max-w-7/10 text-sm  py-1 gap-2",
            isSent
                ? "bg-message rounded-tr-none"
                : "bg-muted rounded-tl-none"
        )}>
            <CardHeader className="px-1">
                <CardTitle className="bg-card/30 py-2.5 px-4 rounded-sm text-muted-foreground flex items-center gap-2">
                    <CircleUserRound className="size-4" />
                    {response}
                </CardTitle>
            </CardHeader>
            <CardHeader className="px-1">
                <CardTitle className="px-2 rounded-md">
                    {stringToHTML(title)}
                </CardTitle>
            </CardHeader>
            <CardFooter className="ml-auto pb-2 px-2">
                <CardDescription>
                    {formatDate(date, "HH:mm")}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}


