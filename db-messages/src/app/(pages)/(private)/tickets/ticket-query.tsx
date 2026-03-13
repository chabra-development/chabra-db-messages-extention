"use client"

import { findManyTickets } from "@/actions/blip/find-many-tickets"
import { ImportTicketsButton } from "@/components/forms/form-import-all-tickets/import-tickets-button"
import { LinkMessagesButton } from "@/components/forms/form-import-all-tickets/link-messages-button"
import { Pagination } from "@/components/pagination"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { InputGroup } from "@/components/ui/input-group"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { authClient } from "@/lib/auth-client"
import type { User } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { TicketInfoSheet } from "./ticket-info-sheet"
import { TicketsQueryLoading } from "./ticket-query-loading"

export const TicketsQuery = () => {

    const searchParams = useSearchParams()

    const take = searchParams.get("take")
    const skip = searchParams.get("skip")

    const {
        data: tickets,
        isLoading
    } = useQuery({
        queryKey: ["find-many-tickets", take, skip],
        queryFn: () => findManyTickets()
    })

    const { data: session } = authClient.useSession()

    if (isLoading || !tickets || !session) {
        return (
            <TicketsQueryLoading />
        )
    }

    const { role } = session.user as User

    const { resource: { items = [] } } = tickets

    return (
        <Card className="flex-1 border-none rounded-none">
            <CardHeader className="pb-6 border-b">
                <CardTitle className="text-2xl">
                    Tickets
                </CardTitle>
                <CardDescription>
                    Gerencie e visualize todos os tickets do sistema. Busque por número, filtre por status e visualize detalhes de cada ticket.
                </CardDescription>
                {
                    role === "ADMIN" && (
                        <CardAction >
                            <InputGroup>
                                <ImportTicketsButton />
                                <LinkMessagesButton />
                            </InputGroup>
                        </CardAction>
                    )
                }
            </CardHeader>
            <ScrollArea className="flex-1 min-h-200">
                <ScrollBar />
                <CardContent className="grid grid-cols-1 gap-2 space-y-2 px-2">
                    {
                        items.map((ticket, index) => (
                            <TicketInfoSheet
                                key={`${ticket.id}-${index}`}
                                ticket={ticket}
                            />
                        ))
                    }
                </CardContent>
            </ScrollArea>
            <CardFooter>
                <Pagination
                    paginationData={{
                        count: 0, page: 1, take: "10", totalPages: 1
                    }}
                    countLabel="Total de tickets"

                />
            </CardFooter>
        </Card>
    )
}  