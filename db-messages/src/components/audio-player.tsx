"use client"

import {
    AudioPlayerButton,
    AudioPlayerDuration,
    AudioPlayerProgress,
    AudioPlayerProvider,
    AudioPlayerSpeed,
    AudioPlayerTime,
    useAudioPlayer,
    useAudioPlayerTime,
} from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { useDownloadFile } from "@/hooks/use-download-file"
import { cn } from "@/lib/utils"
import { MessageDirection } from "@prisma/client"
import { formatDate } from "date-fns"
import { Download, Loader2 } from "lucide-react"

type Track = {
    id: string
    name?: string
    url: string
}

type AudioPlayerProps = & {
    url: string
    name?: string
    id?: string
    direction: MessageDirection
    date: Date
}

export function AudioPlayer({
    url, name, id, direction, date
}: AudioPlayerProps) {
    return (
        <AudioPlayerProvider<Track>
            url={url}
            id={id ?? "audio"}
            data={{ id: id ?? "audio", name, url }}
        >
            <Player
                url={url}
                direction={direction}
                date={date}
            />
        </AudioPlayerProvider>
    )
}

type PlayerProps = {
    direction: MessageDirection
    date: Date
    url: string
}

const Player = ({ direction, date, url }: PlayerProps) => {

    const isSent = direction === MessageDirection.SENT

    const player = useAudioPlayer<Track>()

    const time = useAudioPlayerTime()

    const { download, isDownloading } = useDownloadFile()

    return (
        <Card className={cn(
            "w-1/2 text-sm",
            "@max-5xl/chat:w-9/10",
            isSent
                ? "dark:bg-[#144d37] bg-[#d9fdd3] rounded-tr-none"
                : "dark:bg-muted bg-zinc-100 rounded-tl-none",
        )}>
            <CardContent className="w-full flex items-center justify-between gap-4 px-4">
                <AudioPlayerButton
                    variant="ghost"
                    size="icon"
                    className="shrink-0 sm:h-10 sm:w-10"
                    disabled={!player.activeItem}
                />
                <AudioPlayerProgress className="flex-1" />
                <AudioPlayerSpeed variant={"ghost"} size="icon" />
            </CardContent>
            <CardFooter className="w-full justify-between">
                {
                    time === 0
                        ? <AudioPlayerDuration className="text-xs tabular-nums" />
                        : <AudioPlayerTime className="text-xs tabular-nums" />
                }
            </CardFooter>
            <CardFooter>
                <CardDescription className="ml-auto">
                    {formatDate(date, "HH:mm")}
                </CardDescription>
            </CardFooter>
            <CardFooter>
                <Button
                    disabled={isDownloading}
                    onClick={() => download(url)}
                >
                    {
                        isDownloading
                            ? <Loader2 className="animate-spin" />
                            : <Download />
                    }
                    Baixar
                </Button>
            </CardFooter>
        </Card>
    )
}