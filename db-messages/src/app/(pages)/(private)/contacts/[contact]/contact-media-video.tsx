import { Card, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MessageDirection } from "@prisma/client"
import { formatDate } from "date-fns"
import dynamic from "next/dynamic"

const Plyr = dynamic(
    () => import("plyr-react").then(mod => mod.Plyr), { ssr: true }
)

export const ContactMediaVideo = ({
    direction,
    date,
    uri
}: {
    direction: MessageDirection
    date: Date
    uri: string
}) => {

    const isSent = direction === MessageDirection.SENT

    return (
        <Card className={cn(
            "w-fit max-w-md p-1.5 gap-0 overflow-hidden relative",
            isSent
                ? "bg-message rounded-tr-none"
                : "dark:bg-muted bg-zinc-100 rounded-tl-none"
        )} >
            <Plyr
                source={{
                    type: "video",
                    sources: [
                        {
                            src: uri,
                            type: "video/mp4",
                            size: 1080,
                        },
                    ],
                }}
                options={{
                    autoplay: true,
                    muted: true,
                    loop: { active: true },
                    controls: [],
                }}
            />
            <CardDescription className="absolute bottom-2.5 right-2.5 text-primary">
                {formatDate(date, "HH:mm")}
            </CardDescription>
        </Card>
    )
}
