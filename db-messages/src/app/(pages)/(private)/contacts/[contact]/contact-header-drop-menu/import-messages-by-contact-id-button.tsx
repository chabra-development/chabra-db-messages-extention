import { importContactMessagesByContactId } from "@/actions/messages/import-messages-by-contact-id"
import { ImportProgressToast } from "@/components/import-data-toast"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RefreshCcw } from "lucide-react"
import { RefObject, useState } from "react"
import { toast } from "sonner"

type ImportMessagesByContactIdButtonProps = {
    contactId: string
    isFirstLoad: RefObject<boolean>
}

export const ImportMessagesByContactIdButton = ({
    isFirstLoad, contactId
}: ImportMessagesByContactIdButtonProps) => {

    const queryClient = useQueryClient()

    const [jobId, setJobId] = useState<string | null>(null)

    const { mutate } = useMutation({
        mutationKey: ["import-contact-messages"],
        mutationFn: importContactMessagesByContactId,
        onSuccess: (data) => {
            setJobId(data.jobId)
        },
        onError: (error) => {
            console.error(error)
            toast.error("Erro ao importar mensagens", {
                description: error.message,
            })
        }
    })

    return (
        <>
            <DropdownMenuItem onClick={e => {
                e.preventDefault()
                mutate(contactId)
            }}>
                <RefreshCcw />
                Sincronizar mensagens
            </DropdownMenuItem>
            {
                jobId && (
                    <ImportProgressToast
                        jobId={jobId}
                        message="mensagens"
                        onComplete={() => {
                            queryClient.invalidateQueries({
                                queryKey: ["find-messages-infinte-scroll", contactId]
                            })
                            setJobId(null)
                            isFirstLoad.current = true
                        }}
                    />
                )
            }
        </>
    )
}
