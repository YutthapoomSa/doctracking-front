export interface ReqDocumentSummary {
    agencyId: string;
    startAt: string;
    endAt: string;
}

export interface ResDocumentSummary {
    resCode: string;
    msg: string;
    resData: ResDocumentSummaryData;
}

export interface ResDocumentSummaryData {
    sumOfDateLists: ResDocumentSummaryDataSumOfDateList[];
    summaryAll: ResDocumentSummaryDataSummaryAll;
}

export interface ResDocumentSummaryDataSumOfDateList {
    date: string;
    data: ResDocumentSummaryDataSumOfDateListData;
}

export interface ResDocumentSummaryDataSumOfDateListData {
    total: number;
    success: number;
    unsuccessful: number;
    reject: number;
    create: number;
    noEvent: number;
    processing: number;
}

export interface ResDocumentSummaryDataSummaryAll {
    create: number;
    noEvent: number;
    reject: number;
    success: number;
    unsuccessful: number;
    processing: number;
    total: number;
}
