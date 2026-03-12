import { togglePinnedContact } from "@/actions/user-preference/toggle-pinned-contact"
import { toast } from "@/components/toast"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { queryClient } from "@/providers/theme-provider"
import { ContactUserPreference } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { Pin, PinOff } from "lucide-react"

type PinnedButtonProps = {
    contactId: string
    preference: ContactUserPreference | null
}

export const PinnedButton = ({
    contactId, preference
}: PinnedButtonProps) => {

    const { mutate } = useMutation({
        mutationKey: ["toggle-favorite-contact"],
        mutationFn: togglePinnedContact,
        onSuccess: ({ pinned }) => {
            toast({
                title: `Contato ${pinned
                    ? "retirado dos"
                    : "adicionado aos"} 
                    fixados`
            })

            queryClient.invalidateQueries({
                queryKey: ["find-contact-by-id", contactId]
            })
        }
    })

    const myPreferenceExist = preference?.pinned ?? false

    const IconPin = myPreferenceExist ? PinOff : Pin

    function handleTogglePinnedContact() {
        mutate(contactId)
    }

    return (
        <DropdownMenuItem onClick={handleTogglePinnedContact}>
            <IconPin className={cn(!myPreferenceExist && "fill-primary")} />
            {
                myPreferenceExist
                    ? "Retirar dos fixados"
                    : "Fixar contato"
            }
        </DropdownMenuItem>
    )
}
