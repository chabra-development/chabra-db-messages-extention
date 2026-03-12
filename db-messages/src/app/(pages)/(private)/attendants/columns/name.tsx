import { CardDescription, CardTitle } from "@/components/ui/card"
import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow, SortButton } from "./index"

export const NameColumn: ColumnDef<AttendantRow> = {
    accessorKey: "name",
    header: ({ column }) => <SortButton column={column} label="Nome" />,
    cell: ({ row }) => (
        <div>
            <CardTitle className="text-base capitalize">
                {row.original.name}
            </CardTitle>
            <CardDescription>
                {row.original.identity}
            </CardDescription>
        </div>
    ),
}