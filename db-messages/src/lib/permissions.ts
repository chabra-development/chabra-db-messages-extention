import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

export const statement = {
    ...defaultStatements,
    message: ["read"],   
} as const

export const ac = createAccessControl(statement)

export const userRole = ac.newRole({
    message: ["read"],
})

export const supervisorRole = ac.newRole({
    message: ["read"],
    user: ["list", "get"],
})

export const adminRole = ac.newRole({
    ...adminAc.statements,
    message: ["read"],
})

export const roles = {
    USER: userRole,
    SUPERVISOR: supervisorRole,
    ADMIN: adminRole,
} as const

export type AppRole = keyof typeof roles