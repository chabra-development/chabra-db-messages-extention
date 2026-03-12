"use client"

import { getDownloadUrl } from "@/actions/supabase/get-download-url"
import { useState } from "react"

export function useDownloadFile() {
    
    const [isDownloading, setIsDownloading] = useState(false)

    async function download(path: string) {
        try {
            setIsDownloading(true)

            const { url, fileName } = await getDownloadUrl(path)

            const response = await fetch(url)
            const blob = await response.blob()

            const fileHandle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{
                    description: "Arquivo",
                    accept: { [blob.type]: [] },
                }],
            })

            const writable = await fileHandle.createWritable()
            await writable.write(blob)
            await writable.close()

        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return
            throw error
        } finally {
            setIsDownloading(false)
        }
    }

    return { download, isDownloading }
}