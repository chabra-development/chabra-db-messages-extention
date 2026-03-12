"use client"

import { findManyTags } from "@/actions/tags/find-many-tags"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Ellipsis } from "lucide-react"
import { ChangeColorDialog } from "./change-color-dialog"
import { TagClienFooter } from "./tags-query-footer"

export const TagClient = () => {

    const { data: tags, isLoading: tagsLoading } = useQuery({
        queryKey: ["find-many-tags"],
        queryFn: () => findManyTags({
            orderBy: {
                name: "asc"
            },
        })
    })

    if (!tags || tagsLoading) {
        return (
            <div>Carregando...</div>
        )
    }

    return (
        <Card className="w-full border-none shadow-none rounded-none">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Tags
                </CardTitle>
                <CardDescription className="text-base">
                    Adicione, atualize e exclua tags para os contatos
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 grid grid-cols-2 gap-2">
                {
                    tags.length === 0
                        ? (
                            <CardDescription>
                                Sem tags adicionadas
                            </CardDescription>
                        )
                        : tags.map(({ id, name, color, createdById }) => (
                            <Card
                                key={id}
                                className="text-sm gap-2 bg-background"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {name}
                                    </CardTitle>
                                    <CardAction>
                                        <Button variant={"ghost"}>
                                            <Ellipsis />
                                        </Button>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <ChangeColorDialog
                                        id={id}
                                        color={color}
                                    />
                                </CardContent>
                                <TagClienFooter createdById={createdById} />
                            </Card>
                        ))
                }
            </CardContent>
        </Card>
    )
}