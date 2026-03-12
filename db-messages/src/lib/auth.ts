import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins"
import { randomUUID } from "node:crypto"
import { ac, roles } from "./permissions"
import { prisma } from "./prisma"

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL as string,
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google"],
			allowDifferentEmails: false,
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			mapProfileToUser: (profile) => {
				console.log("🔍 Google profile:", profile)
				return {
					image: profile.picture,
				}
			}
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		autoSignIn: true,
	},
	user: {
		deleteUser: {
			enabled: true,
		},
		additionalFields: {
			identity: {
				type: "string",
				required: false,
				defaultValue: "",
				input: true,
			},
			teams: {
				type: "string[]",
				defaultValue: [],
			},
			isActive: {
				type: "boolean",
				required: false,
				defaultValue: true,
				input: false,
			},
			banner: {
				type: "string",
				required: false,
				input: false,
			},
		},
	},
	trustedOrigins: [process.env.BETTER_AUTH_URL as string],
	advanced: {
		database: {
			generateId: () => randomUUID(),
		},
		useSecureCookies: process.env.NODE_ENV === "production",
		cookieSameSite: "lax",
	},
	plugins: [
		nextCookies(),
		admin({
			ac,
			roles,
			defaultRole: "USER",
			adminRoles: ["ADMIN"],
		}),
	],
})