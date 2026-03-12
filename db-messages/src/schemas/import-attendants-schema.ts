import z from "zod"

export const importAttendantsSchema = z.object({
    attendents: z
        .array(
            z.object({
                identity: z
                    .string()
                    .min(1, "Identity é obrigatório"),
                check: z
                    .boolean()
                    .optional(),
                email: z
                    .email("Email inválido"),
                teams: z
                    .array(
                        z.string()
                    ),
            })
        )
        .min(1, "Selecione ao menos um atendente")
})

export type ImportAttendantsProps = z.infer<typeof importAttendantsSchema>