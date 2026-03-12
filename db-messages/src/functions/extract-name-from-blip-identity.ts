export function extractNameFromBlipIdentity(identity: string) {

    // pega só a parte antes do @
    const beforeAt = identity.split("@")[0]

    // remove qualquer coisa após %
    const clean = beforeAt.split("%")[0]

    // separa pelo ponto
    const [first, second] = clean.split(".")

    if (!first || !second) {
        return clean
    }

    return `${first} ${second}`
}