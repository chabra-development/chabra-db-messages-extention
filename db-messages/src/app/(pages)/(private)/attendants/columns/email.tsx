import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow, SortButton } from "./index"

export const EmailColumn: ColumnDef<AttendantRow> = {
    accessorKey: "email",
    header: ({ column }) => <SortButton column={column} label="Email" />,
    cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.email}</span>
    ),
}