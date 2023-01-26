export interface ReqUsersRegister {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    role: string;
    agencyId: string;
}

export interface ResUsersRegister {
    resCode: string;
    resData: ResUsersRegisterData;
    msg: string;
}

export interface ResUsersRegisterData {
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    role: ResUsersRegisterDataRole;
    status: boolean;
    gender: ResUsersRegisterDataGender;
    phoneNumber: string;
    agencyLists: ResUsersRegisterDataAgencyList[];
}

export interface ResUsersRegisterDataRole {}

export interface ResUsersRegisterDataGender {}

export interface ResUsersRegisterDataAgencyList {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
    createdAt: string;
    updatedAt: string;
}
