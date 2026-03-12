"use client"

interface UploadResult {
    url: string
    originalSize: number
    finalSize: number
    type: string
    filename: string
}

interface FileUploaderTestProps {
    contactId: string
}

export default function TestPage() {
    return (
        <div className="p-8">
            <FileUploaderTest contactId="seu-contact-id-aqui" />
        </div>
    )
}



import { uploadFile } from "@/actions/supabase/upload-files"
import { compressImageFile } from "@/hooks/use-compress-image"
import { useState } from "react"

export function FileUploaderTest({ contactId }: FileUploaderTestProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<UploadResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        setResult(null)
        setError(null)

        try {
            const originalSize = file.size

            // Comprime se for imagem, caso contrário usa o original
            const fileToUpload = await compressImageFile(file)
            const finalSize = fileToUpload.size

            const url = await uploadFile(fileToUpload, contactId)

            setResult({
                url,
                originalSize,
                finalSize,
                type: file.type,
                filename: file.name,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido")
        } finally {
            setIsLoading(false)
        }
    }

    function formatBytes(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    function getSavings(original: number, final: number): string {
        const saved = ((original - final) / original) * 100
        return saved > 0 ? `${saved.toFixed(1)}% menor` : "sem compressão"
    }

    return (
        <div className="flex flex-col gap-4 p-6 max-w-lg border border-zinc-200 rounded-xl">
            <h2 className="text-lg font-semibold text-zinc-900">
                Teste de Upload
            </h2>

            <p className="text-sm text-zinc-500">
                Contact ID: <span className="font-mono text-zinc-700">{contactId}</span>
            </p>

            <input
                type="file"
                onChange={handleFileChange}
                disabled={isLoading}
                className="block w-full text-sm text-zinc-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-zinc-900 file:text-zinc-50
                    hover:file:bg-zinc-700
                    disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="size-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                    Processando e enviando...
                </div>
            )}

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600 font-medium">Erro</p>
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            )}

            {result && (
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                    <p className="text-sm font-medium text-zinc-900">
                        ✅ Upload realizado com sucesso
                    </p>

                    <div className="flex flex-col gap-1 text-sm text-zinc-600">
                        <p><span className="font-medium">Arquivo:</span> {result.filename}</p>
                        <p><span className="font-medium">Tipo:</span> {result.type}</p>
                        <p><span className="font-medium">Tamanho original:</span> {formatBytes(result.originalSize)}</p>
                        <p><span className="font-medium">Tamanho final:</span> {formatBytes(result.finalSize)}</p>
                        <p><span className="font-medium">Compressão:</span> {getSavings(result.originalSize, result.finalSize)}</p>
                    </div>

                    <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline break-all"
                    >
                        {result.url}
                    </a>

                    {result.type.startsWith("image/") && (
                        <img
                            src={result.url}
                            alt="Preview"
                            className="rounded-lg max-h-48 object-contain"
                        />
                    )}
                </div>
            )
            }
        </div >
    )
}