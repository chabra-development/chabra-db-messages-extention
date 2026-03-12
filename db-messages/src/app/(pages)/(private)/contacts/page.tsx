import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { MessageCircleX } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "contatos | db-message"
}

export default async function Contact() {
    return (
        <div className="size-full flex items-center justify-center">
            <Card className="w-4/6 bg-transparent border-none shadow-none">
                <CardHeader>
                    <CardTitle className="mx-auto text-2xl">
                        <MessageCircleX className="size-20" />
                    </CardTitle>
                </CardHeader>
                <CardHeader className="w-full flex flex-col items-center">
                    <CardTitle className="mx-auto text-2xl">
                        Nenhuma conversa selecionada
                    </CardTitle>
                    <CardDescription className="mx-auto font-normal text-lg">
                        Selecione um contato para visualizar as conversas
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}