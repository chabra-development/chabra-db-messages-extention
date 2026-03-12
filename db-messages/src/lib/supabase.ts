import { env } from '@/env'
import { createClient } from '@supabase/supabase-js'
import z from 'zod'

const envSchema = z.object({
    SUPABASE_URL: z.url(),
    SUPABASE_KEY: z.string().min(1),
})

const { data } = envSchema.safeParse({
    SUPABASE_KEY: env.SUPABASE_KEY,
    SUPABASE_URL: env.SUPABASE_URL
})

if (!data) {
    throw new Error('Invalid or missing SUPABASE_URL or SUPABASE_KEY in environment variables')
}

const { SUPABASE_URL, SUPABASE_KEY } = data

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)