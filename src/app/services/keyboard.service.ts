import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {
    private _keys = new Subject<string>();

    getKeys(): Observable<string> {
        return this._keys.asObservable();
    }

    sendKey(key: string) {
        if (!key) return;
        this._keys.next(key);
    }
}
