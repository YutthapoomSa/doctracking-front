import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {
    PaginationArchiveDocumentData,
    ReqPaginationArchiveDocument,
    ResPaginationArchiveDocument,
    ResPaginationArchiveDocumentData
} from '@services/api/api-document/interfaces/doc-archive.interface';
import {
    ResDocumentFindOne,
    ResDocumentFindOneDocHistoryList,
    ResDocumentFineOneRoutingList
} from '@services/api/api-document/interfaces/document-findone.interface';
import {AppService} from '@services/app.service';
import {LocalService} from '@services/local.service';
import {SwalServiceService} from '@services/swal-service.service';
import {debounce} from 'typescript-debounce-decorator';

@Component({
    selector: 'app-archive-document',
    templateUrl: './archive-document.component.html',
    styleUrls: ['./archive-document.component.scss']
})
export class ArchiveDocumentComponent implements OnInit {
    public reqPagingArchiveDocument: ReqPaginationArchiveDocument = {
        perPages: 10,
        page: 1,
        search: ''
    };
    public datArchiveDocument: ResPaginationArchiveDocumentData = {
        totalItems: 0,
        itemsPerPage: 0,
        totalPages: 0,
        currentPage: 0,
        datas: []
    };
    public resFindOneDocumentHistory: ResDocumentFindOne;
    public resFindOneDocumentHistoryForTimeLine: ResDocumentFineOneRoutingList[];
    public historyDetail: ResDocumentFindOneDocHistoryList[] = [];
    constructor(
        private appService: AppService,
        private apiDocument: ApiDocumentService,
        private modalService: NgbModal,
        private swalService: SwalServiceService,
        private localService: LocalService
    ) {}

    ngOnInit() {
        this.loadPaginationArchive();
    }

    @debounce(200)
    loadPaginationArchive(evt?: any) {
        if (evt) {
            this.reqPagingArchiveDocument.search = evt.target.value;
        }
        this.reqPagingArchiveDocument.page = Number(this.reqPagingArchiveDocument.page);
        this.reqPagingArchiveDocument.perPages = Number(this.reqPagingArchiveDocument.perPages);
        this.apiDocument.paginationArchiveDocument(this.reqPagingArchiveDocument).subscribe(
            (res) => {
                if (res.resCode === '0000') {
                    this.datArchiveDocument = res.resData;
                } else {
                    this.swalService.alert(false, res.msg);
                    console.log('res->', res);
                }
            },
            (err) => {
                console.error('err->', err);
            }
        );
    }

    async openHistory(content, barcode: string) {
        this.modalService.dismissAll();
        this.modalService.open(content, {centered: true, size: 'lg'});
        this.apiDocument.documentFindOne(barcode).subscribe(
            (res) => {
                this.resFindOneDocumentHistory = res;
                this.resFindOneDocumentHistoryForTimeLine = res.resData.documentRoutingLists;
                // this.historyDetail = this.resFindOneDocumentHistory.resData.docHistoryLists;
                console.log('resFindOneDocumentHistory -> ', this.resFindOneDocumentHistory);
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
}
