export interface ResApiGetAgency {
    resCode: string;
    msg: string;
    resData: ResApiGetAgencyResData;
}
export interface ResApiGetAgencyResData {
    id: string;
    abbreviationName: string;
    agencyName: string;
    agencyCode: string;
    createdAt: string;
    updatedAt: string;
    agencySecondaryLists: ResApiGetAgencyResDataAgencySecondaryList[];
}

export interface ResApiGetAgencyResDataAgencySecondaryList {
    abbreviationName: string;
    agencyCode: string;
    id: string;
    agencyId: string;
    agencyName: string;
    createdAt: string;
    updatedAt: string;
}
