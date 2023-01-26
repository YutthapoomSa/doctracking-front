export interface reqAgency {
    agencyCode: string;
    agencyName: string;
    abbreviationName: string;
}

export interface resAgency {
    resCode: string;
    resData: ResData;
    msg: string;
}
export interface ResData {
    id: string;
    abbreviationName: string;
    agencyCode: string;
    agencyName: string;
    updatedAt: string;
    createdAt: string;
}
