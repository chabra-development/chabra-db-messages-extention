"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow } from "."
import { ChangeRoleUserDialog } from "../change-role-attendants"

export const ActionsColumn: ColumnDef<AttendantRow> = {
    id: "actions",
    header: "",
    cell: ({ row }) => <ChangeRoleUserDialog user={row.original as User} />,
    enableSorting: false,
    size: 48,
}