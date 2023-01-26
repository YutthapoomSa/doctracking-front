// request
export interface ReqPaginationAgency {
    perPages: number;
    page: number;
    search: string;
}

// response
export interface ResPaginationAgency {
    resCode: string;
    msg: string;
    resData: ResPaginationAgencyData;
}

export interface ResPaginationAgencyData {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    datas: PaginationAgencyData[];
}

export interface PaginationAgencyData {
    id: string;
    abbreviationName: string;
    agencyName: string;
    agencyCode: string;
    createdAt: string;
    updatedAt: string;
    agencySecondaryLists?: PaginationAgencySecondaryList[];
}

export interface PaginationAgencySecondaryList {
    abbreviationName: string;
    id: string;
    agencyCode: string;
    agencyName: string;
    agencyId: string;
}
