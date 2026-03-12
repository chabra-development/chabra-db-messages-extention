"use client"

import { importAttendants } from "@/actions/attendants/import-attendants"
import { useMutation } from "@tanstack/react-query"

export const ImportAttendantsButton = () => {

    const { mutate } = useMutation({
        mutationKey: ["import-attendants"],
        mutationFn: importAttendants
    })

    return (
        <div>

        </div>
    )
}
