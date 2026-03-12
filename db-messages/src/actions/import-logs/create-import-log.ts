"use server"

import { prisma } from "@/lib/prisma"
import { ImportLogType } from "@prisma/client"

// ============================================
// TYPES
// ============================================

interface CreateImportLogData {
    type: ImportLogType
    total: number
    succeeded: number
    failed: number
    duration: number
    payloadSize: number
}

// ============================================
// LEITURA
// ============================================

/**
 * Lista todos os logs, opcionalmente filtrados por tipo
 */
export async function findManyImportLogs(type?: ImportLogType) {
    return prisma.importLog.findMany({
        where: type ? { type } : undefined,
        orderBy: { createdAt: "desc" },
    })
}

/**
 * Busca o último log de um tipo específico
 */
export async function findLastImportLog(type: ImportLogType) {
    return prisma.importLog.findFirst({
        where: { type },
        orderBy: { createdAt: "desc" },
    })
}

// ============================================
// ESCRITA
// ============================================

/**
 * Cria um log de importação ao final de cada job
 */
export async function createImportLog(data: CreateImportLogData) {
    return prisma.importLog.create({
        data: {
            type: data.type,
            total: data.total,
            succeeded: data.succeeded,
            failed: data.failed,
            duration: data.duration,
            payloadSize: data.payloadSize,
        },
    })
}