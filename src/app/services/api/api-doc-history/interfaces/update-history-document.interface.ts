export interface ReqUpdateHistoryDocuments {
    status: string;
    comment: string;
    agencyIdSender: string;
    agencyIdRecipient: string;
    documentId: string;
    agencySecondaryIdSender: string;
    agencySecondaryIdRecipient: string;
    documentRoutingId?: string;
    formDoc: string;
    toDoc: string;
}
