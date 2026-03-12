import { Button } from "@/components/ui/button"
import { CardDescription} from "@/components/ui/card"
import { stringToHTML } from "@/functions/string-to-HTML"

export const ContactInterativeListRow = ({
    row: {
        title,
        description
    }
}: {
    row: {
        id: string;
        title: string;
        description?: string | undefined
    }
}) => {
    return (
        <div className="bg-transparent">
            <Button
                variant="outline"
                className="flex flex-col size-full whitespace-normal select-none"
            >
                {stringToHTML(title)}
                {
                    description && (
                        <CardDescription>
                            {description}
                        </CardDescription>
                    )
                }
            </Button>
        </div>
    )
}
