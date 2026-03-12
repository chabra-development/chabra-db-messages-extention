import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { ac, roles } from "./permissions"

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL as string,
	plugins: [
		adminClient({ ac, roles } as Parameters<typeof adminClient>[0]),
	],
})

export type Session = typeof authClient.$Infer.Session