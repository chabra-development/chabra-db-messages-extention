"use server"

import { prisma } from "@/lib/prisma"

/**
 * Verifica se existe algum job ativo (PENDING ou RUNNING).
 * Útil para impedir importações simultâneas.
 */
export async function findActiveImportJob() {
    return prisma.importJob.findFirst({
        where: {
            status: { in: ["PENDING", "RUNNING"] },
        },
    })
}