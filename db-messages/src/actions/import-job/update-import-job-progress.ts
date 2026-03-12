"use server"

import { prisma } from "@/lib/prisma"
import { findImportJobOrThrow } from "./find-import-job-by-id"

interface UpdateImportJobProgressData {
    processedIncrement: number
    succeededIncrement: number
    failedIncrement: number
}


/**
 * Incrementa os contadores de progresso do job
 */
export async function updateImportJobProgress(
    id: string,
    data: UpdateImportJobProgressData
) {

    await findImportJobOrThrow(id)

    return prisma.importJob.update({
        where: { id },
        data: {
            processed: { increment: data.processedIncrement },
            succeeded: { increment: data.succeededIncrement },
            failedCount: { increment: data.failedIncrement },
        },
    })
}