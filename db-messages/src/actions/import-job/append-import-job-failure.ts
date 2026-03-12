"use server"

import { prisma } from "@/lib/prisma"
import { findImportJobOrThrow } from "./find-import-job-by-id"
import { Prisma } from "@prisma/client"

type InputJsonValue = Prisma.InputJsonValue
type ImportJobUpdatefailedInput = Prisma.ImportJobUpdatefailedInput

interface ImportJobFailure {
    identity: string
    reason: string
    timestamp: Date
}

/**
 * Adiciona um item de falha ao array failed do job
 */
export async function appendImportJobFailure(
    id: string,
    failure: ImportJobFailure
) {

    await findImportJobOrThrow(id)

    return prisma.importJob.update({
        where: { id },
        data: {
            failed: {
                push: failure as InputJsonValue[] | ImportJobUpdatefailedInput,
            },
        },
    })
}