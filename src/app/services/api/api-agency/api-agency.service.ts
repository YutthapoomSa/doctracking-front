import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {reqAgency, resAgency} from './interfaces/api-agency';
import {ResGetAllAgency} from './interfaces/api-agency-get-all.interface';
import {GetAllAgencySecondary} from './interfaces/api-agency-secondary.interface';
import {ReqUpdateAgency, ResUpdateAgency} from './interfaces/api-agency-update.interface';
import {ReqCreateAgencySecondary, ResCreateAgencySecondary} from './interfaces/api-create-agency-secondary.interface';
import {ResApiGetAgency} from './interfaces/api-get-agency.interface';
import {ReqPaginationAgency, ResPaginationAgency} from './interfaces/api-pagination';

@Injectable({
    providedIn: 'root'
})
export class ApiAgencyService {
    constructor(private http: HttpClient) {}
    agency(body: reqAgency): Observable<resAgency> {
        return this.http.post<resAgency>(`${environment.Url}/agency`, body);
    }

    agencyRegister(body: reqAgency): Observable<resAgency> {
        // let headers = new HttpHeaders();
        // headers = headers.append('Content-Type', 'multipart/form-data');
        return this.http.post<resAgency>(`${environment.Url}/agency/create`, body);
    }

    agencyPagination(body: ReqPaginationAgency): Observable<ResPaginationAgency> {
        return this.http.post<ResPaginationAgency>(`${environment.Url}/agency/paginationAgency`, body);
    }

    agencyUpdate(body: ReqUpdateAgency, agencyId: string): Observable<ResUpdateAgency> {
        return this.http.patch<ResUpdateAgency>(`${environment.Url}/agency/update/${agencyId}`, body);
    }

    // del
    agencyDeleteById(id: string): Observable<any> {
        return this.http.delete<any>(`${environment.Url}/agency/del/${id}`);
    }

    // get all
    agencyGetAll(): Observable<ResGetAllAgency[]> {
        return this.http.get<ResGetAllAgency[]>(`${environment.Url}/agency/getAllAgency`);
    }

    // get all agency secondary
    getAllAgencySecondary(agencyId: string): Observable<GetAllAgencySecondary> {
        return this.http.get<GetAllAgencySecondary>(`${environment.Url}/agency/getAllAgencySecondary/${agencyId}`);
    }

    // create agency secondary
    agencySecondaryRegister(body: ReqCreateAgencySecondary): Observable<ResCreateAgencySecondary> {
        return this.http.post<ResCreateAgencySecondary>(`${environment.Url}/agency/createAgencySecondary`, body);
    }

    // get agency and agency secondary
    getAgency(agencyId: string): Observable<ResApiGetAgency> {
        return this.http.get<ResApiGetAgency>(`${environment.Url}/agency/getAgency/${agencyId}`);
    }
}
