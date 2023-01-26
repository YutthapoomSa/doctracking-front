export interface ReqUserPagination {
    perPages: number;
    page: number;
    search: string;
}

export interface ResUserPagination {
    resCode: string;
    resData: ResUserPaginationData;
    msg: string;
}

export interface ResUserPaginationData {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    datas: ResUserPaginationDataData[];
}

export interface ResUserPaginationDataData {
    id: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    status: boolean;
    image: string;
    gender: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    userAgencyLists: UserAgencyList[];
}
export interface UserAgencyList {
    id: string;
    userId: string;
    agencyId: string;
    agency: Agency;
}
export interface Agency {
    id: string;
    agencyName: string;
}
