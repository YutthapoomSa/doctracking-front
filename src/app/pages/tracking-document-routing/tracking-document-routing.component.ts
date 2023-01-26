import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiAgencyService} from '@services/api/api-agency/api-agency.service';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ResDocumentFindOne, ResDocumentFineOneRoutingList} from '@services/api/api-document/interfaces/document-findone.interface';
import {AppService} from '@services/app.service';
import {SwalServiceService} from '@services/swal-service.service';
import moment from 'moment';
import {ResDocumentFindOneDocHistoryList} from './../../services/api/api-document/interfaces/document-findone.interface';
import {
    ResPaginationDocumentHistory,
    ResPaginationDocumentHistoryData
} from './../../services/api/api-document/interfaces/pagination-document-history.interface';
import {
    PaginationSearchDocumentDTO,
    PaginationSearchDocumentResDTO,
    PaginationSearchDocumentResDTODatas
} from './../../services/api/api-document/interfaces/pagination-search-document.dto';

@Component({
    selector: 'app-tracking-document-routing',
    templateUrl: './tracking-document-routing.component.html',
    styleUrls: ['./tracking-document-routing.component.scss']
})
export class TrackingDocumentRoutingComponent implements OnInit, OnDestroy {
    public textSearch = '';
    public docHistory = [];
    public myForm: FormGroup;
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    placement = 'bottom';
    public agencySelected = '';
    public allAgency;
    public allSecondaryAgency;
    public agencySecondarySelected = '';
    public dataWaitForSend: PaginationSearchDocumentResDTODatas[] = [];
    public historyDetail: ResDocumentFindOneDocHistoryList[] = [];
    public resFindOneDocumentHistory: ResDocumentFindOne;
    public resFindOneDocumentHistoryForTimeLine: ResDocumentFineOneRoutingList[];
    public reqPaginationSearchDocument: PaginationSearchDocumentDTO = {
        perPages: 10000,
        page: 1,
        search: '',
        startAt: '',
        endAt: ''
    };
    public resPaginationSearchDocument: PaginationSearchDocumentResDTO;
    public resPaginationSearchDocumentData: PaginationSearchDocumentResDTODatas[] = [];
    public resPaginationDocumentHistory: ResPaginationDocumentHistory = {
        resCode: '',
        resData: {
            totalItems: null,
            itemsPerPage: null,
            totalPages: null,
            currentPage: null,
            datas: []
        },
        msg: ''
    };
    public resPaginationDocumentHistoryData: ResPaginationDocumentHistoryData = {
        totalItems: 0,
        itemsPerPage: 0,
        totalPages: 0,
        currentPage: 0,
        datas: []
    };

    constructor(
        private swalServiceService: SwalServiceService,
        private apiDoc: ApiDocumentService,
        private appService: AppService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private apiAgencyService: ApiAgencyService
    ) {
        this.initForm();
    }
    initForm() {
        this.myForm = this.fb.group({
            startAt: new FormControl('', Validators.required),
            endAt: new FormControl('', Validators.required),
            agencySelected: new FormControl('', Validators.required),
            agencySecondarySelected: new FormControl('', Validators.required)
        });
    }
    ngOnInit() {
        this.dateStart = {
            day: Number(moment().startOf('month').format('DD')),
            month: Number(moment().startOf('month').format('MM')),
            year: Number(moment().startOf('month').format('YYYY'))
        };
        this.dateEnd = {
            day: Number(moment().endOf('month').format('DD')),
            month: Number(moment().endOf('month').format('MM')),
            year: Number(moment().endOf('month').format('YYYY'))
        };

        this.apiAgencyService.agencyGetAll().subscribe(
            (res) => {
                this.allAgency = res;
                console.log('call api get all agency');
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    ngOnDestroy() {
        this.appService.isReceivePages = false;
        this.textSearch = '';
    }
    async openHistory(content, governmentDocNo: string) {
        this.modalService.dismissAll();
        this.modalService.open(content, {size: 'xl'});

        // this.docHistory.find((x) => {
        //     x.documentRoutingLists.find((x2) => {
        //         if (x.governmentDocNo === governmentDocNo) {
        //             this.historyDetail = x2.docHistoryLists;
        //         }
        //     });
        // });

        // console.log('historyDetail -> ', this.historyDetail);
        this.apiDoc.documentFindOne(governmentDocNo).subscribe(
            (res) => {
                this.docHistory.find((x) => {
                    x.documentRoutingLists.find((x2) => {
                        if (x.governmentDocNo === governmentDocNo) {
                            this.historyDetail = x2.docHistoryLists;
                        }
                    });
                });
                this.resFindOneDocumentHistory = res;
                this.resFindOneDocumentHistoryForTimeLine = res.resData.documentRoutingLists;
                // this.historyDetail = this.resFindOneDocumentHistory.resData.docHistoryLists;
                console.log('resFindOneDocumentHistory -> ', this.resFindOneDocumentHistory);
            },
            (error) => {
                console.log('error -> ', error);
            }
        );

        // this.modalService.open(content, {centered: true, size: 'lg'});
    }
    textSearchChange(evt) {
        this.dataWaitForSend = [];
        // if (evt.key === 'Enter') {
        //     const id = this.textSearch;

        //     this.textAutoSearch(id);
        //     // this.textSearch = '';
        //     console.log('enter search');

        //     // console.log('this.docHistory->', this.docHistory);
        // }
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');
        // this.reqPaginationSearchDocument.startAt = dateStartMoment;
        // this.reqPaginationSearchDocument.endAt = dateEndMoment;
        this.dataWaitForSend = [];
        this.reqPaginationSearchDocument = {
            perPages: 10000,
            page: 1,
            search: this.textSearch,
            startAt: dateStartMoment,
            endAt: dateEndMoment
        };
        console.log('reqPaginationSearchDocument -> ', this.reqPaginationSearchDocument);

        this.apiDoc.paginationSearchDocument(this.reqPaginationSearchDocument, '', '').subscribe(
            (res) => {
                this.resPaginationSearchDocument = res;
                console.log('resPaginationSearchDocumentData -> ', this.resPaginationSearchDocument.resData);

                for (const item of this.resPaginationSearchDocument.resData.datas) {
                    this.dataWaitForSend.push(item);
                }
            },
            (err) => {
                console.log('err -> ', err);
            }
        );
    }
    search() {
        this.appService.trackingCodes.push('x');
    }
    searchPagination() {
        this.dataWaitForSend = [];
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;

        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');
        console.log('dateStartMoment -> ', dateStartMoment);
        console.log('dateEndMoment -> ', dateEndMoment);
        this.reqPaginationSearchDocument.startAt = dateStartMoment;
        this.reqPaginationSearchDocument.endAt = dateEndMoment;
        this.reqPaginationSearchDocument.search = this.textSearch;
        const agencyId = this.agencySelected ? this.agencySelected : '';
        const agencySecondaryId = this.agencySecondarySelected ? this.agencySecondarySelected : '';
        console.log('this.reqPaginationSearchDocument -> ', this.reqPaginationSearchDocument);

        this.apiDoc.paginationSearchDocument(this.reqPaginationSearchDocument, agencyId, agencySecondaryId).subscribe(
            (res) => {
                this.resPaginationSearchDocument = res;
                console.log('resPaginationSearchDocumentData -> ', this.resPaginationSearchDocument.resData);

                for (const item of this.resPaginationSearchDocument.resData.datas) {
                    this.dataWaitForSend.push(item);
                }
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    findAllSecondaryAgency(agencyId: string) {
        console.log('agencyId -> ', agencyId);
        console.log('agencySelected -> ', this.agencySelected);

        this.apiAgencyService.getAllAgencySecondary(agencyId).subscribe(
            (res) => {
                this.allSecondaryAgency = res.resData;
                console.log('allSecondaryAgency -> ', this.allSecondaryAgency);
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    // textAutoSearch(id: string) {
    //     if (this.docHistory.some((x) => x.barcode === id)) {
    //         console.log('this.textsearch -> ', this.textSearch);

    //         this.textSearch = '';

    //         this.swalServiceService.alert(false, 'เอกสารถูกสเเกนเเล้ว');
    //         return;
    //     }
    //     if (this.docHistory.some((x) => x.governmentDocNo === id)) {
    //         console.log('this.governmentDocNo -> ', this.textSearch);

    //         this.textSearch = '';

    //         this.swalServiceService.alert(false, 'เอกสารถูกสเเกนเเล้ว');
    //         return;
    //     }

    //     this.apiDoc
    //         .documentFindOne(id)
    //         .toPromise()
    //         .then((res) => {
    //             if (res.resCode === '0000') {
    //                 this.docHistory.push(res.resData);
    //                 Object.assign(this.docHistory, {
    //                     agencySecondaryIdSender: '',
    //                     agencySecondaryIdRecipient: '',
    //                     formDoc: '',
    //                     toDoc: ''
    //                 });
    //                 this.dataWaitForSend.push(res.resData);
    //                 console.log('docHistory->', this.docHistory);
    //                 console.log('dataWaitForSend->', this.dataWaitForSend);
    //                 // Object.assign(this.dataWaitForSend, {
    //                 //     agencySecondaryIdSender: '',
    //                 //     agencySecondaryIdRecipient: '',
    //                 //     formDoc: '',
    //                 //     toDoc: ''
    //                 // });
    //                 for (const item of this.resPaginationDocumentHistoryData.datas) {
    //                     if (item.id === res.resData.id) {
    //                         item.checked = true;
    //                     }
    //                 }

    //                 this.textSearch = '';
    //                 return;
    //             } else if (res.resCode === '1000') {
    //                 this.swalServiceService.alert(false, 'เอกสารไม่มีอยู่ในระบบ');
    //                 this.textSearch = '';
    //                 return;
    //             }
    //             // this.swalServiceService.alert(false);
    //         })
    //         .catch((err) => {
    //             console.error('err->', err);
    //         });

    //     // console.log('docHistory -> ', this.docHistory);
    // }
}
