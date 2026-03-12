import { Metadata } from "next"
import { TagClient } from "./tags-query"

export const metadata: Metadata = {
    title: "Tags | db-messages"
}

export default function Tag() {
    return (
        <TagClient />
    )
}
