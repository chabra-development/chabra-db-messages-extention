"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { ptBR } from "date-fns/locale"

export const CaledarRange = () => {

    const from = new Date(new Date().getFullYear(), 0, 12)
    const to = addDays(new Date(new Date().getFullYear(), 0, 12), 30)

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from,
        to
    })

    return (
        <Card className="border-none py-2">
            <CardContent className="px-2">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={ptBR}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    className="border-none size-full"
                />
            </CardContent>
        </Card>

    )
}
