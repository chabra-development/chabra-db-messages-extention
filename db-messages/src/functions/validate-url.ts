const VALID_TLDS = new Set([
    "com",
    "br",
    "net",
    "org",
    "io",
    "dev",
    "app",
    "co",
    "ai",
    "edu",
    "gov",
    "info",
    "biz",
    "xyz",
    "me",
    "us",
    "uk",
    "de",
    "fr",
    "es",
    "it",
    "ca",
    "au",
    "jp",
])

export function isSafePublicUrl(value: string): boolean {
    try {
        const url = new URL(value)

        // 1️⃣ protocolo
        if (!["http:", "https:"].includes(url.protocol)) return false

        const hostname = url.hostname.toLowerCase()

        // 2️⃣ bloquear localhost
        if (hostname === "localhost") return false

        // 3️⃣ bloquear IP privado
        if (
            /^10\./.test(hostname) ||
            /^192\.168\./.test(hostname) ||
            /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname) ||
            /^127\./.test(hostname)
        ) {
            return false
        }

        // 4️⃣ deve conter ponto
        if (!hostname.includes(".")) return false

        const parts = hostname.split(".")
        const last = parts[parts.length - 1]
        const secondLast = parts[parts.length - 2]

        const combined = `${secondLast}.${last}`

        // 5️⃣ validar TLD
        if (!VALID_TLDS.has(last) && !VALID_TLDS.has(combined)) {
            return false
        }

        return true
    } catch {
        return false
    }
}