export interface ReqUpdateAgency {
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
    agencySecondaryLists: ReqUpdateAgencySecondaryList[];
}
export interface ResUpdateAgency {
    resCode: string;
    resData: ResUpdateAgencyData;
    msg: string;
}

export interface ResUpdateAgencyData {
    agencyCode: string;
    abbreviationName: string;
    agencyName: string;
}

export interface ReqUpdateAgencySecondaryList {
    abbreviationName: string;
    agencyCode: string;
    id: string;
    agencyName: string;
}
