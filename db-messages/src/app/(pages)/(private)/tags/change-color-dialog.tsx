import { FormChangeColorTagDialog } from "@/components/forms/form-change-color-tag-dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useState } from "react"

type ChangeColorDialogProps = {
    id: string
    color: string | null
}

export const ChangeColorDialog = ({ id, color }: ChangeColorDialogProps) => {

    const [open, setOpen] = useState(false)

    return (
        <AlertDialog
            open={open}
            onOpenChange={setOpen}
        >
            <AlertDialogTrigger>
                <div
                    style={{
                        background: color ?? undefined
                    }}
                    className={cn("size-8 rounded-full", !color && "bg-primary")}
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Alterar cor da tag
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Altera a cor da tag
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <FormChangeColorTagDialog
                    id={id}
                    onOpenChange={setOpen}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel variant={"destructive"}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        form="form-change-tag-color"
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
