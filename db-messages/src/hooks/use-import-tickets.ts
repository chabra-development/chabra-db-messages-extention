// src/hooks/use-import-tickets.ts
"use client"

import { importAllTickets } from "@/actions/tickets/import-all-tickets"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useImportTickets() {

    const {
        mutate,
        isPending,
        isSuccess,
        isError,
        data,
    } = useMutation({
        mutationKey: ["import-all-tickets"],
        mutationFn: async () => {
            return await importAllTickets()
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error("Erro ao iniciar importação")
            }
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Erro ao importar tickets")
            console.error(error)
        },
    })

    return {
        importTickets: mutate,
        isPending,
        isSuccess,
        isError,
        data,
    }
}