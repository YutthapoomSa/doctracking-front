export interface reqLogin {
    username: string;
    password: string;
}

export interface resLogin {
    resCode: string;
    resData: FindAllLoginData;
    msg: string;
}

export interface FindAllLoginData {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    status: boolean;
    image: any;
    gender: string;
    phoneNumber: string;
    accessToken: string;
    refreshToken: string;
    expire: string;
    agency: FindAllLoginDataAgency[];
    agencySecondary: FindAllLoginDataAgencySecondary[];
}

export interface FindAllLoginDataAgency {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
}

export interface FindAllLoginDataAgencySecondary {
    id: string;
    agencyCode: string;
    agencyName: string;
    agencyId: string;
    abbreviationName: string;
}
