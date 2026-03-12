export type BlipAccountResponse = {
    type: "application/vnd.lime.account+json";
    resource: {
        fullName: string;
        alternativeAccount: string;
        identity: string;
        phoneNumber: string;
        source: "WhatsApp" | string;
    };
    method: "get" | "post" | "set" | string;
    status: "success" | "failure";
    id: string;
    from: string;
    to: string;
    metadata: {
        traceparent?: string;
        "#command.uri"?: string;
        [key: string]: unknown;
    };
};