export interface PaginationSearchDocumentDTO {
    perPages: number;
    page: number;
    search: string;
    startAt: string;
    endAt: string;
}
export interface PaginationSearchDocumentResDTO {
    resCode: string;
    msg: string;
    resData: PaginationSearchDocumentResDTOData;
}

export interface PaginationSearchDocumentResDTOData {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    datas: PaginationSearchDocumentResDTODatas[];
}

export interface PaginationSearchDocumentResDTODatas {
    name: string;
    detail: string;
    documentType: string;
    createdAt: string;
    governmentDocNo: string;
    user: PaginationSearchDocumentResDTODatasUser;
}

export interface PaginationSearchDocumentResDTODatasUser {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
