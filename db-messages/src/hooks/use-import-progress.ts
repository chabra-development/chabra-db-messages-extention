"use client"

import { useQuery } from "@tanstack/react-query"
import { getImportProgress } from "@/actions/import-job/get-import-progress"
import type { ImportProgress } from "@/types/import-job.types"
import type { ImportJobStatus } from "@prisma/client"

interface UseImportProgressOptions {
    jobId: string | null
    enabled?: boolean
    refetchInterval?: number | false
}

export const useImportProgress = ({
    jobId,
    enabled = true,
    refetchInterval = 1000,
}: UseImportProgressOptions) => {
    const query = useQuery<ImportProgress | null>({
        queryKey: ["import-progress", jobId],
        queryFn: () => (jobId ? getImportProgress(jobId) : null),
        enabled: enabled && !!jobId,
        refetchInterval: (data) => {
            const jobData = data.state.data
            
            if (!jobData || 
                jobData.status === "COMPLETED" || 
                jobData.status === "FAILED" ||
                jobData.status === "CANCELLED"
            ) {
                return false
            }
            
            return refetchInterval
        },
        staleTime: 0,
    })

    const progress = query.data
        ? Math.round((query.data.processed / query.data.total) * 100)
        : 0

    const isComplete = query.data?.status === "COMPLETED"
    const hasFailed = query.data?.status === "FAILED"
    const isRunning = query.data?.status === "RUNNING"
    const isPending = query.data?.status === "PENDING"
    const isCancelled = query.data?.status === "CANCELLED"

    const estimatedTimeRemaining = (() => {
        if (!query.data || !query.data.startedAt) return null

        const { processed, total, startedAt } = query.data

        if (processed === 0) return null

        const elapsed = Date.now() - new Date(startedAt).getTime()
        const rate = processed / elapsed
        const remaining = total - processed
        const estimatedMs = remaining / rate

        return Math.ceil(estimatedMs / 1000)
    })()

    return {
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        progress,
        isComplete,
        hasFailed,
        isRunning,
        isPending,
        isCancelled,
        estimatedTimeRemaining,
        data: query.data,
    }
}

// Helpers
export function formatTimeRemaining(seconds: number | null): string {
    if (seconds === null || seconds <= 0) return ""

    if (seconds < 60) {
        return `${seconds}s`
    }

    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60

    if (minutes < 60) {
        return `${minutes}m ${secs}s`
    }

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    return `${hours}h ${mins}m`
}

export function formatDuration(startedAt: Date | null, completedAt: Date | null): string {
    if (!startedAt || !completedAt) return ""

    const durationMs = new Date(completedAt).getTime() - new Date(startedAt).getTime()
    const seconds = Math.floor(durationMs / 1000)

    return formatTimeRemaining(seconds)
}

export function isJobActive(status: ImportJobStatus): boolean {
    return status === "PENDING" || status === "RUNNING"
}

export function isJobFinished(status: ImportJobStatus): boolean {
    return status === "COMPLETED" || status === "FAILED" || status === "CANCELLED"
}

export function getStatusColor(status: ImportJobStatus): string {
    const colors = {
        PENDING: "text-gray-500",
        RUNNING: "text-blue-500",
        COMPLETED: "text-green-500",
        FAILED: "text-red-500",
        CANCELLED: "text-orange-500",
    }

    return colors[status] || "text-gray-500"
}

export function getStatusLabel(status: ImportJobStatus): string {
    const labels = {
        PENDING: "Pendente",
        RUNNING: "Em andamento",
        COMPLETED: "Concluído",
        FAILED: "Falhou",
        CANCELLED: "Cancelado",
    }

    return labels[status] || status
}