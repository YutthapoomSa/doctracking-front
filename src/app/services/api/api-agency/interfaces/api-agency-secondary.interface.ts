export interface GetAllAgencySecondary {
    resCode: string;
    msg: string;
    resData: GetAllAgencySecondaryData[];
}

export interface GetAllAgencySecondaryData {
    id: string;
    abbreviationName: string;
    agencyName: string;
    agencyId: string;
    agencyCode: string;
    createdAt: string;
    updatedAt: string;
}
