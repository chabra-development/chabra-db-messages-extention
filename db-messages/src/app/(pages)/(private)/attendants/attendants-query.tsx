"use client"

import { findManyAttendants } from "@/actions/attendants/find-many-attendants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Search, X } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { AttendantsDataTable } from "./data-table"

export function AttendantsTableContainer() {

    const [take, setTake] = useQueryState("take", parseAsInteger.withDefault(10))
    const [skip, setSkip] = useQueryState("skip", parseAsInteger.withDefault(0))

    const [search, setSearch] = useState("")
    const [teamFilter, setTeamFilter] = useQueryState("team", parseAsString.withDefault("all"))
    const [debouncedSearch, setDebouncedSearch] = useQueryState("search", parseAsString.withDefault(""))

    // Debounce de 1 segundo para o campo de pesquisa
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search || null)
        }, 1000)

        return () => clearTimeout(timer)
    }, [search])

    // Sincroniza o input com o search param no carregamento inicial
    useEffect(() => {
        if (debouncedSearch) setSearch(debouncedSearch)
    }, [])

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["find-many-attendants", take, skip, debouncedSearch, teamFilter],
        queryFn: () => findManyAttendants({
            take: String(take),
            skip: String(skip),
            search: debouncedSearch || null,
            team: teamFilter !== "all" ? teamFilter : undefined,
            orderBy: { name: "asc" },
        }),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    })

    const attendants = data?.data ?? []
    const total = data?.count ?? 0
    const totalPages = data?.totalPages ?? 1
    const currentPage = data?.page ?? 1

    // Extrai os times únicos dos dados retornados
    const allTeams = Array.from(
        new Set(attendants.flatMap((u) => u.teams))
    ).sort()

    function handlePageSize(value: string) {
        setTake(Number(value))
        setSkip(0)
    }

    function handlePreviousPage() {
        setSkip(Math.max(0, skip - take))
    }

    function handleNextPage() {
        setSkip(skip + take)
    }

    function handleClearFilters() {
        setSearch("")
        setDebouncedSearch(null)
        setTeamFilter(null)
    }

    const hasFilters = search !== "" || teamFilter !== "all"

    return (
        <div className="space-y-4">
            {/* Filtros */}
            <div className="flex items-center gap-2">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquisar por nome..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Select
                    value={teamFilter}
                    onValueChange={setTeamFilter}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por time" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Todos os times
                        </SelectItem>
                        {allTeams.map((team) => (
                            <SelectItem key={team} value={team}>
                                {team}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-muted-foreground"
                    >
                        <X className="mr-1 size-4" />
                        Limpar
                    </Button>
                )}
            </div>

            {/* Tabela */}
            <AttendantsDataTable
                data={attendants}
                total={total}
                totalPages={totalPages}
                currentPage={currentPage}
                isLoading={isLoading}
                isFetching={isFetching}
                take={take}
                skip={skip}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onPageSize={handlePageSize}
            />
        </div>
    )
}