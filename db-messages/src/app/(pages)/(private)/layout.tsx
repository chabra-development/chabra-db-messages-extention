import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { AuthenticatedUser } from "@/types/auth.types"
import { LayoutProps } from "@/types/index.types"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function PrivateLayout({ children }: LayoutProps) {

	const cookieStore = await cookies()
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) redirect("/sign-in")

	return (
		<SidebarProvider
			defaultOpen={defaultOpen}
			className="size-full"
		>
			<AppSidebar user={session.user as unknown as AuthenticatedUser} />
				{children}
		</SidebarProvider>
	)
}
