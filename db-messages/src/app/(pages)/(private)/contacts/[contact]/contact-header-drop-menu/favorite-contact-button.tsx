import { toggleFavoriteContact } from "@/actions/user-preference/toggle-favorite-contact"
import { toast } from "@/components/toast"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { queryClient } from "@/providers/theme-provider"
import type { ContactUserPreference } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { Heart, HeartMinus } from "lucide-react"

type FavoriteContactButtonProps = {
    contactId: string
    preference: ContactUserPreference | null
}

export const FavoriteContactButton = ({
    contactId, preference
}: FavoriteContactButtonProps) => {

    const { mutate } = useMutation({
        mutationKey: ["toggle-favorite-contact"],
        mutationFn: toggleFavoriteContact,
        onSuccess: ({ favorite }) => {
            toast({
                title: `Contato ${favorite
                    ? "retirado dos"
                    : "adicionado aos"} 
                    favoritos`
            })

            queryClient.invalidateQueries({
                queryKey: ["find-contact-by-id", contactId]
            })
        }
    })

    const myPreferencesExist = preference?.favorite ?? false

    const IconHeart = myPreferencesExist ? HeartMinus : Heart

    function handleToggleFavoriteContact() {
        mutate(contactId)
    }

    return (
        <DropdownMenuItem onClick={handleToggleFavoriteContact}>
            <IconHeart className={cn(
                "text-red-500",
                !myPreferencesExist && "fill-red-500"
            )} />
            {
                myPreferencesExist
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
            }
        </DropdownMenuItem>
    )
}