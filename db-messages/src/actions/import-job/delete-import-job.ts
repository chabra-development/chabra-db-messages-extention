"use server"

import { prisma } from "@/lib/prisma"
import { findImportJobOrThrow } from "./find-import-job-by-id"

/**
 * Remove o job do banco. Chamada após o delay de limpeza.
 */
export async function deleteImportJob(id: string) {

    await findImportJobOrThrow(id)

    return prisma.importJob.delete({
        where: { id },
    })
}