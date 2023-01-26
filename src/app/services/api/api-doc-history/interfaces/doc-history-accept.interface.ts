export interface ReqDocAccept {
    userId: string;
    status: string;
    comment: string;
    agencyIdSender: string;
    agencyIdRecipient: string;
    documentId: string;
}

export interface ResDocUpdate {
    resCode: string;
    msg: string;
    resData: any[];
}
