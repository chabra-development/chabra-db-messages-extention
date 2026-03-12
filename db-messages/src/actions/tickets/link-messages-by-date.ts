"use server"

import { ImportJobStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"

// ============================================
// LINK ALL MESSAGES TO TICKETS
// ============================================

export async function linkAllMessagesToTickets() {
    // Buscar total de tickets
    const totalTickets = await prisma.ticket.count()

    if (totalTickets === 0) {
        throw new Error("Nenhum ticket encontrado para vincular")
    }

    // Criar job de vinculação
    const job = await prisma.importJob.create({
        data: {
            total: totalTickets,
            status: ImportJobStatus.PENDING,
            metadata: {
                type: "link-messages",
                description: "Vinculando mensagens aos tickets por data",
            },
        },
    })

    // Processar em background
    processLinkMessages(job.id).catch((error) => {
        console.error("Erro ao vincular mensagens:", error)
    })

    return {
        success: true,
        jobId: job.id,
        message: `Vinculação iniciada: ${totalTickets} tickets`,
    }
}

// ============================================
// LINK SINGLE TICKET MESSAGES
// ============================================

/**
 * Vincula mensagens de um ticket específico baseado nas datas
 */
export async function linkTicketMessages(ticketId: string) {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        select: {
            id: true,
            contactId: true,
            openDate: true,
            closeDate: true,
            storageDate: true,
        },
    })

    if (!ticket) {
        throw new Error("Ticket não encontrado")
    }

    // Definir range de datas
    const startDate = ticket.openDate || ticket.storageDate
    const endDate = ticket.closeDate || new Date() // Se não fechou, até agora

    // Vincular mensagens que estão no período do ticket
    const result = await prisma.message.updateMany({
        where: {
            contactId: ticket.contactId,
            ticketId: null, // Apenas mensagens ainda não vinculadas
            sentAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        data: {
            ticketId: ticket.id,
        },
    })

    // Atualizar contador de mensagens no ticket
    const messageCount = await prisma.message.count({
        where: { ticketId: ticket.id },
    })

    await prisma.ticket.update({
        where: { id: ticket.id },
        data: { messageCount },
    })

    return {
        linked: result.count,
        total: messageCount,
    }
}

// ============================================
// PROCESS LINK MESSAGES (BACKGROUND)
// ============================================

async function processLinkMessages(jobId: string) {
    try {
        // Atualizar status para RUNNING
        await prisma.importJob.update({
            where: { id: jobId },
            data: {
                status: ImportJobStatus.RUNNING,
                startedAt: new Date(),
            },
        })

        const BATCH_SIZE = 50
        let skip = 0
        let hasMore = true
        let processed = 0
        let totalLinked = 0
        const failed: Array<{
            ticketId: string
            identity: string
            reason: string
        }> = []

        while (hasMore) {
            // Buscar lote de tickets
            const tickets = await prisma.ticket.findMany({
                take: BATCH_SIZE,
                skip: skip,
                select: {
                    id: true,
                    blipId: true,
                    contactId: true,
                    customerIdentity: true,
                    openDate: true,
                    closeDate: true,
                    storageDate: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            })

            if (tickets.length === 0) {
                hasMore = false
                break
            }

            // Processar cada ticket
            for (const ticket of tickets) {
                try {
                    const startDate = ticket.openDate || ticket.storageDate
                    const endDate = ticket.closeDate || new Date()

                    // Vincular mensagens
                    const result = await prisma.message.updateMany({
                        where: {
                            contactId: ticket.contactId,
                            ticketId: null,
                            sentAt: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        data: {
                            ticketId: ticket.id,
                        },
                    })

                    totalLinked += result.count

                    // Atualizar contador no ticket
                    const messageCount = await prisma.message.count({
                        where: { ticketId: ticket.id },
                    })

                    await prisma.ticket.update({
                        where: { id: ticket.id },
                        data: { messageCount },
                    })
                } catch (error) {
                    failed.push({
                        ticketId: ticket.blipId,
                        identity: ticket.customerIdentity,
                        reason: error instanceof Error ? error.message : "Erro desconhecido",
                    })
                }

                processed++

                // Atualizar progresso a cada 10 tickets
                if (processed % 10 === 0) {
                    await prisma.importJob.update({
                        where: { id: jobId },
                        data: {
                            processed,
                            succeeded: processed - failed.length,
                            failedCount: failed.length,
                            failed: failed as any,
                            metadata: {
                                type: "link-messages",
                                totalLinked,
                            },
                        },
                    })
                }
            }

            skip += BATCH_SIZE
            hasMore = tickets.length === BATCH_SIZE
        }

        // Finalizar job
        await prisma.importJob.update({
            where: { id: jobId },
            data: {
                status: ImportJobStatus.COMPLETED,
                processed,
                succeeded: processed - failed.length,
                failedCount: failed.length,
                failed: failed as any,
                completedAt: new Date(),
                metadata: {
                    type: "link-messages",
                    totalLinked,
                    totalTickets: processed,
                },
            },
        })
    } catch (error) {
        // Marcar job como falho
        await prisma.importJob.update({
            where: { id: jobId },
            data: {
                status: ImportJobStatus.FAILED,
                completedAt: new Date(),
                metadata: {
                    type: "link-messages",
                    error: error instanceof Error ? error.message : "Erro desconhecido",
                },
            },
        })
    }
}

// ============================================
// GET LINK STATISTICS
// ============================================

/**
 * Retorna estatísticas sobre mensagens vinculadas
 */
export async function getLinkStatistics() {
    const [linked, unlinked, total, ticketsWithMessages] = await Promise.all([
        prisma.message.count({
            where: { ticketId: { not: null } },
        }),
        prisma.message.count({
            where: { ticketId: null },
        }),
        prisma.message.count(),
        prisma.ticket.count({
            where: { messageCount: { gt: 0 } },
        }),
    ])

    return {
        messages: {
            linked,
            unlinked,
            total,
            linkedPercentage: total > 0 ? Math.round((linked / total) * 100) : 0,
        },
        tickets: {
            withMessages: ticketsWithMessages,
            total: await prisma.ticket.count(),
        },
    }
}

// ============================================
// UNLINK ALL MESSAGES (RESET)
// ============================================

/**
 * Remove todos os vínculos de mensagens (útil para reprocessar)
 */
export async function unlinkAllMessages() {
    
    const result = await prisma.message.updateMany({
        where: { ticketId: { not: null } },
        data: { ticketId: null },
    })

    // Resetar contadores dos tickets
    await prisma.ticket.updateMany({
        data: { messageCount: 0 },
    })

    return {
        unlinked: result.count,
    }
}