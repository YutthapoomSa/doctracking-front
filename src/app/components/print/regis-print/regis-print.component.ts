import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {PaginationDocumentData} from './../../../services/api/api-document/interfaces/doc-pagination.interface';
import {ResFindOneDocumentArray} from './../../../services/api/api-document/interfaces/find-one-document-array.interface';
import {RegisPrintService} from './regis-print.service';

@Component({
    selector: 'app-regis-print',
    templateUrl: './regis-print.component.html',
    styleUrls: ['./regis-print.component.scss']
})
export class RegisPrintComponent implements OnInit, OnDestroy {
    public data: PaginationDocumentData[] = [];

    public resFindOneDocumentArray: ResFindOneDocumentArray = {
        resCode: '',
        resData: [],
        msg: ''
    };
    private ids;
    constructor(private regisPrintService: RegisPrintService, private apiDocumentService: ApiDocumentService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.data = this.regisPrintService.getData();
        this.route.queryParams.subscribe((params) => {
            this.ids = params.ids;
        });
        this.apiDocumentService.findOneDocumentArray(this.ids).subscribe(
            (res) => {
                this.resFindOneDocumentArray = res;
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }

    ngOnDestroy(): void {
        this.regisPrintService.clearData();
    }
}
