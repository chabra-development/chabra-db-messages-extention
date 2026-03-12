export function normalizeWhatsAppIdentify(identify: string): string {
    
    const [rawNumber, domain] = identify.split("@")

    if (!rawNumber || !domain) {
        return identify
    }

    const digits = rawNumber.replace(/\D/g, "")

    // válido no BR: 12 ou 13 dígitos
    const isValidLength = digits.length === 12 || digits.length === 13

    // caso inválido E comece com 5555 → remove um 55
    if (!isValidLength && digits.startsWith("5555")) {
        
        const normalized = digits.slice(2)

        if (normalized.length === 12 || normalized.length === 13) {
            return `${normalized}@${domain}`
        }
    }

    // se já estiver ok ou não der pra corrigir
    return `${digits}@${domain}`
}