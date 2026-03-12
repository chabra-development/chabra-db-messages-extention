import { BUCKET_NAME } from "@/constraints/bucket"
import { supabase } from "@/lib/supabase"

export function getPublicUrl(path: string) {

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)

    const publicUrl = data.publicUrl

    return publicUrl
}