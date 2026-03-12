// aside.tsx
"use client"

import { SearchInput } from "@/components/seach-input"
import { toast } from "@/components/toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Contact, RefreshCw } from "lucide-react"
import { useEffect, useRef } from "react"
import { AsideEmptyState } from "./aside-empty-state"
import { AsideLoading } from "./aside-loading"
import { ContactCardItem } from "./contact-card-item"
import { ImportAllContactsButton } from "./import-all-contacts-button"
import { ImportContactMessagesButton } from "./Import-contact-messages-button"
import { UseAside } from "./use-aside"
import { authClient } from "@/lib/auth-client"

export const Aside = () => {

    const useAside = UseAside()
    const sentinelRef = useRef<HTMLDivElement>(null)

    const { data: session } = authClient.useSession()

    // Sentinela: dispara fetchNextPage quando entra na viewport
    useEffect(() => {

        if (!useAside) return

        const { fetchNextPage, hasNextPage, isFetchingNextPage, hasSearch } = useAside

        if (hasSearch) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 0.1 }
        )

        if (sentinelRef.current) observer.observe(sentinelRef.current)

        return () => observer.disconnect()
    }, [useAside])

    if (!useAside || !session) return <AsideLoading />

    const {
        error,
        refetch,
        searchQuery,
        setSearchQuery,
        handleClearSearch,
        handleSelectContact,
        isSearching,
        hasSearch,
        filteredCount,
        totalContacts,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        contacts,
        debouncedSearch,
        activeContactId,
    } = useAside

    if (error) {

        toast({
            title: error.name,
            duration: Infinity,
            description: error.message,
            variant: "destructive",
            action: { label: "Tentar novamente", onClick: () => refetch() },
        })

        return null
    }

    const isAdmin = session.user.role === "ADMIN"

    return (
        <Card className="size-full rounded-none border-0 shadow-none">
            <CardHeader className="space-y-4 pb-4">
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={handleClearSearch}
                    placeholder="Buscar contatos..."
                    isLoading={isSearching}
                    autoFocus
                />
            </CardHeader>

            <ScrollArea className="flex-1 min-h-50">
                <ScrollBar className="w-2" />

                <CardHeader className="pt-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Contact className="size-6" />
                            Contatos
                            <Badge variant="secondary" className="h-fit">
                                {hasSearch ? `${filteredCount}/${totalContacts}` : totalContacts}
                            </Badge>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="size-8"
                            title="Atualizar contatos"
                        >
                            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </CardHeader>

                <Separator />

                <CardContent className="px-2 pt-4 pb-6">
                    {contacts.length === 0 ? (
                        <AsideEmptyState searchQuery={debouncedSearch} />
                    ) : (
                        <div className="space-y-2">
                            {contacts.map((contact, index) => (
                                <div
                                    key={`${contact.identity}-${index}`}
                                    className="animate-in fade-in slide-in-from-bottom-2"
                                    style={{
                                        animationDelay: `${Math.min(index * 30, 300)}ms`,
                                        animationDuration: "300ms",
                                        animationFillMode: "both",
                                    }}
                                >
                                    <ContactCardItem
                                        contact={contact}
                                        searchQuery={debouncedSearch}
                                        onClick={() => handleSelectContact(contact)}
                                        isActive={activeContactId === contact.identity}
                                    />
                                </div>
                            ))}

                            {/* Sentinela — fica invisível no fim da lista */}
                            {!hasSearch && (
                                <div ref={sentinelRef} className="py-2 flex justify-center">
                                    {isFetchingNextPage && (
                                        <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                                    )}
                                    {!hasNextPage && contacts.length > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            Todos os contatos carregados
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
            {
                isAdmin && (
                    <CardFooter className="px-2 flex-col gap-2">
                        <ImportAllContactsButton />
                        <ImportContactMessagesButton />
                    </CardFooter>
                )
            }
        </Card>
    )
}