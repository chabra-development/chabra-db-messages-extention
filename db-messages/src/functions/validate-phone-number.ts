import { z } from "zod"

export const phoneNumberBRSchema = z
    .string()
    .transform(value => value.replace(/\D/g, "")) // só números
    .transform(digits => {

        if (
            digits === "" || 
            digits === undefined || 
            digits === null
        ) {
            return ""
        }

        // remove 55 duplicado (5555...)
        if (digits.startsWith("5555")) {
            return digits.slice(2)
        }
        return digits
    })
    .transform(digits => {
        // remove DDI 55
        if (digits.startsWith("55")) {
            return digits.slice(2)
        }
        return digits
    })
    .transform(digits => {
        const ddd = digits.slice(0, 2)
        const number = digits.slice(2)

        // celular
        if (number.length === 9) {
            return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`
        }

        // fixo
        return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`
    })
