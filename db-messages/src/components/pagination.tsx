// src/components/pagination.tsx
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Pagination as PaginationPrimitive,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

type PaginationProps = {
    paginationData: {
        take: string | null
        totalPages: number
        page: number
        count: number
    }
    // Novo: permite customizar o label
    countLabel?: string
    // Novo: opções de items por página
    itemsPerPageOptions?: string[]
    // Novo: permite adicionar query params extras
    extraParams?: Record<string, string>
}

export const Pagination = ({
    paginationData: {
        take,
        page,
        totalPages,
        count
    },
    countLabel = "Total de itens",
    itemsPerPageOptions = ["10", "25", "50", "100"],
    extraParams = {}
}: PaginationProps) => {
    
    const { push } = useRouter()
    const pathname = usePathname() // Pega a rota atual dinamicamente

    // Função helper para construir URL com query params
    const buildUrl = (skip: number, take: string) => {
        
        const params = new URLSearchParams({
            skip: String(skip),
            take: take,
            ...extraParams // Adiciona params extras se houver
        })

        return `${pathname}?${params.toString()}` as any
    }

    const prevPage = page > 1 ? page - 1 : 1
    const prevSkip = (prevPage - 1) * Number(take)

    const nextPage = page < totalPages ? page + 1 : totalPages
    const nextSkip = (nextPage - 1) * Number(take)

    return (
        <div className="flex items-center justify-between gap-4">
            <Field orientation="horizontal" className="w-fit">
                <FieldLabel className="text-muted-foreground">
                    {`(${countLabel}: ${count})`}
                </FieldLabel>
                <FieldLabel htmlFor="select-rows-per-page">
                    Itens por página
                </FieldLabel>
                <Select
                    defaultValue={take ?? undefined}
                    onValueChange={(value) => push(buildUrl(0, value))}
                >
                    <SelectTrigger className="w-20" id="select-rows-per-page">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                        <SelectGroup>
                            {itemsPerPageOptions.map(value => (
                                <SelectItem
                                    key={value}
                                    value={value}
                                >
                                    {value}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>

            <PaginationPrimitive className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={buildUrl(prevSkip, take ?? "10")}
                            aria-disabled={page === 1}
                            className={cn(page === 1 && "opacity-60 pointer-events-none")}
                        />
                    </PaginationItem>

                    {/* Info da página atual */}
                    <PaginationItem className="px-4 text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationNext
                            href={buildUrl(nextSkip, take ?? "10")}
                            aria-disabled={page === totalPages}
                            className={cn(page === totalPages && "opacity-60 pointer-events-none")}
                        />
                    </PaginationItem>
                </PaginationContent>
            </PaginationPrimitive>
        </div>
    )
}