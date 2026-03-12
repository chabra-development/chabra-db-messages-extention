export type BlipAttendantsResponse = {
    id: string
    from: string
    to: string
    type: "application/vnd.lime.collection+json"
    resource: {
        total: number
        itemType: "application/vnd.iris.desk.attendant+json"
        items: BlipAttendant[]
    }
    method: "get"
    status: "success"
    metadata: {
        traceparent: string
        "#command.uri": string
        "#metrics.custom.label": string
    }
}

export type BlipAttendant = {
    identity: string
    fullName: string
    email: string
    teams: string[]
    status: "Online" | "Offline" | "Invisible"
    isEnabled: boolean
}
