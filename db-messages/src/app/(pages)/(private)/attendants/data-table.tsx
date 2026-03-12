"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import { useState } from "react"
import { AttendantRow, columns } from "./columns"

interface AttendantsDataTableProps {
    data: AttendantRow[]
    total: number
    totalPages: number
    currentPage: number
    isLoading: boolean
    isFetching: boolean
    take: number
    skip: number
    onPreviousPage: () => void
    onNextPage: () => void
    onPageSize: (value: string) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// ============================================
// COMPONENT
// ============================================

export function AttendantsDataTable({
    data,
    total,
    totalPages,
    currentPage,
    isLoading,
    isFetching,
    take,
    skip,
    onPreviousPage,
    onNextPage,
    onPageSize,
}: AttendantsDataTableProps) {

    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
    })

    return (
        <div className="space-y-4">
            {/* Controles superiores */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {isLoading ? "Carregando..." : `${total} usuário(s) encontrado(s)`}
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Itens por página</span>
                    <Select
                        value={String(take)}
                        onValueChange={(value) => onPageSize(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Itens por página" />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <SelectItem
                                    key={size}
                                    value={String(size)}
                                >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tabela */}
            <ScrollArea className={cn(
                "rounded-md border h-190 overflow-hidden",
                isFetching
                    ? "opacity-60 pointer-events-none transition-opacity"
                    : "transition-opacity"
            )}>
                <ScrollBar />
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="border-b">
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="odd:bg-secondary/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            {/* Paginação */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPreviousPage}
                        disabled={skip === 0 || isFetching}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onNextPage}
                        disabled={currentPage >= totalPages || isFetching}
                    >
                        Próxima
                    </Button>
                </div>
            </div>
        </div>
    )
}