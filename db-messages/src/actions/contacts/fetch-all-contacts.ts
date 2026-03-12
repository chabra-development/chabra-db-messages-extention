"use server"

import { LimeContact } from "@/types/lime-collection-response.types"
import { fetchContactsPage } from "./fetch-contacts-page"
import { delay } from "@/functions/delay"

/**
 * Busca todos os contatos da API paginando até o total
 */
export async function fetchAllContacts(routerApiKey: string, TAKE: number): Promise<LimeContact[]> {

    const firstPage = await fetchContactsPage(routerApiKey, 0, TAKE)

    if (firstPage.status !== "success") {
        throw new Error(`Falha ao buscar contatos: ${firstPage.status}`)
    }

    const total = firstPage.resource.total
    const allContacts: LimeContact[] = [...firstPage.resource.items]

    const remainingPages = Math.ceil((total - TAKE) / TAKE)

    for (let i = 1; i <= remainingPages; i++) {
        const skip = i * TAKE
        const page = await fetchContactsPage(routerApiKey, skip, TAKE)

        if (page.status !== "success") {
            throw new Error(`Falha ao buscar página ${i}: ${page.status}`)
        }

        allContacts.push(...page.resource.items)

        await delay(300)
    }

    return allContacts
}