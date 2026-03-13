import { Button } from "@/components/ui/button"
import type { Role, User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { AvatarColumn } from "./avatar"
import { CreatedAtColumn } from "./created-at"
import { EmailColumn } from "./email"
import { IsActiveColumn } from "./is-active"
import { NameColumn } from "./name"
import { RoleColumn } from "./role"
import { TeamsColumn } from "./teams"
import { ActionsColumn } from "./actions"

export interface AttendantRow {
    id: string
    identity: string
    name: string
    email: string
    image?: string | null
    role: string | null
    isActive: boolean
    teams: string[]
    createdAt: Date
}

export function SortButton({ column, label }: { column: any; label: string }) {

    const sorted = column.getIsSorted()

    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            {label}
            {sorted === "asc" ? (
                <ArrowUp className="ml-2 size-4" />
            ) : sorted === "desc" ? (
                <ArrowDown className="ml-2 size-4" />
            ) : (
                <ArrowUpDown className="ml-2 size-4 text-muted-foreground" />
            )}
        </Button>
    )
}

export const columns: ColumnDef<AttendantRow>[] = [
    ActionsColumn,
    AvatarColumn,
    NameColumn,
    EmailColumn,
    RoleColumn,
    IsActiveColumn,
    TeamsColumn,
    CreatedAtColumn
]