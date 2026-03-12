import { Badge } from "@/components/ui/badge"
import { formatChatDate } from "@/functions/format-chat-date"
import { LimeThreadMessage } from "@/types/lime-thread-messages-response.types"
import { Message } from "@prisma/client"
import { isSameDay } from "date-fns"

type SystemInfoDateProps = {
    date: Date
    index: number
    array: Pick<Message, "id" | "direction" | "content" | "sentAt" | "status">[]
}

export const SystemInfoDate = ({
    date, index, array
}: SystemInfoDateProps) => {

    const currentDate = date

    const previousDate = (
        index > 0 ? new Date(array[index - 1].sentAt) : null
    )

    const showDateDivider = (
        !previousDate || !isSameDay(currentDate, previousDate)
    )

    if (showDateDivider) {
        return (
            <Badge
                variant="secondary"
                className="text-xs mx-auto py-2 px-4 mb-3"
            >
                {formatChatDate(currentDate)}
            </Badge>
        )
    }
}
