"use client"

import { toast } from "@/components/toast"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export const SignOutButton = () => {

	const { push } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ["sign-out"],
		mutationFn: async () => {
			await authClient.signOut()
		},
		onSuccess: () => push("/sign-in"),
		onError: (error) => toast({
			title: "Erro ao sair",
			description: error.message,
			variant: "destructive",
		})
	})

	return (
		<DropdownMenuItem
			onClick={() => mutate()}
			disabled={isPending}
		>
			<LogOut />
			<span>
				{
					isPending ? "Saindo..." : "Sair"
				}
			</span>
		</DropdownMenuItem >
	)
}
