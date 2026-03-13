"use client"

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { generateVideoThumbnail } from "@/functions/generate-video-thumbnail"
import { stringToHTML } from "@/functions/string-to-HTML"
import { cn } from "@/lib/utils"
import { MessageDirection } from "@/constants/prisma-enums"
import { formatDate } from "date-fns"
import { FileImage, FileVideo } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export const ContactImageResponse = ({
    direction,
    date,
    uri,
    type,
    response,
    id
}: {
    direction: MessageDirection
    date: Date
    uri: string
    type: string
    response: string
    id: string
}) => {

    const [thumb, setThumb] = useState<string | null>(null)
    const [imageLoaded, setImageLoaded] = useState(false)

    const isSent = direction === MessageDirection.SENT

    useEffect(() => {

        let isMounted = true

        if (!type.includes("video")) {
            // Para imagens normais, usar a URI diretamente
            if (isMounted) {
                setThumb(uri)
            }
            return
        }

        generateVideoThumbnail(uri).then(image => {

            if (!isMounted) return

            setThumb(image)
        })

        return () => {
            isMounted = false
        }
    }, [uri, type])

    const [typeSplited] = type.split("/")
    const Icon = typeSplited === "video" ? FileVideo : FileImage

    return (
        <a
            href={`#${id}`}
            className={cn(
                "w-1/4", "@max-5xl/chat:w-9/10"
            )}
        >
            <Card className={cn(
                "w-full text-sm",
                "py-1 gap-1.5",
                isSent
                    ? "bg-message rounded-tr-none"
                    : "bg-muted rounded-tl-none"
            )}>
                <CardHeader className="w-[97%] self-center bg-card/30 px-1.5 rounded-sm">
                    <div className="w-full flex justify-between">
                        <div className="w-fit px-1.5 flex items-center justify-center gap-2 text-muted-foreground">
                            <Icon className="size-4" />
                            {typeSplited}
                        </div>
                        <div className="relative size-24 overflow-hidden rounded-tr-md">
                            {/* Placeholder blur */}
                            {!imageLoaded && thumb && (
                                <div className="absolute inset-0 bg-linear-to-br from-muted to-muted-foreground/20 animate-pulse" />
                            )}

                            <Image
                                src={thumb ?? uri}
                                width={100}
                                height={100}
                                unoptimized
                                quality={40}
                                alt={`imagem ${type}`}
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                                className={cn(
                                    "object-cover size-full transition-opacity duration-300",
                                    imageLoaded ? "opacity-100" : "opacity-0"
                                )}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardHeader className="px-1 pt-2">
                    <CardTitle className="px-2 rounded-md">
                        {stringToHTML(response)}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="ml-auto pb-2 px-2">
                    <CardDescription>
                        {formatDate(date, "HH:mm")}
                    </CardDescription>
                </CardFooter>
            </Card>
        </a >
    )
}


