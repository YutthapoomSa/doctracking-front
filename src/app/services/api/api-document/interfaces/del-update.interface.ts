export interface ReqDeleteFileDocument {
    documentId: string;
    fileId: string;
}

// ────────────────────────────────────────────────────────────────────────────────

// response
export interface ResDeleteFileDocument {
    resCode: string;
    resData: ResDeleteFileDocumentData;
    msg: string;
}

export interface ResDeleteFileDocumentData {}
