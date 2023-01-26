export interface ReqSummaryDocument {
    agencyId: string;
    startAt: string;
    endAt: string;
}
// response
export interface ResSummaryDocument {
    resCode: string;
    resData: ResSummaryDocumentData;
    msg: string;
}

export interface ResSummaryDocumentData {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    datas: SummaryDocumentData[];
}

export interface SummaryDocumentData {
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
