"use client"

import { importContacts } from "@/actions/contacts/import-contacts"
import { ImportProgressToast } from "@/components/import-data-toast"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Download } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const ImportAllContactsButton = () => {

    const queryClient = useQueryClient()
    const [jobId, setJobId] = useState<string | null>(null)

    const { mutate, isPending } = useMutation({
        mutationKey: ["import-contacts"],
        mutationFn: importContacts,
        onSuccess: (data) => {
            setJobId(data.jobId)
        },
        onError: (error) => {
            console.error(error)
            toast.error("Erro ao importar contatos", {
                description: error.message,
            })
        }
    })

    return (
        <>
            <Button
                variant="secondary"
                className="w-full"
                disabled={isPending || !!jobId}
                onClick={() => mutate()}
            >
                {isPending ? (
                    <>
                        <Spinner />
                        Iniciando importação...
                    </>
                ) : (
                    <>
                        <Download />
                        Importar contatos
                    </>
                )}
            </Button>

            {jobId && (
                <ImportProgressToast
                    jobId={jobId}
                    message="contatos"
                    onComplete={() => {
                        setJobId(null)
                        queryClient.invalidateQueries({ queryKey: ["find-many-contacts"] })
                    }}
                />
            )}
        </>
    )
}