"use server"

import { prisma } from "@/lib/prisma"

/**
 * Busca um job pelo ID, retorna null se não encontrado
 */
export async function findImportJob(id: string) {
    return await prisma.importJob.findUnique({
        where: { id },
    })
}

/**
 * Busca um job pelo ID ou lança erro se não encontrado
 */
export async function findImportJobOrThrow(id: string) {

    const job = await prisma.importJob.findUnique({
        where: { id },
    })

    if (!job) {
        throw new Error(`ImportJob não encontrado: ${id}`)
    }

    return job
}