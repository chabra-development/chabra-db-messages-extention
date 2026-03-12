export function getTextColorFromBackground(hex: string | null) {

    if (!hex) return

    const clean = hex.replace("#", "")

    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)

    const toLinear = (c: number) => {
        const s = c / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }

    const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

    return luminance > 0.179 ? "text-zinc-900" : "text-zinc-50"
}