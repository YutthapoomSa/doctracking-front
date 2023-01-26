export interface ResDocumentFindOne {
    resCode: string;
    msg: string;
    resData: ResDocumentFindOneResData;
}

export interface ResDocumentFindOneResData {
    id: string;
    status: string;
    name: string;
    detail: string;
    governmentDocNo: string;
    priority: string;
    barcode: string;
    documentType: string;
    createdAt: string;
    agencyId: string;
    userId: string;
    updatedAt: string;
    documentApproveLists: DocumentApproveList[];
    // docHistoryLists: ResDocumentFindOneDocHistoryList[];
    documentRoutingLists: ResDocumentFineOneRoutingList[];
    docFileLists: ResDocumentFindOneDocFileList[];
    user: ResDocumentFindOneUser;
    toDoc: string;
    formDoc: string;
}
export interface ResDocumentFineOneRoutingList {
    id: string;
    documentId: string;
    agencyIdSender: string;
    agencyIdRecipient: string;
    agencySecondaryIdSender: any;
    agencySecondaryIdRecipient: any;
    isCollapse?: boolean;
    createdAt: string;
    updatedAt: string;
    docHistoryLists: ResDocumentFindOneDocHistoryList[];
    agencyRecipientName: string;
    agencySecondaryRecipientName: string;
    agencySenderName: string;
    agencySecondarySenderName: string;
}
export interface DocumentApproveList {
    id: string;
    status: string;
    agency: ResDocumentFindOneAgency;
    user: ResDocumentFindOneUser;
}
export interface ResDocumentFindOneDocHistoryList {
    id: string;
    status: string;
    comment: string;
    documentRoutingId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    agencySender: ResDocumentFindOneAgency;
    agencyRecipient: ResDocumentFindOneAgency;
    user: ResDocumentFindOneUser;
    abbreviationName: string;
}

export interface ResDocumentFindOneAgency {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
}

export interface ResDocumentFindOneUser {
    id: string;
    firstName: string;
    lastName: string;
}

export interface ResDocumentFindOneDocFileList {
    id: string;
    fileName: string;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    fileSize: number;
    fileFullPath: string;
}
