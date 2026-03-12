"use server"

import {
    extractNameFromBlipIdentity
} from "@/functions/extract-name-from-blip-identity"
import { auth } from "@/lib/auth"

type SignUpEmailInput = {
    email: string
    password: string
    identity: string
    teams: string[]
}

export async function signUpEmail({
    email,
    password,
    identity,
    teams
}: SignUpEmailInput) {

    const name = extractNameFromBlipIdentity(email)

    const { user } = await auth.api.signUpEmail({
        body: {
            email,
            name,
            password,
            identity,
            teams
        },
    })

    return { user }
}
