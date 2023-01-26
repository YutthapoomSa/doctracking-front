export interface ReqDocumentForwardOrReturn {
    status: string;
    comment: string;
    agencyIdSender: string;
    agencyIdRecipient: string;
    documentId: string;
    agencySecondaryIdSender: string;
    agencySecondaryIdRecipient: string;
    formDoc: string;
    toDoc: string;
    documentRoutingId: string;
}
