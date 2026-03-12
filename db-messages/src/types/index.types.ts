import { auth } from "@/lib/auth"
import { ReactNode } from "react"

export type LayoutProps = {
	children: ReactNode
}

export type Method = "get" | "set" | "delete" | "update"

export type BodyBlib = {
	id: string
	to: string
	method: Method
	uri: string
}

export type Session = typeof auth.$Infer.Session