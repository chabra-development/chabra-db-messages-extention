import { importAttendants } from "@/actions/attendants/import-attendants"
import { findManyAttendants } from "@/actions/blip/find-many-attendants"
import { toast } from "@/components/toast"
import { queryClient } from "@/providers/theme-provider"
import {
    ImportAttendantsProps, importAttendantsSchema
} from "@/schemas/import-attendants-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

export function useFormImportAttendants() {

    const [open, setOpen] = useState(false)
    const [jobId, setJobId] = useState<string | null>(null)

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<ImportAttendantsProps>({
        resolver: zodResolver(importAttendantsSchema),
        defaultValues: {
            attendents: []
        },
        mode: "onSubmit"
    })

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control,
        name: "attendents"
    })

    const {
        mutate,
        isPending,
    } = useMutation({
        mutationKey: ["import-attendants"],
        mutationFn: ({ attendents }: ImportAttendantsProps) => {
            return importAttendants({ attendents })
        },
        onSuccess: async ({ jobId }) => {

            setJobId(jobId)

            queryClient.invalidateQueries({
                queryKey: ["find-many-attendants"]
            })
        },
        onError: (error) => toast({
            title: error.name,
            description: error.message,
            variant: "destructive"
        })
    })

    const {
        data: attendants,
        isLoading
    } = useQuery({
        queryKey: ["find-many-attendants-blip"],
        queryFn: () => findManyAttendants()
    })

    const items = attendants?.resource.items ?? []
    const total = items.length
    const selected = fields.length
    const allSelected = total > 0 && selected === total

    const isChecked = (identity: string) =>
        fields.some(a => a.identity === identity)

    const indexByIdentity = (identity: string) =>
        fields.findIndex(a => a.identity === identity)

    function toggleAllAttendants() {

        if (!attendants) return

        if (allSelected) {
            remove()
            return
        }

        const all = attendants.resource.items.map(
            ({ identity, email, teams }) => ({
                identity,
                email,
                teams
            })
        )

        remove()
        append(all)
    }

    async function onSubmit(data: ImportAttendantsProps) {
        mutate(data)
    }

    return {
        open,
        setOpen,
        selected,
        total,
        isPending,
        allSelected,
        toggleAllAttendants,
        isChecked,
        handleSubmit,
        onSubmit,
        indexByIdentity,
        append,
        remove,
        errors,
        jobId,
        setJobId,
        attendants,
        isLoading,
        items,
        reset
    }
}
