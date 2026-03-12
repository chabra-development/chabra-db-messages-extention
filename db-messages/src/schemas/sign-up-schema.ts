import { z } from "zod"

export const signUpSchema = z
	.object({
		email: z
			.email("Email inválido")
			.refine(email => email.endsWith("@chabra.com.br"), {
				message: "Apenas emails '@chabra.com.br' são permitidos",
			})
			.toLowerCase(),
		password: z.string().min(6, "A senha deve ter no minimo 6 caracteres"),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		error: "As senhas não coincidem.",
		path: ["confirmPassword"],
	})

export type FormSignUpProps = z.infer<typeof signUpSchema>
