import z from "zod"

export const zString = (message?: string) =>
    z.string({ error: message }).trim().toLowerCase()