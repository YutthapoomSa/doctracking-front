export interface ResUserById {
    resCode: string;
    resData: ResUserByIdData;
    msg: string;
}

export interface ResUserByIdData {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    role: string;
    status: boolean;
    gender: string;
    phoneNumber: string;
    image: string;
    agencyLists: ResUserByIdDataAgencyList[];
    userAgencyLists: ResUserByIdDataUserAgencyList[];
}
export interface ResUserByIdDataUserAgencyList {
    id: string;
    agencyId: string;
    userId: string;
    agency: ResUserByIdDataUserAgencyListAgency;
}

export interface ResUserByIdDataUserAgencyListAgency {
    id: string;
    agencyName: string;
}

export interface ResUserByIdDataAgencyList {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
    createdAt: string;
    updatedAt: string;
}
