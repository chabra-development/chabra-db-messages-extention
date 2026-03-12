import { Metadata } from "next"
import { TicketsQuery } from "./ticket-query"

export const metadata: Metadata = {
    title: "Tickets | db-messages"
}

export default function Ticket() {
    return <TicketsQuery />
}