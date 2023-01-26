export interface ReqPaginationDocument {
    perPages: number;
    page: number;
    search: string;
    startAt: string;
    endAt: string;
}

// response
export interface ResPaginationDocument {
    resCode: string;
    resData: ResPaginationDocumentData;
    msg: string;
}

export interface ResPaginationDocumentData {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    datas: PaginationDocumentData[];
}
export interface PaginationDocumentRoutingList {
    id: string;
    agencyIdRecipient: string;
    agencyIdSender: string;
    agencySecondaryIdRecipient?: string;
    agencySecondaryIdSender: string;
    createdAt: string;
    updatedAt: string;
    documentId: string;
}
export interface PaginationDocumentData {
    id: string;
    name: string;
    agencyId: string;
    barcode: string;
    createdAt: string;
    updatedAt: string;
    documentType: string;
    priority: string;
    detail: string;
    status: string;
    governmentDocNo: string;
    totalRouting: number;
    currentRouting: number;
    docNo: string;
    formDoc: string;
    toDoc: string;
    agency: Agency;
    user: User;
    // ──────────────────────────────────────────────────────────────
    dateUse?: string;
    checked: boolean;
    isSelect?: boolean;
    // ──────────────────────────────────────────────────────────────

    documentRoutingLists: PaginationDocumentRoutingList[];
    actionLists: string[];
}
export interface User {
    id: string;
    firstName: string;
    lastName: string;
}
export interface Agency {
    id: string;
    agencyName: string;
}
