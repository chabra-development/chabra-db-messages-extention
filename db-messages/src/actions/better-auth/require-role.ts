"use server"

import { auth } from "@/lib/auth"
import type { AppRole } from "@/lib/permissions"
import { headers } from "next/headers"

export async function requireRole(...allowedRoles: AppRole[]) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return { session: null, hasRole: false }
    }

    const hasRole = allowedRoles.includes(session.user.role as AppRole)

    return { session, hasRole }
}