import {
    findMessagesByTicketId
} from "@/actions/blip/find-many-messages-by-ticket-id"
import { MessagesBoard } from "@/app/(pages)/(private)/contacts/[contact]/messages-board"
import { TicketsQueryItem } from "@/components/ticket/ticket-query-item"
import { toast } from "@/components/toast"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import {
    extractNameFromBlipIdentity
} from "@/functions/extract-name-from-blip-identity"
import { cn } from "@/lib/utils"
import { LimeTicket } from "@/types/lime-ticket-response.types"
import { useQuery } from "@tanstack/react-query"
import { formatDate } from "date-fns"
import { ptBR } from "date-fns/locale"

export const TicketInfoSheet = ({ ticket }: { ticket: LimeTicket }) => {

    const { id, sequentialId, team, openDate, closeDate, closedBy } = ticket

    return (
        <Sheet>
            <SheetTrigger>
                <TicketsQueryItem ticket={ticket} />
            </SheetTrigger>
            <SheetContent className="sm:max-w-5xl sm:w-full p-4 overflow-y-auto scrollbar-hover">
                <Card>
                    <SheetHeader>
                        <SheetTitle>
                            {id}
                        </SheetTitle>
                        <SheetDescription>
                            # {sequentialId}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="px-4 space-y-2.5">
                        <div className="flex">
                            fila:
                            <Badge
                                variant={"secondary"}
                                className="text-sm mx-2"
                            >
                                {
                                    team !== "DIRECT_TRANSFER"
                                        ? team
                                        : "transferência direta"
                                }
                            </Badge>
                        </div>
                        <div className="flex gap-4">
                            {
                                openDate && (
                                    <div className="flex">
                                        aberto em:
                                        <Badge className="text-sm mx-2">
                                            {formatDate(new Date(openDate), "PPP", { locale: ptBR })}
                                        </Badge>
                                    </div>
                                )
                            }
                            {
                                closeDate && (
                                    <div className="flex">
                                        fechado em:
                                        <Badge className="text-sm mx-2">
                                            {formatDate(closeDate, "PPP", { locale: ptBR })}
                                        </Badge>
                                    </div>

                                )
                            }
                        </div>
                        {
                            closedBy && (
                                <div className="flex">
                                    fechado por:
                                    <Badge className="text-sm mx-2 capitalize">
                                        {extractNameFromBlipIdentity(closedBy)}
                                    </Badge>
                                </div>
                            )
                        }
                    </div>
                </Card>
                <Separator />
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Conversa do ticket
                        </CardTitle>
                    </CardHeader>
                    <TicketInfoSheetItens id={id} />
                </Card>
            </SheetContent>
        </Sheet>
    )
}

export const TicketInfoSheetItens = ({ id }: { id: string }) => {

    const {
        data: ticketMessageResponse,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["find-many-messages-by-ticket-id", id],
        queryFn: () => findMessagesByTicketId(id)
    })

    if (!ticketMessageResponse || isLoading) {
        return (
            <CardContent className="border-t space-y-2 pt-2">
                {
                    Array.from({ length: 10 }).map((_, index) => {

                        const isLeft = [1, 4, 5, 10]

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "w-full flex",
                                    isLeft.includes(index)
                                        ? "justify-end"
                                        : "justify-start"
                                )}
                            >
                                <Alert className={cn(
                                    "w-[70%] h-20 px-4 py-2 pt-4 text-sm text-foreground shadow-2xl space-y-2",
                                    isLeft.includes(index)
                                        ? "bg-message rounded-tr-none"
                                        : "dark:bg-muted bg-zinc-100 rounded-tl-none"
                                )}>
                                    <AlertTitle />
                                </Alert>
                            </div>
                        )
                    })
                }
            </CardContent>
        )
    }

    if (error) {
        return (
            toast({
                title: error.name,
                duration: Infinity,
                description: error.message,
                variant: "destructive",
                action: {
                    label: "Tentar novamente",
                    onClick: () => refetch()
                }
            })
        )
    }

    return (
        <div></div>
        // <MessagesBoard messages={resource.items as unknown as Message[]} />
    )
}
