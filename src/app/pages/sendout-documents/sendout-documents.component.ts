import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppService} from '@services/app.service';
import {LocalService} from '@services/local.service';
import moment from 'moment';
import {debounce} from 'typescript-debounce-decorator';
import {ApiDocumentService} from './../../services/api/api-document/api-document.service';
import {
    ResDocumentFindOne,
    ResDocumentFindOneDocHistoryList,
    ResDocumentFineOneRoutingList
} from './../../services/api/api-document/interfaces/document-findone.interface';
import {
    ReqPaginationDocumentHistory,
    ResPaginationDocumentHistory,
    ResPaginationDocumentHistoryData
} from './../../services/api/api-document/interfaces/pagination-document-history.interface';
import {SwalServiceService} from './../../services/swal-service.service';

@Component({
    selector: 'app-sendout-documents',
    templateUrl: './sendout-documents.component.html',
    styleUrls: ['./sendout-documents.component.scss']
})
export class SendoutDocumentsComponent implements OnInit {
    public myForm: FormGroup;
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    placement = 'bottom';
    public reqPaginationDocumentHistory: ReqPaginationDocumentHistory = {
        perPages: 10,
        page: 1,
        search: '',
        agencyId: '',
        startAt: '',
        endAt: '',
        status: ['create'],
        isAgencyCheckLast: true,
        isCheckAgencyIdSender: true,
        isCheckAgencyIdRecipient: false,
        isCheckApprove: false,
        isReceiveDocument: false
    };
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
    public resPaginationDocumentHistoryData: ResPaginationDocumentHistoryData;
    public havePagingDatas = false;
    public resFindOneDocumentHistory: ResDocumentFindOne;
    public documentRoutingList: ResDocumentFineOneRoutingList[] = [];
    public historyDetail: ResDocumentFindOneDocHistoryList[] = [];
    private arrDocumentIdsChecked: string[] = [];
    public ngCheckAllItem = false;
    public currentIndexRouting = null;

    constructor(
        private fb: FormBuilder,
        private apiDocumentService: ApiDocumentService,
        private swalService: SwalServiceService,
        private localService: LocalService,
        private appService: AppService,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        this.initForm();
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
        this.getUserPagination();
    }

    isCheckStack(id: string) {
        return this.arrDocumentIdsChecked.some((x) => x === id);
    }

    @debounce(200)
    getUserPagination(force?: boolean) {
        this.ngCheckAllItem = false;

        if (force !== null && force !== undefined && force == false) {
            this.arrDocumentIdsChecked = [];
        }

        if (this.resPaginationDocumentHistoryData?.datas?.length > 0) {
            for (const iterator of this.resPaginationDocumentHistoryData.datas) {
                if (!iterator.checked) continue;
                this.arrDocumentIdsChecked.push(iterator.id);
            }
        }

        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');

        this.reqPaginationDocumentHistory.startAt = dateStartMoment;
        this.reqPaginationDocumentHistory.endAt = dateEndMoment;

        const userLocal = this.localService.getProfile();
        if (userLocal.agency.length !== 0 && userLocal.agency && userLocal) {
            this.reqPaginationDocumentHistory.agencyId = userLocal.agency[0].id;
        }

        this.reqPaginationDocumentHistory.page = Number(this.reqPaginationDocumentHistory.page);
        this.reqPaginationDocumentHistory.perPages = Number(this.reqPaginationDocumentHistory.perPages);

        this.apiDocumentService.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
            (resp) => {
                console.log('userPagination -> ', resp);

                if (resp.resCode !== '0000') {
                    this.havePagingDatas = false;
                    this.swalService.alert(false, resp.msg);
                    return;
                }

                this.resPaginationDocumentHistory = resp;
                this.resPaginationDocumentHistoryData = resp.resData;

                if (resp?.resData?.datas?.length > 0) {
                    this.havePagingDatas = true;
                    for (const item of this.resPaginationDocumentHistoryData.datas) {
                        Object.assign(item, {calFromNow: moment(item.createdAt).lang('th').fromNow(true)});
                        Object.assign(item, {checked: this.isCheckStack(item.id)});
                    }
                } else {
                    this.havePagingDatas = false;
                }
                this.isCheckAll();
            },
            (err) => {
                this.havePagingDatas = false;
                this.swalService.alert(false);
                console.error('userPagination -> ', err);
            }
        );
    }

    initForm() {
        this.myForm = this.fb.group({
            department: new FormControl('', Validators.required),
            search: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
            startAt: new FormControl('', Validators.required),
            endAt: new FormControl('', Validators.required)
        });
    }

    // searchPagination() {
    //     const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
    //     const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
    //     const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
    //     const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');

    //     this.reqPaginationDocumentHistory.startAt = dateStartMoment;
    //     this.reqPaginationDocumentHistory.endAt = dateEndMoment;

    //     const userLocal = this.localService.getProfile();
    //     if (userLocal.agency.length !== 0 && userLocal.agency && userLocal) {
    //         this.reqPaginationDocumentHistory.agencyId = userLocal.agency[0].id;
    //     }

    //     this.apiDocumentService.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
    //         async (res) => {
    //             this.resPaginationDocumentHistory = res;
    //             this.resPaginationDocumentHistoryData = this.resPaginationDocumentHistory.resData;
    //             for (const item of this.resPaginationDocumentHistoryData.datas) {
    //                 Object.assign(item, {calFromNow: moment(item.createdAt).lang('th').fromNow(true)});
    //             }
    //             for (const item of this.resPaginationDocumentHistoryData.datas) {
    //                 const phoneStringSecure = await this.appService.securePhoneNumber(item.user.phoneNumber);
    //                 Object.assign(item.user, {phoneNumberSecure: String(phoneStringSecure)});
    //                 Object.assign(item, {checked: false});
    //             }
    //         },
    //         (error) => {
    //             console.log('error -> ', error);
    //         }
    //     );
    // }

    async openHistory(content, barcode: string, index: number) {
        this.currentIndexRouting = index;
        this.modalService.dismissAll();
        this.modalService.open(content, {centered: true, size: 'xl'});
        this.apiDocumentService.documentFindOne(barcode).subscribe(
            (res) => {
                this.resFindOneDocumentHistory = res;
                this.documentRoutingList = res.resData.documentRoutingLists;
                // this.historyDetail = this.resFindOneDocumentHistory.resData.docHistoryLists;
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    close() {
        this.modalService.dismissAll();
    }
    sendOutDocument() {
        this.arrDocumentIdsChecked = [...new Set(this.arrDocumentIdsChecked)];
        //
    }

    checkAll() {
        for (const iterator of this.resPaginationDocumentHistoryData.datas) {
            iterator.checked = true;
            this.arrDocumentIdsChecked.push(iterator.id);
        }

        this.arrDocumentIdsChecked = [...new Set(this.arrDocumentIdsChecked)];
    }

    async isCheckAll(isDelay?: boolean) {
        if (isDelay !== undefined && isDelay) {
            await this.appService.delay(50);
        }
        if (this.resPaginationDocumentHistoryData?.datas.length > 0) {
            this.ngCheckAllItem = this.resPaginationDocumentHistoryData.datas.every((x) => x.checked === true);
        } else {
            this.ngCheckAllItem = false;
        }
    }

    async checkUnCheck(i: number) {
        await this.appService.delay(50);
        if (this.resPaginationDocumentHistoryData.datas[i].checked) {
            this.arrDocumentIdsChecked.push(this.resPaginationDocumentHistoryData.datas[i].id);
        } else {
            this.arrDocumentIdsChecked = this.arrDocumentIdsChecked.filter((x) => x !== this.resPaginationDocumentHistoryData.datas[i].id);
        }
        this.arrDocumentIdsChecked = [...new Set(this.arrDocumentIdsChecked)];
        this.isCheckAll(true);
    }
}
