import { Contact, Search } from "lucide-react"

interface AsideEmptyStateProps {
    searchQuery?: string
}

export function AsideEmptyState({ searchQuery }: AsideEmptyStateProps) {
    if (searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-300">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="size-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                    Nenhum contato encontrado
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Não encontramos resultados para <span className="font-medium">"{searchQuery}"</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Tente buscar por nome ou número de telefone
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-300">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Contact className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
                Nenhum contato disponível
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
                Quando você tiver contatos, eles aparecerão aqui
            </p>
        </div>
    )
}