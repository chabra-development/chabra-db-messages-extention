"use client"

import { getLinkStatistics, linkAllMessagesToTickets } from "@/actions/tickets/link-messages-by-date"
import { ImportProgressToast } from "@/components/import-data-toast"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { InputGroupButton } from "@/components/ui/input-group"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BarChart3, Link2, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function LinkMessagesButton() {

    const [jobId, setJobId] = useState<string | null>(null)
    const [showStats, setShowStats] = useState(false)

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            return await linkAllMessagesToTickets()
        },
        onSuccess: (data) => {
            if (data.success && data.jobId) {
                setJobId(data.jobId)
                toast.success(data.message)
            }
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Erro ao vincular mensagens")
        },
    })

    const { data: stats, refetch: refetchStats } = useQuery({
        queryKey: ["link-statistics"],
        queryFn: getLinkStatistics,
        enabled: showStats,
    })

    return (
        <>
            <div className="flex items-center gap-2">
                <InputGroupButton
                    onClick={() => mutate()}
                    disabled={isPending}
                    className="gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Iniciando...
                        </>
                    ) : (
                        <>
                            <Link2 className="size-4" />
                            Vincular Mensagens
                        </>
                    )}
                </InputGroupButton>

                <Dialog open={showStats} onOpenChange={setShowStats}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => refetchStats()}
                        >
                            <BarChart3 className="size-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-1/2">
                        <DialogHeader>
                            <DialogTitle>
                                Estatísticas de Vinculação
                            </DialogTitle>
                            <DialogDescription>
                                Status atual das mensagens vinculadas aos tickets
                            </DialogDescription>
                        </DialogHeader>

                        {stats && (
                            <div className="space-y-4">
                                {/* Mensagens */}
                                <div>
                                    <h3 className="font-semibold mb-2">Mensagens</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 rounded-lg border">
                                            <p className="text-sm text-muted-foreground">
                                                Vinculadas
                                            </p>
                                            <p className="text-2xl font-bold text-green-700">
                                                {stats.messages.linked.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg border">
                                            <p className="text-sm text-muted-foreground">
                                                Não vinculadas
                                            </p>
                                            <p className="text-2xl font-bold text-gray-700">
                                                {stats.messages.unlinked.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 p-3 rounded-lg border">
                                        <p className="text-sm text-muted-foreground">
                                            Total
                                        </p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {stats.messages.total.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {stats.messages.linkedPercentage}% vinculadas
                                        </p>
                                    </div>
                                </div>

                                {/* Tickets */}
                                <div>
                                    <h3 className="font-semibold mb-2">Tickets</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 rounded-lg border">
                                            <p className="text-sm text-muted-foreground">
                                                Com mensagens
                                            </p>
                                            <p className="text-2xl font-bold text-purple-700">
                                                {stats.tickets.withMessages.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg border">
                                            <p className="text-sm text-muted-foreground">
                                                Total
                                            </p>
                                            <p className="text-2xl font-bold text-gray-700">
                                                {stats.tickets.total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Toast de progresso */}
            {jobId && (
                <ImportProgressToast
                    message="tickets"
                    jobId={jobId}
                    onComplete={() => {
                        setJobId(null)
                        refetchStats()
                        toast.success("Mensagens vinculadas com sucesso!")
                    }}
                />
            )}
        </>
    )
}