import z from "zod"

export const changeColorTagSchema = z.object({
	color: z.string(),
})

export type ChangeColorListProps = z.infer<typeof changeColorTagSchema>
