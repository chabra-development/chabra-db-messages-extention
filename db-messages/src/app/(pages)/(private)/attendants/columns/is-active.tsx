import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow, SortButton } from "./index"

export const IsActiveColumn: ColumnDef<AttendantRow> = {
    accessorKey: "isActive",
    header: ({ column }) => <SortButton column={column} label="Status" />,
    cell: ({ row }) => {
        const isActive = row.original.isActive
        return (
            <Badge variant={isActive ? "default" : "destructive"}>
                {isActive ? "Ativo" : "Inativo"}
            </Badge>
        )
    },
}