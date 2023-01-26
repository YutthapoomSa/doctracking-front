import {Injectable} from '@angular/core';
import {FindAllLoginData} from './api/api-login/interfaces/api-login';

@Injectable({
    providedIn: 'root'
})
export class LocalService {
    constructor() {}

    setProfile(userLocal: FindAllLoginData) {
        localStorage.setItem('profile', JSON.stringify(userLocal));
    }

    getProfile(): FindAllLoginData {
        const result = localStorage.getItem('profile');

        if (!result) {
            return null;
        }

        const _res: FindAllLoginData = JSON.parse(result);
        return _res;
    }

    clearProfile() {
        localStorage.removeItem('profile');
    }

    // ─────────────────────────────────────────────────────────────────

    setToken(accessToken: string) {
        localStorage.setItem('accessToken', accessToken);
    }

    getToken() {
        return localStorage.getItem('accessToken');
    }

    setRefreshToken(refreshToken: string) {
        localStorage.setItem('refreshToken', refreshToken);
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setTokenExpire(tokenExpire: string) {
        if (!tokenExpire) {
            return null;
        }
        localStorage.setItem(EnumLocalStorageKey.tokenExpire, tokenExpire);
        return this.getToken();
    }

    getTokenExpire() {
        return localStorage.getItem(EnumLocalStorageKey.tokenExpire);
    }

    clearToken() {
        localStorage.clear();
    }

    clearTokenExpire() {
        localStorage.removeItem(EnumLocalStorageKey.tokenExpire);
    }
}

export enum EnumLocalStorageKey {
    userInfo = 'userInfo',
    accessToken = 'accessToken',
    tokenExpire = 'tokenExpire'
    // accessAssignConfig = 'accessAssignConfig'
}

export interface userLocalAgency {
    id: string;
    agencyName: string;
    abbreviationName: string;
    agencyCode: string;
}
