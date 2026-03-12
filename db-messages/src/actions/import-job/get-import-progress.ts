// src/actions/jobs/get-import-progress.ts
"use server"

import { prisma } from "@/lib/prisma"
import type { ImportProgress } from "@/types/import-job.types"

export async function getImportProgress(jobId: string): Promise<ImportProgress | null> {
    
    const job = await prisma.importJob.findUnique({
        where: { id: jobId },
    })

    if (!job) return null

    return {
        id: job.id,
        total: job.total,
        processed: job.processed,
        succeeded: job.succeeded,
        failedCount: job.failedCount,
        status: job.status,
        failed: job.failed as unknown as Array<{
            identity: string
            email: string
            reason: string
            timestamp?: Date
        }>,
        metadata: job.metadata as ImportProgress["metadata"],
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
    }
}