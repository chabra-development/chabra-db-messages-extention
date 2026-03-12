"use client"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { AuthenticatedUser } from "@/types/auth.types"
import {
	BookUser,
	ChevronUp,
	Cog,
	Hash,
	LucideIcon,
	Settings,
	ShieldUser,
	Tag,
	UserCircle2,
	UsersRound
} from "lucide-react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarModeToggle } from "./sidebar-mode-toogle"
import { SidebarTrigger } from "./sidebar-trigger"
import { SignOutButton } from "./sign-out-button"

type SidebarItem = {
	label: string
	href: Route
	icon: LucideIcon
}

export const AppSidebar = ({ user }: { user: AuthenticatedUser }) => {

	const pathname = usePathname()

	const isAdmin = user.role === "ADMIN"

	const sidebarMenuItems: SidebarItem[] = [
		{
			label: "Contatos",
			href: "/contacts",
			icon: BookUser
		},
		{
			label: "Tickets",
			href: "/tickets",
			icon: Tag
		},
		{
			label: "Opções",
			href: "/settings",
			icon: Settings
		},
	] as const

	const sidebarMenuItemsAdmin: SidebarItem[] = [
		{
			label: "Atendentes",
			href: "/attendants?skip=0&take=10",
			icon: UsersRound
		},
		{
			label: "Tags",
			href: "/tags",
			icon: Hash
		}
	]

	return (
		<Sidebar
			variant="floating"
			collapsible="icon"
			className="bg-transparent"
		>
			<SidebarContent className="bg-transparent">
				<SidebarGroup>
					<SidebarGroupLabel className="text-primary text-xl mb-4">
						Messages
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarTrigger />
							{
								sidebarMenuItems.map(({
									href, icon: Icon, label
								}) => (
									<SidebarMenuItem key={href}>
										<SidebarMenuButton asChild>
											<Link
												title={label}
												href={href}
												className={cn(pathname.includes(href) && "border border-primary")
												}
											>
												<Icon />
												<span>
													{label}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))
							}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{
					isAdmin && (
						<>
							<SidebarSeparator className="mx-0" />
							<SidebarGroup>
								<SidebarGroupLabel className="gap-2">
									Admin
									<ShieldUser />
								</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{
											sidebarMenuItemsAdmin.map(({
												href, icon: Icon, label
											}) => (
												<SidebarMenuItem key={href}>
													<SidebarMenuButton asChild>
														<Link
															title={label}
															href={href}
															className={cn(pathname.includes(href) && "border border-primary")
															}
														>
															<Icon />
															<span>
																{label}
															</span>
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))
										}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</>
					)
				}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<UserCircle2 className="size-10" />
									<span>{user.name}</span>
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top">
								<DropdownMenuItem asChild>
									<Link href={"/settings"}>
										<Cog />
										<span>Opções</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<SidebarModeToggle />
								</DropdownMenuItem>
								<SignOutButton />
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
