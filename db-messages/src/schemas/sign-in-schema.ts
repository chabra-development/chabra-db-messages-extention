import { z } from "zod"

export const signInSchema = z.object({
	email: z.email("E-mail inválido").toLowerCase(),
	password: z.string().min(6, "A senha deve ter no minimo 6 caracteres"),
})

export type FormSignProps = z.infer<typeof signInSchema>