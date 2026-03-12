import z from "zod"
import { zString } from "./z-string"

export const createTagsObjetc = z
    .object({
        name: zString()
            .nonempty("O nome da tag é obrigatório")
            .trim()
            .lowercase(),
    })

export const createTagsSchema = z.object({
    tags: z
        .array(createTagsObjetc)
        .min(1, "Adicione pelo menos uma tag")
})

export type CreateTagsProps = z.infer<typeof createTagsSchema>