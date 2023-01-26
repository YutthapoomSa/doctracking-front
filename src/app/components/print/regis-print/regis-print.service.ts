import {Injectable} from '@angular/core';
import {PaginationDocumentData} from '@services/api/api-document/interfaces/doc-pagination.interface';

@Injectable({
    providedIn: 'root'
})
export class RegisPrintService {
    private data: PaginationDocumentData[] = [];

    setData(_data: PaginationDocumentData[]) {
        this.data = _data;
    }

    getData() {
        return this.data;
    }

    clearData() {
        this.data = [];
    }
}
