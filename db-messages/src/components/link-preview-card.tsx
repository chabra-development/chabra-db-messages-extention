"use client"

import { fetchOgData } from "@/actions/fecth-og"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, Globe } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function LinkPreviewCard({ url }: { url: string }) {

    const [imgError, setImgError] = useState(false)

    const { data: ogData, isLoading, isError } = useQuery({
        queryKey: ["og-preview", url],
        queryFn: () => fetchOgData(url),
    })

    if (isLoading) {
        return (
            <div className="mt-2 animate-pulse rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-full rounded bg-muted" />
                <div className="mt-1 h-3 w-2/3 rounded bg-muted" />
            </div>
        )
    }

    if (
        isError ||
        !ogData ||
        (!ogData.title && !ogData.description && !ogData.image)
    ) {
        return null
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-accent/50"
        >
            {ogData.image && !imgError && (
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <Image
                        src={ogData.image}
                        alt={ogData.title || "Link preview"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImgError(true)}
                        unoptimized
                    />
                </div>
            )}
            <div className="flex flex-col gap-1.5 p-3">
                <div className="flex items-center gap-2">
                    {ogData.favicon ? (
                        <Image
                            src={ogData.favicon}
                            alt=""
                            width={16}
                            height={16}
                            className="size-4 rounded-sm"
                            unoptimized
                        />
                    ) : (
                        <Globe className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                        {ogData.siteName || ogData.hostname}
                    </span>
                    <ExternalLink className="ml-auto size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                {ogData.title && (
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                        {ogData.title}
                    </p>
                )}
                {ogData.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {ogData.description}
                    </p>
                )}
            </div>
        </a>
    )
}