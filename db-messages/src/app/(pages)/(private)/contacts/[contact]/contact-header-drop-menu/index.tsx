import {
    findManyContactsTagByContactId
} from "@/actions/contact-tag/find-many-contacts-tag-by-contact-id"
import { FormCreateContactTags } from "@/components/forms/form-create-contact-tags"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import type { ContactUserPreference } from "@prisma/client"
import { useMutationState, useQuery } from "@tanstack/react-query"
import { Bookmark, MoreVertical } from "lucide-react"
import { RefObject, useState } from "react"
import { FavoriteContactButton } from "./favorite-contact-button"
import { ImportMessagesByContactIdButton } from "./import-messages-by-contact-id-button"
import { PinnedButton } from "./pinned-button"

export type ContactHeaderDropMenuProps = {
    contactId: string
    preference: ContactUserPreference | null
    isFirstLoad: RefObject<boolean>
}

export const ContactHeaderDropMenu = ({
    contactId, preference, isFirstLoad
}: ContactHeaderDropMenuProps) => {

    const { data: session } = authClient.useSession()

    const { data: tags, isLoading } = useQuery({
        queryKey: ["find-many-contacts-tag-by-contact-id", contactId],
        queryFn: () => findManyContactsTagByContactId(contactId)
    })

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const [status] = useMutationState({
        filters: { mutationKey: ["create-contact-tag"] },
        select: (mutation) => mutation.state.status
    })

    if (!tags || isLoading || !session) {
        return (
            <Button
                size={"icon"}
                variant="ghost"
                disabled
            >
                <MoreVertical className="size-5" />
            </Button>
        )
    }

    const isAdmin = session.user.role === "ADMIN"

    return (
        <>
            <AlertDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            >
                <AlertDialogContent className="w-1/3 bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Adicionar tags
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <Card className="pt-4">
                        <CardContent className="px-4">
                            <FormCreateContactTags
                                contactId={contactId}
                                tags={tags.map(({ tag }) => tag)}
                                setDialogOpen={setDialogOpen}
                                setDropdownOpen={setDropdownOpen}
                            />
                        </CardContent>
                    </Card>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            type="button"
                            variant="destructive"
                            className="w-1/3"
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <Button
                            form="form-create-contact-tags"
                            type="submit"
                            disabled={status === "pending"}
                            className="w-1/3"
                        >
                            {
                                status === "pending"
                                    ? (
                                        <Spinner />
                                    )
                                    : "Salvar"
                            }
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
            >
                <DropdownMenuTrigger asChild>
                    <Button
                        size={"icon"}
                        variant="ghost"
                    >
                        <MoreVertical className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuGroup>
                            <FavoriteContactButton
                                contactId={contactId}
                                preference={preference}
                            />
                            <PinnedButton
                                contactId={contactId}
                                preference={preference}
                            />
                            <ImportMessagesByContactIdButton
                                contactId={contactId}
                                isFirstLoad={isFirstLoad}
                            />
                        </DropdownMenuGroup>
                        {
                            isAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-muted-foreground">
                                            Admin
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem onSelect={e => {
                                            e.preventDefault()
                                            setDialogOpen(true)
                                        }}>
                                            <Bookmark />
                                            Adicionar tag
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </>
                            )
                        }
                    </DropdownMenu>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}