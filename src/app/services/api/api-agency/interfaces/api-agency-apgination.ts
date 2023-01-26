export interface ReqPaginationAgency {
    perPages: number;
    page: number;
    search: string;
}

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
    datas: ResPaginationAgencyDataDatas[];
}

export interface ResPaginationAgencyDataDatas {
    id: string;
    abbreviationName: string;
    agencyName: string;
    agencyCode: string;
    createdAt: string;
    updatedAt: string;
}
