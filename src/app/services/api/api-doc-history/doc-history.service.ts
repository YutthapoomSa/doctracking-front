import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {ReqDocAccept, ResDocUpdate} from './interfaces/doc-history-accept.interface';
import {ReqUpdateHistoryDocuments} from './interfaces/update-history-document.interface';

@Injectable({
    providedIn: 'root'
})
export class DocHistoryService {
    constructor(private http: HttpClient) {}

    docHistoryAccept(body: ReqDocAccept[]): Observable<ResDocUpdate> {
        return this.http.post<ResDocUpdate>(`${environment.Url}/doc-history/updateHistoryDocuments`, body);
    }

    // update
    updateHistoryDocuments(body: ReqUpdateHistoryDocuments[]): Observable<any> {
        return this.http.post<any>(`${environment.Url}/doc-history/updateHistoryDocuments`, body);
    }
}
