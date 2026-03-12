"use client"

import { toggleAttendantActive } from "@/actions/attendants/toggle-attendant-active"
import { toast } from "@/components/toast"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { queryClient } from "@/providers/theme-provider"
import { User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { Ellipsis } from "lucide-react"
import { useState } from "react"
import { DropdownMenuItemAlert } from "./dropdown-menu-item-alert"

export const ChangeRoleUserDialog = ({ user }: { user: User }) => {

    const [open, setOpen] = useState(false)
    
    const { name, isActive } = user

    const { mutate: toggleActive, isPending } = useMutation({
        mutationKey: ["toggle-attendant-active", user.id],
        mutationFn: () => toggleAttendantActive({ attendantId: user.id }),
        onSuccess: ({ name, isActive }) => {
            toast({
                title: isActive ? "Atendente ativado" : "Atendente desativado",
                description: `${name} foi ${isActive ? "ativado" : "desativado"} com sucesso.`,
                onAutoClose: () => setOpen(false),
            })
            queryClient.invalidateQueries({ queryKey: ["find-many-attendants"] })
        },
    })

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-card" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Opções</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItemAlert
                        title={`Alterar cargo do atendente "${name}"`}
                        description=""
                        user={user}
                        setDropdownOpen={setOpen}
                    >
                        Alterar cargo do atendente
                    </DropdownMenuItemAlert>
                    <DropdownMenuItem
                        disabled={isPending}
                        onSelect={(e) => {
                            e.preventDefault()
                            toggleActive()
                        }}
                    >
                        {isPending ? (
                            <Spinner className="mr-2 size-4" />
                        ) : null}
                        {isActive ? "Desativar atendente" : "Ativar atendente"}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}