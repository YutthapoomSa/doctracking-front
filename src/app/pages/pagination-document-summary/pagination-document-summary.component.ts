import {Component, Input, OnInit} from '@angular/core';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ReqPaginationDocumentSummary, ResPaginationDocumentSummaryData} from '@services/api/api-document/interfaces/pagination-document-summary';
import {SwalServiceService} from '@services/swal-service.service';
import {debounce} from 'typescript-debounce-decorator';

@Component({
    selector: 'app-pagination-document-summary',
    templateUrl: './pagination-document-summary.component.html',
    styleUrls: ['./pagination-document-summary.component.scss']
})
export class PaginationDocumentSummaryComponent implements OnInit {
    @Input() agencyId: string;
    @Input() startAt: string;
    @Input() endAt: string;
    @Input() status: string[];

    public haveUserPagingDatas = false;
    public reqPaginationDocumentSummary: ReqPaginationDocumentSummary = {
        perPages: 10,
        page: 1,
        search: '',
        agencyId: '',
        startAt: '',
        endAt: '',
        status: []
    };
    public resPaginationDocumentSummary: ResPaginationDocumentSummaryData = {
        totalItems: 0,
        itemsPerPage: 0,
        totalPages: 0,
        currentPage: 0,
        datas: []
    };

    constructor(private apiDocument: ApiDocumentService, private swalService: SwalServiceService) {}

    ngOnInit(): void {
        this.reqPaginationDocumentSummary = {
            perPages: 10,
            page: 1,
            search: '',
            agencyId: this.agencyId,
            startAt: this.startAt,
            endAt: this.endAt,
            status: this.status
        };
        this.paginationDocumentSummary();
    }

    @debounce(200)
    paginationDocumentSummary() {
        this.apiDocument.paginationDocumentSummary(this.reqPaginationDocumentSummary).subscribe(
            (resp) => {
                if (resp.resCode === '0000') {
                    this.resPaginationDocumentSummary = resp.resData;
                    if (resp.resData.datas.length > 0) {
                        this.haveUserPagingDatas = true;
                    } else {
                        this.haveUserPagingDatas = false;
                    }
                } else {
                    this.haveUserPagingDatas = false;
                    this.swalService.alert(false, resp.msg);
                }
            },
            (err) => {
                this.haveUserPagingDatas = false;
                this.swalService.alert(false);
                console.error('paginationDocumentSummary -> ', err);
            }
        );
    }
}
