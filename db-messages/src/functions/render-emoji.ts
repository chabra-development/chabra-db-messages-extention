export function renderEmoji(emoji: { values: number[] }): string {
    return String.fromCodePoint(...emoji.values)
}