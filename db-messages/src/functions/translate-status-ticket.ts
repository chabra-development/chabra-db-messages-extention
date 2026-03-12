export function translateStatus(status: string) {

    if (status === "ClosedAttendant") {
        return "atendimento encerrado"
    } else if (status === "Transferred") {
        return "transferido"
    } else if (status = "Waiting") {
        return "aguardando"
    }

    return "aberto"
}