"use client"

import { findContactById } from "@/actions/contacts/find-contact-by-id"
import { toast } from "@/components/toast"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getTextColorFromBackground } from "@/functions/get-text-color-from-background"
import { useMessages } from "@/hooks/use-messages"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Pin } from "lucide-react"
import { useEffect, useLayoutEffect, useRef } from "react"
import { ContactHeaderDropMenu } from "./contact-header-drop-menu"
import { ContactHeaderSearch } from "./contact-header-search"
import { ContactsQueryLoading } from "./contacts-query-loading"
import { MessagesBoard } from "./messages-board"

export type ContactWithRelations = Prisma.ContactGetPayload<{
    include: {
        tags: {
            include: {
                tag: true,
            }
        },
        preferences: true
    }
}>

export const ContactsQuery = ({ id }: { id: string }) => {

    const { data: session } = authClient.useSession()

    const {
        error,
        data: contact,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ["find-contact-by-id", id],
        queryFn: () => findContactById<ContactWithRelations>(id, {
            include: {
                tags: {
                    include: {
                        tag: true,
                    }
                },
                preferences: {
                    where: {
                        userId: session?.user.id
                    },
                    select: {
                        id: true,
                        favorite: true,
                        pinned: true,
                    }
                }
            }
        }),
    })

    const containerRef = useRef<HTMLDivElement>(null)
    const topRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const prevScrollHeight = useRef(0)
    const isFirstLoad = useRef(true)

    const {
        isLoading: isMessagesLoading,
        loadedCount,
        total,
        messages,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useMessages(id)

    // 1. Scroll inicial para o fim
    useEffect(() => {
        if (messages.length === 0) return
        if (!isFirstLoad.current) return
        bottomRef.current?.scrollIntoView({ behavior: "instant" })
        isFirstLoad.current = false
    }, [messages.length])

    // 2. Reseta ao trocar de contato
    useEffect(() => {
        isFirstLoad.current = true
    }, [id])

    // 3. Observer — registrado após o scroll inicial
    useEffect(() => {
        if (isFirstLoad.current) return // ainda não chegou no fim

        const sentinel = topRef.current
        const container = containerRef.current
        if (!sentinel || !container) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    prevScrollHeight.current = container.scrollHeight
                    fetchNextPage()
                }
            },
            { root: container, threshold: 0.1 }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [isFirstLoad.current, hasNextPage, isFetchingNextPage, fetchNextPage])

    // 4. Restaura posição do scroll sem movimentação visível
    useLayoutEffect(() => {
        const container = containerRef.current
        if (!container || prevScrollHeight.current === 0) return

        const diff = container.scrollHeight - prevScrollHeight.current
        container.scrollTop = container.scrollTop + diff
        prevScrollHeight.current = 0
    }, [messages.length])

    if (error) {
        toast({
            title: error.name,
            duration: Infinity,
            description: error.message,
            variant: "destructive",
            action: {
                label: "Tentar novamente",
                onClick: () => refetch()
            }
        })

        return
    }

    if (isLoading || !contact) {
        return <ContactsQueryLoading />
    }

    console.log(contact)

    const { name, phoneNumber, tags, preferences } = contact

    const preference = preferences.length !== 0 ? preferences[0] : null

    return (
        <Card className="size-full border-none rounded-none gap-0">
            {contact && (
                <CardHeader className="border-b pb-3 gap-0">
                    <CardTitle className="text-2xl mb-1.25 truncate">
                        <div className="flex items-center gap-2">
                            {
                                preference?.pinned && (
                                    <Pin className="fill-primary -rotate-45" />
                                )
                            }
                            {name}
                        </div>
                    </CardTitle>
                    <CardDescription className="truncate">
                        {phoneNumber && phoneNumber}
                    </CardDescription>
                    <CardDescription className="truncate flex items-center gap-2 mt-2">
                        {
                            tags.map(({ tag: { id, name, color } }) => (
                                <Badge
                                    key={id}
                                    style={{
                                        background: color ?? undefined
                                    }}
                                    className={cn(
                                        "capitalize",
                                        getTextColorFromBackground(color)
                                    )}
                                >
                                    {name}
                                </Badge>
                            ))
                        }
                    </CardDescription>
                    <CardAction className="flex items-center gap-2">
                        <ContactHeaderSearch />
                        <ContactHeaderDropMenu
                            contactId={id}
                            preference={preference}
                            isFirstLoad={isFirstLoad}
                        />
                    </CardAction>
                </CardHeader>
            )}
            <ScrollArea viewportRef={containerRef} className="flex-1 min-h-0 py-8">
                {/* Sentinel para IntersectionObserver — dispara o fetch ao chegar no topo */}
                <div ref={topRef} className="h-1" />

                <div className="py-2 flex justify-center">
                    {isFetchingNextPage && (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    )}
                    {!hasNextPage && messages.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            Início da conversa · {loadedCount} de {total} mensagens
                        </span>
                    )}
                </div>

                {isMessagesLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <MessagesBoard messages={messages} />
                )}

                <div ref={bottomRef} className="h-1" />
            </ScrollArea>
        </Card>
    )
}
