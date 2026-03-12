import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow, SortButton } from "./index"

export const CreatedAtColumn: ColumnDef<AttendantRow> = {
    accessorKey: "createdAt",
    header: ({ column }) => <SortButton column={column} label="Criado em" />,
    cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(new Date(row.original.createdAt))}
        </span>
    ),
}