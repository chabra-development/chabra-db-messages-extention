import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { useDownloadFile } from "@/hooks/use-download-file"
import { cn } from "@/lib/utils"
import { MessageDirection } from "@prisma/client"
import { formatDate } from "date-fns"
import { ArrowDownToLine, Download } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export const ContactMediaImage = ({
    direction,
    date,
    uri,
    type,
    id
}: {
    direction: MessageDirection
    date: Date
    uri: string
    type: string
    id: string
}) => {

    const { download, isDownloading } = useDownloadFile()

    const [loaded, setLoaded] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 400, height: 400 })

    const isSent = direction === MessageDirection.SENT

    return (
        <Card
            id={id}
            className={cn(
                "relative w-full max-w-1/2 border-none shadow-none p-2",
                isSent
                    ? "bg-message"
                    : "dark:bg-muted bg-zinc-100"
            )}
        >
            <CardHeader className="p-1">
                <CardAction>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"}
                                disabled={isDownloading}
                            >
                                {
                                    isDownloading
                                        ? <Spinner />
                                        : <ArrowDownToLine />
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                disabled={isDownloading}
                                onClick={e => {
                                    e.preventDefault()
                                    download(uri)
                                }}
                            >
                                <Download />
                                Baixar arquivo
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardAction>
            </CardHeader>
            <div
                className="relative w-full rounded-md overflow-hidden"
                style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}
            >
                {!loaded && (
                    <div className="absolute inset-0 bg-linear-to-br from-muted via-muted-foreground/10 to-muted animate-pulse" />
                )}
                <Image
                    src={uri}
                    width={dimensions.width}
                    height={dimensions.height}
                    alt={`imagem ${type}`}
                    className={cn(
                        "w-full h-auto rounded-md transition-opacity duration-500",
                        loaded ? "opacity-100" : "opacity-0"
                    )}
                    sizes="(max-width: 768px) 100vw, 320px"
                    onLoad={(e) => {
                        const img = e.currentTarget
                        setDimensions({
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        })
                        setLoaded(true)
                    }}
                />
            </div>
            <CardFooter className="w-fit ml-auto rounded-sm p-1 absolute bottom-2.5 right-2.5 bg-black/30 backdrop-blur-sm">
                <CardDescription className="text-white font-medium">
                    {formatDate(date, "HH:mm")}
                </CardDescription>
            </CardFooter>
        </Card>
    )
}