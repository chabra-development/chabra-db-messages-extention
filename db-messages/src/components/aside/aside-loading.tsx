"use client"

import { SearchInput } from "@/components/seach-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { Contact, Ellipsis } from "lucide-react"

export const AsideLoading = () => {
    return (
        <Card className="size-full rounded-none">
            <CardHeader>
                <SearchInput />
            </CardHeader>
            <ScrollArea className="min-h-200 size-full border-t pt-4">
                <ScrollBar />
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Contact className="size-6" />
                        Contatos
                        <Badge
                            variant={"secondary"}
                            className="h-full"
                        >
                            <Spinner />
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="px-2 size-full pt-4">
                    {
                        Array.from({ length: 4 }).map((_, index) => {

                            const opacities = ["", "opacity-80", "opacity-50", "opacity-30"]

                            return (
                                <Card
                                    key={index}
                                    className={cn(
                                        "size-full my-2",
                                        opacities[index]
                                    )}
                                >
                                    <CardHeader>
                                        <CardTitle className="truncate font-semibold capitalize">
                                            <Skeleton className="rounded-full" />
                                        </CardTitle>
                                        <CardDescription>
                                            <Skeleton className="w-1/2 h-4 rounded-full" />
                                        </CardDescription>
                                        <CardAction>
                                            <Button disabled variant={"ghost"}>
                                                <Ellipsis />
                                            </Button>
                                        </CardAction>
                                    </CardHeader>
                                </Card>
                            )
                        })
                    }
                </CardContent>
            </ScrollArea>
        </Card>
    )
}
