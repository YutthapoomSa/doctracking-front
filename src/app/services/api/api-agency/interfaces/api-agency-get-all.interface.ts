export interface ResGetAllAgency {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
    agencySecondaryLists: AgencySecondaryList[];
    isSelect?: boolean;
    isSelectAll?: boolean;
}
export interface AgencySecondaryList {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
    agencyId: string;
    isSelect?: boolean;
}
