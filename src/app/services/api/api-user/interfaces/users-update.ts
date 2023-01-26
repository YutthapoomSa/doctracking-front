export interface ReqUserUpdate {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    role: string;
    agencyId: string;
    agencySecondaryId: string;
}

export interface ResUserUpdate {
    resCode: string;
    resData: ResUserUpdateData;
    msg: string;
}

export interface ResUserUpdateData {
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    role: ResUserUpdateDataRole;
    status: boolean;
    gender: ResUserUpdateDataGender;
    phoneNumber: string;
    image: string;
    agencyLists: ResUserUpdateDataAgencyList[];
    userAgencyLists: string[];
}

export interface ResUserUpdateDataRole {}

export interface ResUserUpdateDataGender {}

export interface ResUserUpdateDataAgencyList {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
    createdAt: string;
    updatedAt: string;
}
