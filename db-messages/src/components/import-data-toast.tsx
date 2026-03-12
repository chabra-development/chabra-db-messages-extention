"use client"

import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { formatTimeRemaining, useImportProgress } from "@/hooks/use-import-progress"
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Clock,
    Loader2,
    Users,
    XCircle,
} from "lucide-react"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"

interface ImportProgressToastProps {
    message: string
    jobId: string
    onComplete?: () => void
}

export function ImportProgressToast({
    jobId,
    onComplete,
    message
}: ImportProgressToastProps) {

    const {
        data,
        progress,
        isComplete,
        hasFailed,
        isRunning,
        isPending,
        estimatedTimeRemaining,
    } = useImportProgress({ jobId })

    useEffect(() => {
        if (isComplete && onComplete) {
            onComplete()
        }
    }, [isComplete, onComplete])

    // Toast de progresso
    useEffect(() => {
        if (isPending || isRunning) {
            toast.custom(
                (t) => (
                    <ImportToastContent
                        message={message}
                        data={data}
                        progress={progress}
                        isRunning={isRunning}
                        isPending={isPending}
                        estimatedTimeRemaining={estimatedTimeRemaining}
                        onDismiss={() => toast.dismiss(t)}
                    />
                ),
                {
                    id: `import-${jobId}`,
                    duration: Infinity,
                    style: {
                        width: "33vw",
                    },
                }
            )
        }
    }, [isPending, isRunning, data, progress, estimatedTimeRemaining, jobId])

    // Toast de sucesso
    useEffect(() => {
        if (isComplete && data) {
            toast.dismiss(`import-${jobId}`)

            toast.custom(
                (t) => (
                    <SuccessToastContent
                        data={data}
                        onDismiss={() => toast.dismiss(t)}
                    />
                ),
                {
                    id: `import-success-${jobId}`,
                    duration: 10000,
                    style: {
                        width: "33vw",
                    },
                }
            )
        }
    }, [isComplete, data, jobId])

    // Toast de erro
    useEffect(() => {
        if (hasFailed && data) {
            toast.dismiss(`import-${jobId}`)

            toast.custom(
                (t) => (
                    <ErrorToastContent
                        data={data}
                        onDismiss={() => toast.dismiss(t)}
                    />
                ),
                {
                    id: `import-error-${jobId}`,
                    duration: Infinity,
                    style: {
                        width: "33vw",
                    },
                }
            )
        }
    }, [hasFailed, data, jobId])

    // Overlay de bloqueio durante importação ativa
    if ((isPending || isRunning) && typeof window !== "undefined") {
        return createPortal(
            <div
                className="fixed inset-0 z-9999 bg-black/40 backdrop-blur-sm"
                aria-hidden="true"
            />,
            document.body
        )
    }

    return null
}

// ============================================
// TOAST DE PROGRESSO
// ============================================
interface ImportToastContentProps {
    message: string
    data: any
    progress: number
    isRunning: boolean
    isPending: boolean
    estimatedTimeRemaining: number | null
    onDismiss: () => void
}

function ImportToastContent({
    message,
    data,
    progress,
    isRunning,
    isPending,
    estimatedTimeRemaining,
}: ImportToastContentProps) {

    if (!data) return null

    const { total, processed, succeeded, failedCount } = data

    return (
        <div className="size-full border bg-background rounded-lg shadow-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    {isPending && (
                        <Clock className="size-5 text-muted-foreground animate-pulse" />
                    )}
                    {isRunning && (
                        <Loader2 className="size-5 text-primary animate-spin" />
                    )}
                    <div>
                        <p className="font-semibold text-sm">
                            {isPending ? "Preparando importação..." : `Importando ${message}`}
                        </p>
                        {data.metadata?.deduplicatedCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {data.metadata.deduplicatedCount} duplicata(s) removida(s)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                        {processed} de {total}
                    </span>
                    <span className="font-medium tabular-nums">{progress}%</span>
                </div>

                <Progress value={progress} className="h-2" />

                {isRunning && estimatedTimeRemaining && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        Tempo estimado: {formatTimeRemaining(estimatedTimeRemaining)}
                    </p>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <div className="text-xs">
                        <p className="font-medium text-green-700 tabular-nums">{succeeded}</p>
                        <p className="text-muted-foreground">Sucesso</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
                    <XCircle className="size-4 text-destructive" />
                    <div className="text-xs">
                        <p className="font-medium text-destructive tabular-nums">{failedCount}</p>
                        <p className="text-muted-foreground">Falhas</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================
// TOAST DE SUCESSO
// ============================================
interface SuccessToastContentProps {
    data: any
    onDismiss: () => void
}

function SuccessToastContent({ data, onDismiss }: SuccessToastContentProps) {

    const { succeeded, failedCount, failed } = data

    return (
        <ScrollArea className="h-fit max-h-120 border shadow-lg p-4 rounded-lg bg-background">
            <ScrollBar />
            <div className="size-full space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="size-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">Importação concluída!</p>
                        <p className="text-xs text-muted-foreground">
                            {succeeded} item(s) importado(s) com sucesso
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={onDismiss}
                    >
                        <XCircle className="size-4" />
                    </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 p-3 rounded-md bg-green-500/5">
                    <div className="flex items-center gap-2">
                        <Users className="size-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                            {succeeded} sucesso
                        </span>
                    </div>
                    {failedCount > 0 && (
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">
                                {failedCount} falha(s)
                            </span>
                        </div>
                    )}
                </div>

                {/* Lista de erros colapsável */}
                {failed && failed.length > 0 && (
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="size-full justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <AlertTriangle className="size-4" />
                                    Ver erros ({failed.length})
                                </span>
                                <ChevronDown className="size-4" />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                            <div className="space-y-2 pr-3">
                                {failed.map((error: any, index: number) => (
                                    <div
                                        key={`${error.identity}-${index}`}
                                        className="p-2 rounded-md bg-destructive/5 border border-destructive/20"
                                    >
                                        <p className="text-xs font-medium text-destructive truncate">
                                            {error.identity}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {error.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </ScrollArea>
    )
}

// ============================================
// TOAST DE ERRO
// ============================================
interface ErrorToastContentProps {
    data: any
    onDismiss: () => void
}

function ErrorToastContent({ data, onDismiss }: ErrorToastContentProps) {

    const { metadata } = data

    return (
        <div className="size-full bg-background border border-destructive rounded-lg shadow-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <XCircle className="size-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Erro na importação</p>
                    <ScrollArea className="h-20 mt-1">
                        <p className="text-xs text-muted-foreground wrap-break-word pr-3">
                            {metadata?.error || "Ocorreu um erro durante a importação"}
                        </p>
                    </ScrollArea>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={onDismiss}
                >
                    <XCircle className="size-4" />
                </Button>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="size-full"
                onClick={onDismiss}
            >
                Fechar
            </Button>
        </div>
    )
}