import { auth } from "@/lib/auth"
import { Route } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function getSession() {
    
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    return session
}

export async function getSessionOrRedirect(redirectTo = "/sign-in") {
    
    const session = await getSession()

    if (!session) redirect(redirectTo as Route)

    return session
}