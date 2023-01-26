export interface ReqPaginationDocumentHistory {
    perPages: number;
    page: number;
    search: string;
    agencyId: string;
    startAt: string;
    endAt: string;
    status: string[];
    isAgencyCheckLast: boolean;
    isCheckAgencyIdSender: boolean;
    isCheckAgencyIdRecipient: boolean;
    isCheckApprove: boolean;
    isReceiveDocument: boolean;
}

export interface ResPaginationDocumentHistory {
    resCode: string;
    resData: ResPaginationDocumentHistoryData;
    msg: string;
}

export interface ResPaginationDocumentHistoryData {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    datas: ResPaginationDocumentHistoryDataData[];
}

export interface ResPaginationDocumentHistoryDataData {
    id: string;
    name: string;
    priority: string;
    documentType: string;
    detail: string;
    governmentDocNo: string;
    barcode: string;
    agencyId: string;
    userId: string;
    status: string;
    createdAt: string;
    totalRouting: number;
    currentRouting: number;
    updatedAt: string;
    agency: Agency;
    user: User;
    calFromNow?: string;
    agencyRecipientName?: string;
    agencySenderName?: string;
    checked?: boolean;
    documentRoutingLists: [DocumentRoutingList];
}
export interface DocumentRoutingList {
    id: string;
    agencyIdRecipient: string;
    agencyIdSender: string;
    agencySecondaryIdRecipient: string;
    agencySecondaryIdSender: string;
    createdAt: string;
    updatedAt: string;
    documentId: string;
    isSuccess: boolean;
    status: string;
}
export interface Agency {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    phoneNumberSecure?: string;
}
