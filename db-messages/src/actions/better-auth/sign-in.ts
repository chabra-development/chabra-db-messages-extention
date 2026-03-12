"use server"

import { auth } from "@/lib/auth"

type SignInEmailInput = {
    email: string
    password: string
}

export async function signInEmail({ email, password }: SignInEmailInput) {

    const { user } = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    })

    return { user }
}
