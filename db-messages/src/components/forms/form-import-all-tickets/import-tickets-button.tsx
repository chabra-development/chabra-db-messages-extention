"use client"

import { ImportProgressToast } from "@/components/import-data-toast"
import { InputGroupButton } from "@/components/ui/input-group"
import { useImportTickets } from "@/hooks/use-import-tickets"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

export function ImportTicketsButton() {
    
    const [jobId, setJobId] = useState<string | null>(null)
    const { importTickets, isPending } = useImportTickets()

    const handleImport = () => {
        importTickets(undefined, {
            onSuccess: (data) => {
                if (data.jobId) {
                    setJobId(data.jobId)
                }
            }
        })
    }

    return (
        <>
            <InputGroupButton
                onClick={handleImport}
                disabled={isPending}
                className="gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Iniciando...
                    </>
                ) : (
                    <>
                        <Download className="size-4" />
                        Importar Tickets
                    </>
                )}
            </InputGroupButton>

            {/* Toast de progresso */}
            {jobId && (
                <ImportProgressToast
                    message="tickets"
                    jobId={jobId}
                    onComplete={() => {
                        setJobId(null)
                        console.log("Importação de tickets concluída!")
                    }}
                />
            )}
        </>
    )
}