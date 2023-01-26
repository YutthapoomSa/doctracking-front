export interface ResDocumentRoutingListRender {
    id: string;
    agencyIdRecipient: string;
    agencyIdSender: string;
    agencySecondaryIdRecipient?: string;
    agencySecondaryIdSender: string;
    createdAt: string;
    updatedAt: string;
    documentId: string;
    isSuccess: boolean;
    status: string;
}
