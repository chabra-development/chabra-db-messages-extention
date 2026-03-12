"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

interface CreateImportJobData {
    total: number
    metadata?: Prisma.JsonValue | Prisma.JsonArray
}

/**
 * Cria um novo job de importação com status PENDING
 */
export async function createImportJob(data: CreateImportJobData) {
    return prisma.importJob.create({
        data: {
            total: data.total,
            processed: 0,
            succeeded: 0,
            failedCount: 0,
            status: "PENDING",
            metadata: data.metadata ?? {},
        },
    })
}