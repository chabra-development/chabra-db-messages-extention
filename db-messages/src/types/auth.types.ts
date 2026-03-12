import type { Role } from "@prisma/client"

export interface AuthenticatedUser {
    id: string
    name: string
    email: string
    role: Role
    isActive: boolean
    teams: string[]
    identity: string
    image?: string | null
    banner?: string | null
    emailVerified: boolean
}