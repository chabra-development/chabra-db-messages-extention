import { findManyTags } from "@/actions/tags/find-many-tags"
import { toast } from "@/components/toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getTextColorFromBackground } from "@/functions/get-text-color-from-background"
import { cn } from "@/lib/utils"
import { createTagsObjetc, CreateTagsProps, createTagsSchema } from "@/schemas/create-tags-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tag } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { X } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { Dispatch, SetStateAction } from "react"
import { useFieldArray, useForm } from "react-hook-form"

type FormCreateContactTagsProps = {
    contactId: string
    tags: Pick<Tag, "id" | "name">[]
    setDialogOpen: Dispatch<SetStateAction<boolean>>
    setDropdownOpen: Dispatch<SetStateAction<boolean>>
}

export const FormCreateContactTags = ({
    contactId, tags, setDialogOpen, setDropdownOpen
}: FormCreateContactTagsProps) => {

    const queryClient = useQueryClient()

    const { data: allTags, isLoading } = useQuery({
        queryKey: ["find-many-tags"],
        queryFn: () => findManyTags({
            select: {
                id: true,
                name: true,
                color: true
            }
        })
    })

    const { mutate } = useMutation({
        mutationKey: ["create-contact-tag"],
        mutationFn: (tags: { name: string }[]) => {

            const url = `/api/tags/${contactId}`

            return axios.put(url, { tags }, { withCredentials: true })
        },
        onSuccess: () => {
            toast({
                title: "Tag adicionada com sucesso"
            })
            setDialogOpen(false)
            setDropdownOpen(false)

            queryClient.invalidateQueries({
                queryKey: ["find-contact-by-id", contactId]
            })
        },
        onError: (error) => {
            toast({
                title: "Erro ao adicionar tag",
                description: error.message,
                variant: "destructive"
            })
        }
    })

    const [
        currentContactTag,
        setCurrentContactTag
    ] = useQueryState("name", parseAsString.withDefault(''))

    const {
        watch,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateTagsProps>({
        resolver: zodResolver(createTagsSchema),
        defaultValues: {
            tags
        }
    })

    const {
        fields,
        append,
        remove
    } = useFieldArray<CreateTagsProps>({
        name: "tags",
        control
    })

    if (!allTags || isLoading) {
        return <div />
    }

    const watchTags = watch("tags")

    function addContactTag(contactTag: string) {

        const result = createTagsObjetc.safeParse({ name: contactTag })

        if (!result.success) return

        if (contactTag.includes(",")) {
            contactTag.split(",")
                .map(tag => tag.trim())
                .filter(Boolean)
                .forEach(tag => {

                    const tagResult = createTagsObjetc.safeParse({ name: tag })

                    if (tagResult.success) append({ name: tag })
                })

            setCurrentContactTag("")
            return
        }

        append(result.data)
        setCurrentContactTag("")
    }

    function addContactTagByClick(contactTag: string) {
        append({ name: contactTag })
    }

    function onSubmit({ tags }: CreateTagsProps) {
        mutate(tags)
    }

    return (
        <form
            id="form-create-contact-tags"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <Card className="py-4 rounded-sm">
                <ScrollArea
                    type="always"
                    className="h-32"
                >
                    <Card className="py-2 mx-2 gap-2 border-none shadow-none">
                        <CardHeader>
                            <CardTitle>
                                Tags disponíveis:
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 py-0 flex items-center flex-wrap gap-2">
                            {
                                allTags.length === 0
                                    ? (
                                        <CardDescription className="text-sm">
                                            Nenhuma tag disponível. Crie tags para organizar melhor seus contatos.
                                        </CardDescription>
                                    )
                                    : allTags.map(({ id, name, color }) => {

                                        const isSelected = watchTags.some(tag => tag.name === name)

                                        return (
                                            <Badge
                                                key={id}
                                                style={{
                                                    background: color ?? undefined
                                                }}
                                                className={cn(
                                                    "text-sm",
                                                    isSelected && "cursor-not-allowed opacity-50",
                                                    getTextColorFromBackground(color)
                                                )}
                                                variant={isSelected ? "secondary" : "default"}
                                                onClick={() => addContactTagByClick(name)}
                                            >
                                                {name}
                                            </Badge>
                                        )
                                    })
                            }
                        </CardContent>
                    </Card>
                    <Separator className="my-4" />
                    <CardContent className="p-4 flex items-center flex-wrap gap-2">
                        {
                            fields.length === 0
                                ? (
                                    <CardDescription className="text-base">
                                        Nenhuma tag adicionada
                                    </CardDescription>
                                )
                                : fields.map(({ id, name }, i) => (
                                    <Card
                                        key={id}
                                        className="w-fit bg-primary text-primary-foreground py-1.5 flex flex-row rounded-full gap-0 items-center"
                                    >
                                        <CardContent className="px-2.5">
                                            <CardTitle className="capitalize">
                                                {name}
                                            </CardTitle>
                                        </CardContent>
                                        <CardFooter className="px-1.5">
                                            <Button
                                                size={"icon-xs"}
                                                onClick={() => remove(i)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                        }
                    </CardContent>
                </ScrollArea>
            </Card>
            <Input
                placeholder="Adicione uma tag..."
                className="rounded-sm"
                onChange={e => setCurrentContactTag(e.target.value)}
                value={currentContactTag}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        addContactTag(currentContactTag)
                    }
                }}
            />
        </form>
    )
}