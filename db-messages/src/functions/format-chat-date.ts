import {
    isToday,
    isYesterday,
    format
} from "date-fns"
import { ptBR } from "date-fns/locale"

export function formatChatDate(date: Date) {

    if (isToday(date)) return "Hoje"
    if (isYesterday(date)) return "Ontem"

    return format(date, "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
    })
}