export interface ReqCreateDocumentSender {
    agencyIdSender: string;
    agencySecondarySender: string;
}

export interface ReqCreateDocumentRecipients {
    agencyIdRecipient: string;
    agencySecondaryIdRecipient: string;
}
export interface ReqCreateDocument {
    name: string;
    priority: string;
    documentType: string;
    detail: string;
    governmentDocNo: string;
    sender: ReqCreateDocumentSender;
    isApprove: boolean;
    isStatusSendOut: boolean;
    formDoc: string;
    toDoc: string;
    recipients: ReqCreateDocumentRecipients[];
}
// ─────────────────────────────────────────────────────────────────────────────

// response
export interface ResCreateDocument {
    resCode: string;
    resData: ResCreateDocumentData;
    msg: string;
}

export interface ResCreateDocumentData {
    id: string;
    name: string;
    priority: string;
    documentType: string;
    barcode: string;
    userId: string;
    agencyId: string;
}
