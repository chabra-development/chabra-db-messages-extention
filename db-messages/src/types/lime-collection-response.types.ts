export interface LimeCollectionResponse {
    type: "application/vnd.lime.collection+json"
    resource: LimeCollectionResource
    method: "get"
    status: "success" | "failure"
    id: string
    from: string
    to: string
    metadata: LimeMetadata
}

export interface LimeCollectionResource {
    total: number
    itemType: "application/vnd.lime.contact+json"
    items: LimeContact[]
}

export interface LimeContact {
    identity: string
    name: string
    source: string
    lastMessageDate?: string
    lastUpdateDate?: string
    phoneNumber: string
    email?: string
    taxDocument?: string
    group?: string
    extras?: LimeContactExtras
}

export interface LimeContactExtras {
    channel?: string
    aceitouLGPD?: "Aceito" | "Recusado" | string
    subflowId?: string

    Menu?: string
    Unidade?: string
    Fila?: string
    Atendente?: string

    dadosTicket?: string
    campaignId?: string
    lastCampaignId?: string

    meta_ad_id?: string
    meta_ad_headline?: string
    meta_ad_type?: string
    meta_ad_url?: string

    isTestersGroup?: string
    typeOfCompile?: string

    [key: string]: string | undefined
}

export interface LimeMetadata {
    traceparent?: string
    "#command.uri"?: string
}
