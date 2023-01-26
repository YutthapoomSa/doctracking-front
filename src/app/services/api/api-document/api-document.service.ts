import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {ReqDeleteFileDocument, ResDeleteFileDocument} from './interfaces/del-update.interface';
import {ReqPaginationArchiveDocument, ResPaginationArchiveDocument} from './interfaces/doc-archive.interface';
import {ReqCreateDocument, ResCreateDocument} from './interfaces/doc-create.interface';
import {ReqDocumentForwardOrReturn} from './interfaces/doc-forwardOrReturn-interface';
import {ReqPaginationDocument, ResPaginationDocument} from './interfaces/doc-pagination.interface';
import {ReqUpdateDocument, ResUpdateDocument} from './interfaces/doc-update.interface';
import {ResDocumentFindOne} from './interfaces/document-findone.interface';
import {ReqDocumentSummary, ResDocumentSummary} from './interfaces/document-summary';
import {ResFindOneDocumentArray} from './interfaces/find-one-document-array.interface';
import {ReqPaginationDocumentHistory, ResPaginationDocumentHistory} from './interfaces/pagination-document-history.interface';
import {ReqPaginationDocumentSummary, ResPaginationDocumentSummary} from './interfaces/pagination-document-summary';
import {PaginationSearchDocumentDTO, PaginationSearchDocumentResDTO} from './interfaces/pagination-search-document.dto';

@Injectable({
    providedIn: 'root'
})
export class ApiDocumentService {
    constructor(private http: HttpClient) {}

    documentCreate(body: ReqCreateDocument): Observable<ResCreateDocument> {
        return this.http.post<ResCreateDocument>(`${environment.Url}/document/create`, body);
    }

    documentUpdate(body: ReqUpdateDocument, id: string): Observable<ResUpdateDocument> {
        return this.http.patch<ResUpdateDocument>(`${environment.Url}/document/update/${id}`, body);
    }

    documentDelete(id: string): Observable<any> {
        return this.http.delete<any>(`${environment.Url}/document/delete/${id}`);
    }

    documentPagination(
        body: ReqPaginationDocument,
        agencyRecipientId: string,
        agencySecondaryRecipientId: string,
        agencySenderId: string,
        agencySecondarySenderId: string
    ): Observable<ResPaginationDocument> {
        let _query = '';

        const isQuery = () => {
            if (_query) {
                _query += '&';
            }
        };

        // agencyRecipientId=${agencyRecipientId}
        if (agencyRecipientId) {
            isQuery();
            _query += `agencyRecipientId=${agencyRecipientId}`;
        }

        // &agencySecondaryRecipientId=${agencySecondaryRecipientId}
        if (agencySecondaryRecipientId) {
            isQuery();
            _query += `agencySecondaryRecipientId=${agencySecondaryRecipientId}`;
        }

        // &agencySenderId=${agencySenderId}
        if (agencySecondaryRecipientId) {
            isQuery();
            _query += `agencySenderId=${agencySenderId}`;
        }

        // &agencySecondarySenderId=${agencySecondarySenderId}
        if (agencySecondaryRecipientId) {
            isQuery();
            _query += `agencySecondarySenderId=${agencySecondarySenderId}`;
        }

        if (!_query) {
            _query = '?' + _query;
        }

        return this.http.post<ResPaginationDocument>(
            // `${environment.Url}/document/paginationDocument?agencyRecipientId=${agencyRecipientId}&agencySecondaryRecipientId=${agencySecondaryRecipientId}&agencySenderId=${agencySenderId}&agencySecondarySenderId=${agencySecondarySenderId}`,
            `${environment.Url}/document/paginationDocument${agencySecondaryRecipientId}`,
            body
        );
    }

    documentSummary(body: ReqDocumentSummary): Observable<ResDocumentSummary> {
        return this.http.post<ResDocumentSummary>(`${environment.Url}/document/summary`, body);
    }

    documentForWardOrReturn(body: ReqDocumentForwardOrReturn[]): Observable<any> {
        return this.http.post<any>(`${environment.Url}/document/forwardOrReturnDocument`, body);
    }

    paginationDocumentSummary(body: ReqPaginationDocumentSummary): Observable<ResPaginationDocumentSummary> {
        return this.http.post<ResPaginationDocumentSummary>(`${environment.Url}/document/paginationDocumentSummary`, body);
    }

    // find one
    documentFindOne(id: string) {
        return this.http.post<ResDocumentFindOne>(`${environment.Url}/document/findOneDocument/${id}`, {});
    }

    uploadsFile(documentId: string, formData: FormData) {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'multipart/form-data');
        return this.http.post<ResDocumentFindOne>(`${environment.Url}/doc-file/uploads-images/${documentId}`, formData, {headers});
    }

    paginationDocumentHistory(body: ReqPaginationDocumentHistory): Observable<ResPaginationDocumentHistory> {
        return this.http.post<ResPaginationDocumentHistory>(`${environment.Url}/document/paginationDocumentHistory`, body);
    }
    delFile(body: ReqDeleteFileDocument[]) {
        return this.http.post<ResDeleteFileDocument>(`${environment.Url}/doc-file/delFile`, body);
    }

    findOneDocumentArray(ids: string[]): Observable<ResFindOneDocumentArray> {
        return this.http.get<ResFindOneDocumentArray>(`${environment.Url}/document/findOneDocumentArray/${ids}`);
    }

    findOneDocumentByStatus(id: string, status: string) {
        return this.http.post<ResDocumentFindOne>(`${environment.Url}/document/findOneDocumentByStatus/${id}/${status}`, {});
    }

    paginationSearchDocument(body: PaginationSearchDocumentDTO, agencyId: string, agencySecondaryId: string) {
        return this.http.post<PaginationSearchDocumentResDTO>(
            `${environment.Url}/document/paginationSearchDocument?agency=${agencyId}&agencySecondary=${agencySecondaryId}`,
            body
        );
    }

    paginationArchiveDocument(body: ReqPaginationArchiveDocument): Observable<ResPaginationArchiveDocument> {
        return this.http.post<ResPaginationArchiveDocument>(`${environment.Url}/document/archiveDocument`, body);
    }
}
