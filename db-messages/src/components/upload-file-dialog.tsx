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
import { Button } from "@/components/ui/button"
import { UploadFile } from "./upload-file"
import { Paperclip } from "lucide-react"

export const UploadFileDialog = () => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    Importar Tickets
                    <Paperclip />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2/3 w-1/3">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Importar Tickets
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <UploadFile />
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction>
                        Importar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
