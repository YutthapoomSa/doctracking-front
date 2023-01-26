export interface ReqCreateAgencySecondary {
    agencyCode: string;
    abbreviationName: string;
    agencyName: string;
    agencyId: string;
}
export interface ResCreateAgencySecondary {
    resCode: string;
    msg: string;
    resData: ResCreateAgencySecondaryData;
}
export interface ResCreateAgencySecondaryData {
    id: string;
    abbreviationName: string;
    agencyCode: string;
    agencyName: string;
    agencyId: string;
    updatedAt: string;
    createdAt: string;
}
