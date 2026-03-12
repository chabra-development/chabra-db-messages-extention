import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { LimeContactPayload } from "@/types/lime-thread-messages-response.types"
import { MessageDirection } from "@prisma/client"
import { formatDate } from "date-fns"
import { Copy, Phone } from "lucide-react"
import { toast } from "sonner"

export const ContactPhoneCard = ({
    direction,
    date,
    content: {
        phoneNumber,
        name,
        extras: {
            org
        }
    }
}: {
    direction: MessageDirection
    content: LimeContactPayload
    date: Date
}) => {

    const isSent = direction === MessageDirection.SENT

    async function onCopy(contact: string) {

        await navigator.clipboard.writeText(contact)

        toast(contact, {
            description: "O contato foi copiado para a área de transferência.",
            icon: <Copy className="size-4" />,
        })

    }

    return (
        <Card className={cn(
            "text-sm w-1/3 gap-2 pb-2",
            isSent
                ? "bg-message rounded-tr-none"
                : "dark:bg-muted bg-zinc-100 rounded-tl-none",
        )}>
            <CardHeader className="px-0 gap-4">
                <CardTitle className="truncate px-6">
                    {name}
                </CardTitle>
                <Separator />
                {
                    org && (
                        <CardDescription className="flex items-center gap-2 px-6 text-primary">
                            {org} - CONTA COMERCIAL
                        </CardDescription>
                    )
                }
                <div className="flex px-6 items-center justify-between">
                    <CardDescription className="flex items-center gap-2">
                        <Phone className="size-4" />
                        {phoneNumber}
                    </CardDescription>
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => onCopy(phoneNumber)}
                    >
                        <Copy />
                    </Button>
                </div>
            </CardHeader>
            <CardFooter className="ml-auto pb-2 px-2">
                <CardDescription>
                    {formatDate(date, "HH:mm")}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}
