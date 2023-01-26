export interface ResFindOneDocumentArray {
    resCode: string;
    msg: string;
    resData: ResFindOneDocumentArrayDatas[];
}

export interface ResFindOneDocumentArrayDatas {
    id: string;
    status: string;
    name: string;
    detail: string;
    governmentDocNo: string;
    priority: string;
    barcode: string;
    documentType: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    toDoc: string;
    formDoc: string;
    docNo: string;
    recipientAt: string;
    documentRoutingLists: ResFindOneDocumentArrayDatasRoutingLists[];
}

export interface ResFindOneDocumentArrayDatasRoutingLists {
    id: string;
    documentId: string;
    agencyIdSender: string;
    agencyIdRecipient: string;
    agencySecondaryIdRecipient: any;
    agencySecondaryIdSender: any;
    createdAt: string;
    updatedAt: string;
}
