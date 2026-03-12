import { ImportAttendantsForm } from "@/components/forms/form-import-attendants/import-attendants-form"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { getSessionOrRedirect } from "@/functions/get-session"
import { Metadata } from "next"
import { AttendantsTableContainer } from "./attendants-query"

export const metadata: Metadata = {
    title: "Atendentes | db-messages"
}

export default async function Attendents() {

    const { user } = await getSessionOrRedirect()

    const isAdmin = user.role === "ADMIN"

    return (
        <Card className="w-full border-none shadow-none rounded-none">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Atendentes
                </CardTitle>
                <CardDescription>
                    Liste todos os atendentes cadastrados.
                </CardDescription>
                {
                    isAdmin && (
                        <CardAction>
                            <ImportAttendantsForm />
                        </CardAction>
                    )
                }
            </CardHeader>
            <CardContent>
                <AttendantsTableContainer />
            </CardContent>
        </Card>
    )
}