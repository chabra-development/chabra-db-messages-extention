import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/functions/get-initials"
import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow } from "./index"

export const AvatarColumn: ColumnDef<AttendantRow> = {
    id: "avatar",
    header: "",
    cell: ({ row }) => {

        const { name, image } = row.original

        return (
            <Avatar className="size-8">
                {
                    image && (
                        <AvatarImage src={image} alt={name} />
                    )
                }
                <AvatarFallback className="text-xs">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>
        )
    },
    enableSorting: false,
    size: 48,
}