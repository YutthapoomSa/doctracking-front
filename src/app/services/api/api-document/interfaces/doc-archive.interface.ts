// req
export interface ReqPaginationArchiveDocument {
    perPages: number;
    page: number;
    search: string;
}

// res
export interface ResPaginationArchiveDocument {
    resCode: string;
    resData: ResPaginationArchiveDocumentData;
    msg: string;
}

export interface ResPaginationArchiveDocumentData {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    datas: PaginationArchiveDocumentData[];
}

export interface PaginationArchiveDocumentData {
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
    updatedAt: string;
    agency: Agency;
    user: User;
    agencySenderName: string;
    agencyRecipientName: string;
    docNo: string;
    formDoc: string;
    toDoc: string;
    documentRoutingLists: string[];
    currentRouting: number;
    totalRouting: number;
    isDocumentDone: boolean;
}

export interface Agency {}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
}
