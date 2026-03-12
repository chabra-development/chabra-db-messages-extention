"use server"

import { prisma } from "@/lib/prisma"
import { ImportJobStatus } from "@prisma/client"

/**
 * Lista todos os jobs, opcionalmente filtrados por status
 */
export async function findManyImportJobs(status?: ImportJobStatus) {
    return prisma.importJob.findMany({
        where: { status },
        orderBy: {
            createdAt: "desc"
        },
    })
}