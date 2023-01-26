import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocHistoryService} from '@services/api/api-doc-history/doc-history.service';
import {ReqUpdateHistoryDocuments} from '@services/api/api-doc-history/interfaces/update-history-document.interface';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ResDocumentFindOneResData, ResDocumentFineOneRoutingList} from '@services/api/api-document/interfaces/document-findone.interface';
import {AppService} from '@services/app.service';
import {LocalService} from '@services/local.service';
import {SwalServiceService} from '@services/swal-service.service';
import dayjs from 'dayjs';
import moment from 'moment';
import {debounce} from 'typescript-debounce-decorator';
import {ApiAgencyService} from './../../services/api/api-agency/api-agency.service';
import {ResDocumentFindOne, ResDocumentFindOneDocHistoryList} from './../../services/api/api-document/interfaces/document-findone.interface';
import {
    ReqPaginationDocumentHistory,
    ResPaginationDocumentHistory,
    ResPaginationDocumentHistoryData
} from './../../services/api/api-document/interfaces/pagination-document-history.interface';
import {ResAllAgency} from './../../services/app-service';
@Component({
    selector: 'app-pending-documents',
    templateUrl: './pending-documents.component.html',
    styleUrls: ['./pending-documents.component.scss']
})
export class PendingDocumentsComponent implements OnInit {
    public arrDocumentIdsChecked: string[] = [];

    public ngCheckAllItem = false;
    public resFindOneDocumentHistory: ResDocumentFindOne;
    public resFindOneDocumentHistoryForTimeLine: ResDocumentFineOneRoutingList[];
    public historyDetail: ResDocumentFindOneDocHistoryList[] = [];
    public docHistory: ResDocumentFindOneResData[] = [];
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
        isCheckAgencyIdRecipient: true,
        isCheckApprove: true,
        isReceiveDocument: false
    };
    public textSearch = '';
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
    public myForm: FormGroup;
    public havePagingDatas = false;

    public status = ['success', 'unsuccessful', 'processing', 'receive', 'sendOut', 'reject', 'create', 'noEvent'];
    public statusSelected;
    public allAgency: ResAllAgency[] = [
        {
            agencyName: '',
            id: ''
        }
    ];
    public dataWaitForSend = [];
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    placement = 'bottom';
    constructor(
        private modalService: NgbModal,
        private apiDocumentService: ApiDocumentService,
        private apiAgencyService: ApiAgencyService,
        private fb: FormBuilder,
        private swalService: SwalServiceService,
        private appService: AppService,
        private localService: LocalService,
        private swalServiceService: SwalServiceService,
        private apiDoc: ApiDocumentService,
        private apiDocHistory: DocHistoryService
    ) {
        this.initForm();
    }
    public preData = [
        {
            id: 1,
            code: new Date().getTime(),
            title: 'ส่งเอกสารรับรองการปฏิบัติงานของผู้ประกอบการ',
            account: 'นายสมชาย สมชาย (094xxxxxxx)',
            type: 'ภายใน',
            destination: 'สธ. ',
            createdAt: dayjs().format('DD-MM-YYYY'),
            daySpend: '1 วัน',
            status: 'เอกสารยังไม่สำเร็จ'
        },
        {
            id: 2,
            code: new Date().getTime(),
            title: 'เอกสารรับรอง',
            account: 'นายสมร สายลม (093xxxxxxx)',
            type: 'ภายนอก',
            destination: 'สสส. ',
            createdAt: '27-04-2022',
            daySpend: '3 วัน',
            status: 'เอกสารยังไม่สำเร็จ'
        },
        {
            id: 3,
            code: new Date().getTime(),
            title: 'เอกสารใบสำคัญจ่าย',
            account: `นายสมศักดิ์ ปริญญา (087xxxxxxx)`,
            type: 'ภายนอก',
            destination: 'สป. ',
            createdAt: '27-04-2022',
            daySpend: '5 วัน',
            status: 'เอกสารยังไม่สำเร็จ'
        }
    ];
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
            },
            (error) => {
                console.log('error -> ', error);
            }
        );

        // this.apiDocumentService.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
        //     (res) => {
        //         console.log('pagination doc history -> ', res);
        //     },
        //     (error) => {
        //         console.log('error -> ', error);
        //     }
        // );
        this.searchPagination();
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
    @debounce(200)
    getUserPagination() {
        this.reqPaginationDocumentHistory.page = Number(this.reqPaginationDocumentHistory.page);
        this.reqPaginationDocumentHistory.perPages = Number(this.reqPaginationDocumentHistory.perPages);

        const userLocal = this.localService.getProfile();
        if (userLocal.agency.length !== 0 && userLocal.agency && userLocal) {
            this.reqPaginationDocumentHistory.agencyId = userLocal.agency[0].id;
        }
        this.apiDocumentService.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
            (resp) => {
                console.log('userPagination -> ', resp);

                if (resp.resCode === '0000') {
                    this.resPaginationDocumentHistory = resp;
                    if (resp.resData.datas.length > 0) {
                        this.havePagingDatas = true;
                    } else {
                        this.havePagingDatas = false;
                    }
                } else {
                    this.havePagingDatas = false;
                    this.swalService.alert(false, resp.msg);
                }
            },
            (err) => {
                this.havePagingDatas = false;
                this.swalService.alert(false);
                console.error('userPagination -> ', err);
            }
        );
    }
    searchPagination(evt?: any) {
        console.log('req paging -> ', this.reqPaginationDocumentHistory);
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');
        // this.reqPaginationDocumentHistory.startAt = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        // this.reqPaginationDocumentHistory.endAt = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        this.reqPaginationDocumentHistory.startAt = dateStartMoment;
        this.reqPaginationDocumentHistory.endAt = dateEndMoment;
        // this.reqPaginationDocumentHistory.status = [this.statusSelected];
        const userLocal = this.localService.getProfile();
        if (userLocal.agency.length !== 0 && userLocal.agency && userLocal) {
            this.reqPaginationDocumentHistory.agencyId = userLocal.agency[0].id;
        }
        this.apiDocumentService.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
            async (res) => {
                this.resPaginationDocumentHistory = res;
                this.resPaginationDocumentHistoryData = this.resPaginationDocumentHistory.resData;
                for (const item of this.resPaginationDocumentHistoryData.datas) {
                    Object.assign(item, {calFromNow: moment(item.createdAt).lang('th').fromNow(true)});
                    Object.assign(item.user, {phoneNumberSecure: await this.appService.securePhoneNumber(item.user.phoneNumber)});
                }
                // for (const item of this.resPaginationDocumentHistoryData.datas) {
                //     this.appService.securePhoneNumber(item.user.phoneNumber);
                // }
                if (this.dataWaitForSend.length > 0 && this.resPaginationDocumentHistoryData.datas.length > 0) {
                    for (const item of this.dataWaitForSend) {
                        for (const itemSearch of this.resPaginationDocumentHistoryData.datas) {
                            if (item.id === itemSearch.id) {
                                itemSearch.checked = true;
                            }
                        }
                    }
                }
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    close() {
        this.modalService.dismissAll();
    }
    async openHistory(content, barcode: string, index?: number) {
        // this.modalService.dismissAll();
        this.modalService.open(content, {centered: true, size: 'lg'});
        this.apiDocumentService.documentFindOne(barcode).subscribe(
            (res) => {
                this.docHistory.find((x) => {
                    x.documentRoutingLists.find((x2) => {
                        if (x.governmentDocNo === barcode) {
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
    }

    async textSearchChange(evt) {
        if (evt.key === 'Enter') {
            const id = this.textSearch;

            this.textAutoSearch(id);
            this.textSearch = '';

            // console.log('this.docHistory->', this.docHistory);
        }
    }
    async textAutoSearch(id: string) {
        if (this.docHistory.some((x) => x.barcode === id)) {
            console.log('this.textsearch -> ', this.textSearch);
            this.textSearch = '';
            this.swalServiceService.alert(false, 'เอกสารถูกสเเกนเเล้ว');
            return;
        }
        if (this.docHistory.some((x) => x.governmentDocNo === id)) {
            this.textSearch = '';
            this.swalServiceService.alert(false, 'เอกสารถูกสเเกนเเล้ว');
            return;
        }
        this.apiDoc
            .findOneDocumentByStatus(id, 'create')
            .toPromise()
            .then((res) => {
                if (res.resCode === '0000') {
                    this.docHistory.push(res.resData);
                    Object.assign(this.docHistory, {
                        agencySecondaryIdSender: '',
                        agencySecondaryIdRecipient: '',
                        formDoc: '',
                        toDoc: ''
                    });
                    this.dataWaitForSend.push(res.resData);
                    console.log('docHistory->', this.docHistory);
                    console.log('dataWaitForSend->', this.dataWaitForSend);
                    // Object.assign(this.dataWaitForSend, {
                    //     agencySecondaryIdSender: '',
                    //     agencySecondaryIdRecipient: '',
                    //     formDoc: '',
                    //     toDoc: ''
                    // });
                    for (const item of this.resPaginationDocumentHistoryData.datas) {
                        if (item.id === res.resData.id) {
                            item.checked = true;
                        }
                    }

                    this.textSearch = '';
                    return;
                } else if (res.resCode === '1000') {
                    this.swalServiceService.alert(false, 'เอกสารไม่มีอยู่ในระบบ');
                    this.textSearch = '';
                    return;
                }
            })
            .catch((err) => {
                console.error('err->', err);
            });
        console.log('dataWaitForSend -> ', this.dataWaitForSend);
    }
    search() {
        console.log('pass Search');

        this.appService.trackingCodes.push('x');
        // this.departments.push(this.test);
    }
    del(index: number) {
        this.docHistory.splice(index, 1);
        for (const [i, item1] of this.resPaginationDocumentHistoryData.datas.entries()) {
            if (this.dataWaitForSend[index].id === item1.id) {
                item1.checked = false;
            }
        }
        this.dataWaitForSend.splice(index, 1);
    }
    confirmSendOutDocument(content: any) {
        this.modalService.open(content, {size: 'xl'});
    }

    sendOutDocument() {
        // const userLocal = this.localService.getProfile();
        // let agencySenderId = '';
        // if (userLocal.agency.length && userLocal.agency && userLocal) {
        //     agencySenderId = userLocal.agency[0].id;
        // }
        let agencyReceivedId = '';
        let agencySenderIdSecondary = '';
        const userLocal = this.localService.getProfile();
        if (userLocal.agency.length && userLocal.agency && userLocal) {
            agencyReceivedId = userLocal.agency[0].id;
        }
        if (userLocal.agencySecondary.length && userLocal.agencySecondary && userLocal) {
            agencySenderIdSecondary = userLocal.agencySecondary[0].id;
            // agencyReceivedIdSecondary = userLocal.agencySecondary[0].agencyId;
        }
        let body: ReqUpdateHistoryDocuments[] = [];
        for (const iterator of this.dataWaitForSend) {
            for (const item of iterator.documentRoutingLists) {
                body.push({
                    status: 'sendOut',
                    comment: iterator.comment,
                    agencyIdSender: agencyReceivedId ? agencyReceivedId : '',
                    agencyIdRecipient: item.agencyIdRecipient ? item.agencyIdRecipient : '',
                    documentId: iterator.id,
                    agencySecondaryIdSender: agencySenderIdSecondary ? agencySenderIdSecondary : '',
                    agencySecondaryIdRecipient: item.agencySecondaryIdRecipient ? item.agencySecondaryIdRecipient : '',
                    formDoc: iterator.formDoc ? iterator.formDoc : '',
                    toDoc: iterator.toDoc ? iterator.toDoc : '',
                    documentRoutingId: item.id
                });
            }
        }
        // console.log('body->', body);
        this.apiDocHistory.updateHistoryDocuments(body).subscribe(
            (res) => {
                this.appService.successAlert(true, 'รับเอกสารเข้าระบบสำเร็จ', 2000);
                this.docHistory = [];
                this.dataWaitForSend = [];
                this.searchPagination();
                this.close();
            },
            (err) => {
                console.error('err->', err);
            }
        );
        // this.docHistory = [];
        // }
        // console.log('this.dataWaitForSend (สำหรับส่งออก)->', this.dataWaitForSend);

        // this.appService.successAlert(true, 'รับเอกสารเข้าระบบสำเร็จ', 2000);
    }

    openModalDocument(tableDocument) {
        this.modalService.dismissAll();

        this.modalService.open(tableDocument, {centered: true, size: 'xl'});
    }
    // ──────────────────────────────────────────────────────────────
    async checkAll() {
        await this.appService.delay(10);
        if (
            !!this.resPaginationDocumentHistoryData &&
            !!this.resPaginationDocumentHistoryData.datas &&
            this.resPaginationDocumentHistoryData.datas.length > 0
        ) {
            console.log('this.ngCheckAllItem', this.ngCheckAllItem);

            if (this.ngCheckAllItem) {
                for (const iterator of this.resPaginationDocumentHistoryData.datas) {
                    iterator.checked = true;
                    this.arrDocumentIdsChecked.push(iterator.id);
                }
            } else {
                for (const iterator of this.resPaginationDocumentHistoryData.datas) {
                    iterator.checked = false;
                    this.arrDocumentIdsChecked = this.arrDocumentIdsChecked.filter((x) => x !== iterator.id);
                }
            }

            this.arrDocumentIdsChecked = [...new Set(this.arrDocumentIdsChecked)];
        }
    }

    // ──────────────────────────────────────────────────────────────
    async isCheckAll(isDelay?: boolean) {
        if (isDelay !== undefined && isDelay) {
            await this.appService.delay(10);
        }
        if (
            !!this.resPaginationDocumentHistoryData &&
            !!this.resPaginationDocumentHistoryData.datas &&
            this.resPaginationDocumentHistoryData.datas.length > 0
        ) {
            this.ngCheckAllItem = this.resPaginationDocumentHistoryData.datas.every((x) => x.checked === true);
        } else {
            this.ngCheckAllItem = false;
        }
    }

    // ──────────────────────────────────────────────────────────────
    async checkUnCheck(i: number) {
        await this.appService.delay(10);
        if (this.resPaginationDocumentHistoryData.datas[i].checked) {
            this.arrDocumentIdsChecked.push(this.resPaginationDocumentHistoryData.datas[i].id);
        } else {
            this.arrDocumentIdsChecked = this.arrDocumentIdsChecked.filter((x) => x !== this.resPaginationDocumentHistoryData.datas[i].id);
        }
        this.arrDocumentIdsChecked = [...new Set(this.arrDocumentIdsChecked)];
        this.isCheckAll(true);
    }

    async confirmSelectDocument() {
        this.clearDataWaitForSend();
        for (const [i, item1] of this.resPaginationDocumentHistoryData.datas.entries()) {
            for (const item2 of this.arrDocumentIdsChecked) {
                if (item2 === item1.id) {
                    this.dataWaitForSend.push(item1);
                } else {
                    continue;
                }
            }
            if (i === this.resPaginationDocumentHistoryData.datas.length - 1) {
                this.modalService.dismissAll();
            }
        }
    }

    async clearDataWaitForSend() {
        this.dataWaitForSend = [];
    }
}
