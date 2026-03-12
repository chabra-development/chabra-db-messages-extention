import { ContactsLayoutWrapper } from "@/app/(pages)/(private)/contacts/contacts-layout-wrapper"
import { LayoutProps } from "@/types/index.types"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: `Contatos | DB Messages`
}

export default function LayoutContact({ children }: LayoutProps) {
    return (
        <ContactsLayoutWrapper>
            {children}
        </ContactsLayoutWrapper>
    )
}