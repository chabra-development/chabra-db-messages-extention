import type { ImportJobStatus } from "@prisma/client"

export interface ImportProgress {
    id: string
    total: number
    processed: number
    succeeded: number
    failedCount: number
    status: ImportJobStatus
    failed: Array<{
        identity: string
        email: string
        reason: string
        timestamp?: Date
    }>
    metadata?: {
        deduplicatedCount?: number
        batchSize?: number
        totalSucceeded?: number
        totalFailed?: number
        completedAt?: string
        error?: string
    }
    createdAt: Date
    updatedAt: Date
    startedAt: Date | null
    completedAt: Date | null
}