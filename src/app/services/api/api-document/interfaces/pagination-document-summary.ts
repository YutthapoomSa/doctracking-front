export interface ReqPaginationDocumentSummary {
    perPages: number;
    page: number;
    search: string;
    agencyId: string;
    startAt: string;
    endAt: string;
    status: string[];
}

export interface ResPaginationDocumentSummary {
    resCode: string;
    resData: ResPaginationDocumentSummaryData;
    msg: string;
}

export interface ResPaginationDocumentSummaryData {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    datas: ResPaginationDocumentSummaryDataData[];
}

export interface ResPaginationDocumentSummaryDataData {
    id: string;
    name: string;
    priority: string;
    documentType: string;
    barcode: string;
    agencyId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}
