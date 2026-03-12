import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow, SortButton } from "./index"

export const RoleColumn: ColumnDef<AttendantRow> = {
    accessorKey: "role",
    header: ({ column }) => <SortButton column={column} label="Perfil" />,
    cell: ({ row }) => {

        const role = row.original.role

        return (
            <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
                {role === "ADMIN" ? "Admin" : "Usuário"}
            </Badge>
        )
    },
}