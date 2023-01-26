export interface ResRole {
    name: string;
    data: string;
}
export interface ResAllAgency {
    id: string;
    agencyName: string;
}

// agency s3econdary
export interface ResResAllAgencySecondary {
    resCode: string;
    resData: ResAllAgencySecondaryData;
    msg: string;
}

export interface ResAllAgencySecondaryData {
    id: string;
    agencyCode: string;
    abbreviationName: string;
    agencyName: string;
    agencyId: string;
}
