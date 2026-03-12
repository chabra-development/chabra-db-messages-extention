"use client"

import {
    Card,
    CardAction,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    extractNameFromBlipIdentity
} from "@/functions/extract-name-from-blip-identity"
import { translateStatus } from "@/functions/translate-status-ticket"
import { cn } from "@/lib/utils"
import { formatDate } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "../ui/badge"
import { LimeTicket } from "@/types/lime-ticket-response.types"

export const TicketsQueryItem = ({
    ticket: {
        id,
        status,
        team,
        openDate,
        closeDate,
        closedBy
    }
}: { ticket: LimeTicket }) => {
    return (
        <Card className="min-h-40 cursor-pointer">
            <CardHeader>
                <CardTitle className="text-left">
                    {id}
                </CardTitle>
                <CardAction>
                    <Badge className={cn(
                        "text-sm text-primary",
                        translateStatus(status) === "aberto"
                            ? "bg-red-500"
                            : translateStatus(status) === "transferido"
                                ? "bg-orange-400"
                                : translateStatus(status) === "aguardando"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                    )}>
                        {translateStatus(status)}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col gap-2.5 items-start">
                <div className="flex">
                    fila:
                    <Badge
                        variant={"secondary"}
                        className="text-sm mx-2"
                    >
                        {
                            team !== "DIRECT_TRANSFER"
                                ? team : "transferência direta"
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
            </CardFooter>
        </Card>
    )
}