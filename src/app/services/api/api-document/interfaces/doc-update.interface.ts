export interface ReqUpdateDocument {
    name: string;
    priority: string;
    documentType: string;
    detail: string;
    governmentDocNo: string;
    agencyIdRecipient?: string;
    isApprove: boolean;
    isStatusSendOut: boolean;
}

// ────────────────────────────────────────────────────────────────────────────────

export interface ResUpdateDocument {
    resCode: string;
    resData: ResUpdateDocumentData;
    msg: string;
}

export interface ResUpdateDocumentData {
    id: string;
    name: string;
    priority: string;
    documentType: string;
    barcode: string;
    userId: string;
    agencyId: string;
    governmentDocNo: string;
}
