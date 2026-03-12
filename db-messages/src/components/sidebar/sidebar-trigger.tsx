"use client"

import {
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export const SidebarTrigger = () => {
	
	const { open, toggleSidebar } = useSidebar()

	return (
		<SidebarMenuItem>
			<SidebarMenuButton onClick={toggleSidebar}>
				<ChevronRight className={cn("duration-200", open && "rotate-180")} />
				<span>{open && "Minimizar"}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}
