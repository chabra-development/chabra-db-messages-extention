"use client"

import { findManyContacts } from "@/actions/contacts/find-many-contacts"
import { useDebounce } from "@/hooks/use-debounce"
import type { Contact } from "@prisma/client"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"

const TAKE = 20

export function UseAside() {

    const [searchQuery, setSearchQuery] = useQueryState("contact-name", parseAsString.withDefault(""))
    const [activeContactId, setActiveContactId] = useState<string | null>(null)

    const debouncedSearch = useDebounce(searchQuery, 500)
    const isSearching = searchQuery !== debouncedSearch
    const hasSearch = debouncedSearch.trim().length > 0

    // ── Scroll infinito (sem busca) ──────────────────────────────
    const infiniteQuery = useInfiniteQuery({
        queryKey: ["find-infinity-contacts"],
        queryFn: ({ pageParam }) =>
            findManyContacts({ cursor: pageParam, take: TAKE }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        enabled: !hasSearch,
    })

    // ── Busca server-side ────────────────────────────────────────
    const searchQuery_ = useQuery({
        queryKey: ["contacts-search", debouncedSearch],
        queryFn: () =>
            findManyContacts({
                where: {
                    OR: [
                        { name: { contains: debouncedSearch, mode: "insensitive" } },
                        { identity: { contains: debouncedSearch, mode: "insensitive" } },
                    ],
                },
            }),
        enabled: hasSearch,
    })

    const isLoading = hasSearch
        ? searchQuery_.isLoading
        : infiniteQuery.isLoading

    const isFetching = hasSearch
        ? searchQuery_.isFetching
        : infiniteQuery.isFetching

    const error = hasSearch
        ? searchQuery_.error
        : infiniteQuery.error

    const refetch = hasSearch
        ? searchQuery_.refetch
        : infiniteQuery.refetch

    const contacts = hasSearch
        ? (searchQuery_.data?.data ?? [])
        : (infiniteQuery.data?.pages.flatMap((p) => p.data) ?? [])

    const totalContacts = hasSearch
        ? (searchQuery_.data?.data.length ?? 0)
        : (infiniteQuery.data?.pages[0]?.data.length ?? 0) // placeholder até ter count

    if (isLoading) return undefined

    return {
        error,
        refetch,
        searchQuery,
        setSearchQuery,
        handleClearSearch: () => setSearchQuery(""),
        handleSelectContact: (contact: Contact) => setActiveContactId(contact.identity),
        isSearching,
        hasSearch,
        isFetching,
        debouncedSearch,
        activeContactId,
        contacts,
        totalContacts,
        filteredCount: contacts.length,
        // scroll infinito
        fetchNextPage: infiniteQuery.fetchNextPage,
        hasNextPage: infiniteQuery.hasNextPage,
        isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    }
}