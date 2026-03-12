"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

type Permission = {
    readonly message?: "read"[] | undefined;
    readonly user?: ("list" | "create" | "delete" | "update" | "set-role" | "ban" | "impersonate" | "set-password" | "get")[] | undefined;
    readonly session?: ("list" | "delete" | "revoke")[] | undefined;
}

export async function requirePermission(permissions: Permission) {

    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { session: null, authorized: false }
    }

    const { success } = await auth.api.userHasPermission({
        body: {
            userId: session.user.id,
            permissions
        }
    })

    return { session, authorized: success }
}