"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const TicketsQueryLoading = () => {
    return (
        <Card className="flex-1 border-none rounded-none">
            <CardContent className="grid grid-cols-2 gap-2 space-y-2 px-2">
                {
                    Array.from({ length: 7 }).map((_, index) => (
                        <Card
                            key={index}
                            className="h-42 bg-background"
                        >
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-6 rounded-full" />
                                </CardTitle>
                                <CardDescription>
                                    <Skeleton className="w-1/2 h-4 rounded-full" />
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))
                }
            </CardContent>
        </Card>
    )
}  