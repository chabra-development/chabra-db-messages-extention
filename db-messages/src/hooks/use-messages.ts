import { findMessagesByContact } from "@/actions/messages/find-messages-by-contact"
import { useInfiniteQuery } from "@tanstack/react-query"

export function useMessages(contactId: string) {

    const query = useInfiniteQuery({
        queryKey: ["find-messages-infinte-scroll", contactId],
        queryFn: ({ pageParam }) => {
            return findMessagesByContact({
                contactId,
                take: 20,
                cursor: pageParam ?? undefined,
            })
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.flatMap((p) => p.messages).length
            const total = allPages[0]?.total ?? 0
            if (loadedCount < total) return lastPage.nextCursor ?? undefined
            return undefined
        },
        enabled: !!contactId,
    })

    const messages = query.data?.pages
        .flatMap((p) => p.messages)
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
        ?? []

    const total = query.data?.pages[0]?.total ?? 0
    const loadedCount = messages.length
    const hasNextPage = loadedCount < total

    return { ...query, messages, hasNextPage, total, loadedCount }
}