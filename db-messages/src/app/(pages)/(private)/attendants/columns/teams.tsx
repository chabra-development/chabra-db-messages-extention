import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { ColumnDef } from "@tanstack/react-table"
import { AttendantRow, SortButton } from "./index"

export const TeamsColumn: ColumnDef<AttendantRow> = {
    accessorKey: "teams",
    header: ({ column }) => <SortButton column={column} label="Times" />,
    cell: ({ row }) => {

        const teams = row.original.teams

        if (teams.length === 0) {
            return <span className="text-xs text-muted-foreground">—</span>
        }

        return (
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex flex-wrap gap-1">
                        {
                            teams.slice(0, 2).map((team) => (
                                <Badge key={team} variant="outline" className="text-xs">
                                    {team}
                                </Badge>
                            ))
                        }
                        {teams.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{teams.length - 2}
                            </Badge>
                        )}
                    </div>
                </TooltipTrigger>
                {
                    teams.length > 2 && (
                        <TooltipContent className="border bg-card py-4 size-full flex flex-wrap gap-2 max-w-sm">
                            {
                                teams.map((team) => (
                                    <Badge key={team} className="rounded-sm">
                                        {team}
                                    </Badge>
                                ))
                            }
                        </TooltipContent>
                    )
                }
            </Tooltip>
        )
    },
    sortingFn: (a, b) => a.original.teams.length - b.original.teams.length,
}