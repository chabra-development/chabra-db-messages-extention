import z from "zod";

export const findManyAttendantsSchema = z.object({
    take: z.coerce.number().int().positive(),
    skip: z.coerce.number().int().min(0)
})