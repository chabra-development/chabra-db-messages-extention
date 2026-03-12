import { findContactById } from "@/actions/contacts/find-contact-by-id"
import { ContactsQuery } from "./contacts-query"

type ContactParams = {
    params: Promise<{ contact: string }>
}

export async function generateMetadata({ params }: ContactParams) {

    const { contact } = await params

    const contactData = await findContactById<{ name: string }>(contact, {
        select: {
            name: true
        }
    })

    const name = contactData?.name ?? ""

    return {
        title: `conversa com ${name} | db-message`
    }
}

export default async function Contact({ params }: ContactParams) {

    const contact = decodeURIComponent((await params).contact)

    return (
        <ContactsQuery id={contact} />
    )
}