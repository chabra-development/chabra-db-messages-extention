export type IrisTicketResponse = {
    type: "application/vnd.iris.ticket+json"
    resource: {
        id: string
        sequentialId: number
        ownerIdentity: string
        customerIdentity: string
        customerDomain: string
        agentIdentity: string
        provider: "Lime"
        status: "ClosedAttendant" | string
        storageDate: string // ISO date
        openDate: string // ISO date
        closeDate: string // ISO date
        statusDate: string // ISO date
        rating: number
        team: string
        unreadMessages: number
        closed: boolean
        closedBy: string
        firstResponseDate: string // ISO date
        parentSequentialId: number
        priority: number
        isAutomaticDistribution: boolean
    }
    method: "get" | string
    status: "success" | "failure" | string
    id: string
    from: string
    to: string
    metadata: {
        traceparent: string
        "#command.uri": string
        "#metrics.custom.label": string
    }
}


export type LimeCollectionResponse = {
    type: string
    resource: LimeCollectionResource
    method: 'get' | string
    status: 'success' | 'failure' | string
    id: string
    from: string
    to: string
    metadata: LimeMetadata
}

export type LimeCollectionResource = {
    total: number
    itemType: string
    items: LimeTicket[]
}

export type LimeTicket = {
    id: string
    sequentialId: number
    ownerIdentity: string
    customerIdentity: string
    customerDomain: string
    provider: string
    status: TicketStatus

    storageDate: string
    statusDate: string

    openDate?: string
    closeDate?: string
    firstResponseDate?: string

    externalId?: string
    agentIdentity?: string

    rating: number
    team: string
    unreadMessages: number
    closed: boolean
    closedBy?: string

    parentSequentialId?: number
    priority: number

    isAutomaticDistribution?: boolean
    distributionType?: string
}

export type LimeMetadata = {
    traceparent: string
    '#command.uri': string
    '#metrics.custom.label': string
}


export type TicketStatus =
    | 'Open'
    | 'ClosedClient'
    | 'ClosedAttendant'
    | 'Transferred'
    | string

