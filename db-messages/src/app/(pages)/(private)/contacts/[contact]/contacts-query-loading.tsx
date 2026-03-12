import { Alert, AlertTitle } from "@/components/ui/alert"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export const ContactsQueryLoading = () => {
    return (
        <Card className="flex-1 size-full border-none rounded-none">
            <CardHeader>
                <CardTitle className="text-2xl mb-1.25">
                    <Skeleton className="h-8 w-1/2 rounded-full" />
                </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 min-h-200">
                <ScrollBar />
                <CardContent className="border-t space-y-2 pt-2">
                    {
                        Array.from({ length: 10 }).map((_, index) => {

                            const isLeft = [1, 4, 5, 10]

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "w-full flex",
                                        isLeft.includes(index)
                                            ? "justify-end"
                                            : "justify-start"
                                    )}
                                >
                                    <Alert className={cn(
                                        "w-[70%] h-20 px-4 py-2 pt-4 text-sm text-foreground shadow-2xl space-y-2",
                                        isLeft.includes(index)
                                            ? "bg-message rounded-tr-none"
                                            : "dark:bg-muted bg-zinc-100 rounded-tl-none"
                                    )}>
                                        <AlertTitle />
                                    </Alert>
                                </div>
                            )
                        })
                    }
                </CardContent>
            </ScrollArea>
        </Card>
    )
}