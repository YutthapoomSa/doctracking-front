import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {ResUserById, ResUserByIdData} from './api-user/interfaces/users-by-id';
import {ResUserDelete} from './api-user/interfaces/users-delete';
import {ReqUserPagination, ResUserPagination} from './api-user/interfaces/users-pagination';
import {ReqRefreshToken, ResRefreshToken} from './api-user/interfaces/users-refresh-token';
import {ReqUsersRegister, ResUsersRegister} from './api-user/interfaces/users-register';
import {ReqUserUpdate, ResUserUpdate} from './api-user/interfaces/users-update';

@Injectable({
    providedIn: 'root'
})
export class ApiUserService {
    constructor(private http: HttpClient) {}

    deleteUser(id: string): Observable<ResUserDelete> {
        return this.http.delete<ResUserDelete>(`${environment.Url}/users/delete/${id}`);
    }

    getUserById(id: string): Observable<ResUserById> {
        return this.http.get<ResUserById>(`${environment.Url}/users/${id}`);
    }

    userPagination(body: ReqUserPagination): Observable<ResUserPagination> {
        return this.http.post<ResUserPagination>(`${environment.Url}/users/paginationUser`, body);
    }

    userRefreshToken(body: ReqRefreshToken): Observable<ResRefreshToken> {
        return this.http.post<ResRefreshToken>(`${environment.Url}/users/refreshToken`, body);
    }

    usersRegister(body: ReqUsersRegister): Observable<ResUsersRegister> {
        return this.http.post<ResUsersRegister>(`${environment.Url}/users/register`, body);
    }

    userUpdate(body: ReqUserUpdate, userId: string, agencyId: string): Observable<ResUserUpdate> {
        return this.http.patch<ResUserUpdate>(`${environment.Url}/users/update/${userId}`, body);
    }
}
