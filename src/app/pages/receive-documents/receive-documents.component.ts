import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiAgencyService} from '@services/api/api-agency/api-agency.service';
import {ResGetAllAgency} from '@services/api/api-agency/interfaces/api-agency-get-all.interface';
import {DocHistoryService} from '@services/api/api-doc-history/doc-history.service';
import {ReqUpdateHistoryDocuments} from '@services/api/api-doc-history/interfaces/update-history-document.interface';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ResDocumentFindOne, ResDocumentFineOneRoutingList} from '@services/api/api-document/interfaces/document-findone.interface';
import {ResAllAgency, ResAllAgencySecondaryData} from '@services/app-service';
import {KeyboardService} from '@services/keyboard.service';
import {LocalService} from '@services/local.service';
import {SwalServiceService} from '@services/swal-service.service';
import dayjs from 'dayjs';
import moment from 'moment';
import {debounce} from 'typescript-debounce-decorator';
import {ResDocumentFindOneDocHistoryList} from './../../services/api/api-document/interfaces/document-findone.interface';
import {
    ReqPaginationDocumentHistory,
    ResPaginationDocumentHistory,
    ResPaginationDocumentHistoryData
} from './../../services/api/api-document/interfaces/pagination-document-history.interface';
import {AppService} from './../../services/app.service';

declare var $: any;
@Component({
    selector: 'app-receive-documents',
    templateUrl: './receive-documents.component.html',
    styleUrls: ['./receive-documents.component.scss']
})
export class ReceiveDocumentsComponent implements OnInit, OnDestroy {
    public resFindOneDocumentHistory: ResDocumentFindOne;
    public resFindOneDocumentHistoryForTimeLine: ResDocumentFineOneRoutingList[];
    public textSearch = '';
    public departments: any[] = [];
    public arrDocumentIdsChecked: string[] = [];
    public historyDetail: ResDocumentFindOneDocHistoryList[] = [];
    public myForm: FormGroup;
    public ngCheckAllItem = false;
    public havePagingDatas = false;
    public dataWaitForSend = [];
    public reqPaginationDocumentHistory: ReqPaginationDocumentHistory = {
        perPages: 10,
        page: 1,
        search: '',
        agencyId: '',
        startAt: '',
        endAt: '',
        status: ['sendOut'],
        isAgencyCheckLast: true,
        isCheckAgencyIdSender: false,
        isCheckAgencyIdRecipient: true,
        isCheckApprove: true,
        isReceiveDocument: true
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
    public resPaginationDocumentHistoryData: ResPaginationDocumentHistoryData = {
        totalItems: 0,
        itemsPerPage: 0,
        totalPages: 0,
        currentPage: 0,
        datas: []
    };
    private test = {
        id: 1,
        code: new Date().getTime(),
        title: 'ส่งเอกสารประจำเดือน',
        origin: 'สสส.',
        destination: 'สป.',
        note: 'เอกสารเร่งด่วน',
        type: 'ภายใน',
        dateCreateAt: dayjs().format('DD-MM-YYYY'),
        isCheck: true
    };
    public btnType = null;
    // public bodyUpdateHistoryDocument: ReqUpdateHistoryDocuments[] = [];

    // public docHistory: ResDocumentFindOneResData[] = [];
    public docHistory = [];
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    placement = 'bottom';

    public priorityOption = [
        {
            name: 'ปกติ',
            value: 'normal'
        },
        {
            name: 'ด่วน',
            value: 'urgent'
        },
        {
            name: 'เร่งด่วนมาก',
            value: 'very_urgent'
        },
        {
            name: 'ด่วนที่สุด',
            value: 'the_most_urgent'
        }
    ];

    public documentType = [
        {
            name: 'ภายใน',
            value: 'internal'
        },
        {
            name: 'ภายนอก',
            value: 'external'
        }
    ];

    private agencyAll: ResGetAllAgency[] = [];
    // public allAgency: ResAllAgency[] = [];
    public allAgencySecondary: ResAllAgencySecondaryData[] = [];

    public formDocument = [
        {
            id: '',
            governmentDocNo: '',
            name: '',
            detail: '',
            documentType: this.documentType[0].value,
            priority: this.priorityOption[0].value,
            isApprove: false,
            isStatusSendOut: '1',
            files: [
                {
                    value: null,
                    nameFile: null,
                    id: null,
                    isDelete: false,
                    icon: '',
                    size: 0
                }
            ],
            toDoc: '',
            formDoc: '',
            recipients: [
                {
                    agencyIdRecipient: '',
                    agencySecondaryIdRecipient: ''
                }
            ],
            sender: {
                agencyIdSender: '',
                agencySecondaryIdSender: ''
            },
            agencyData: [
                {
                    id: '5c65eb60-9a49-4ce7-845b-f2ea9f4baf07',
                    agencyName: 'สำนักการศึกษา',
                    abbreviationName: 'นบ',
                    agencyCode: 'นบ',
                    isSelect: false,
                    isSelectAll: false,
                    collapsed: false,
                    agencySecondaryLists: [
                        {
                            id: '1e6ba426-75bd-42fd-8485-b8e66bab913f',
                            agencyName: 'อัพเดทหน่วยงาน2',
                            abbreviationName: 'อพ2',
                            agencyCode: 'อพ2',
                            agencyId: '5c65eb60-9a49-4ce7-845b-f2ea9f4baf07',
                            isSelect: false
                        }
                    ]
                }
            ]
        }
    ];

    constructor(
        private keyboardService: KeyboardService,
        private appService: AppService,
        private modalService: NgbModal,
        private apiDoc: ApiDocumentService,
        private apiDocHistory: DocHistoryService,
        private apiAgency: ApiAgencyService,
        private swalServiceService: SwalServiceService,
        private localService: LocalService,
        private fb: FormBuilder
    ) {
        this.initForm();
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
        this.appService.isReceivePages = true;

        if (this.appService.trackingCodes.length > 0) {
            console.log('trackingCode -> ', this.appService.trackingCodes);

            for (const item of this.appService.trackingCodes) {
                this.textAutoSearch(item);
            }
            // this.appService.trackingCodes.forEach((x) => this.departments.push(this.test));
        }

        this.loadAgency();
        this.textSearch = '';

        console.log('on in it else');

        this.keyboardService.getKeys().subscribe(async (key: string) => {
            // console.log('keyboard service');
            this.textSearch = '';
            await this.appService.delay(100);
            this.textSearch = key;
            this.textAutoSearch(this.textSearch);

            this.departments.push(this.test);
            $('#search').focus();
            if (!this.appService.trackingCodes.some((x) => x === this.textSearch)) {
                this.appService.trackingCodes.push(this.textSearch);
            }
        });
    }

    ngOnDestroy() {
        this.appService.isReceivePages = false;
        this.textSearch = '';
    }

    search() {
        this.appService.trackingCodes.push('x');
        this.departments.push(this.test);
    }

    del(index: number) {
        // this.docHistory.splice(index, 1);
        for (const [i, item1] of this.resPaginationDocumentHistoryData.datas.entries()) {
            if (this.dataWaitForSend[index].id === item1.id) {
                item1.checked = false;
            }
        }
        this.dataWaitForSend.splice(index, 1);
        // this.checkAll();
    }

    textSearchChange(evt) {
        if (evt.key === 'Enter') {
            const id = this.textSearch;

            this.textAutoSearch(id);
            // this.textSearch = '';
            console.log('enter search');

            // console.log('this.docHistory->', this.docHistory);
        }
    }

    textAutoSearch(id: string) {
        if (this.docHistory.some((x) => x.barcode === id)) {
            console.log('this.textsearch -> ', this.textSearch);

            this.textSearch = '';

            this.swalServiceService.alert(false, 'เอกสารถูกสเเกนเเล้ว');
            return;
        }
        if (this.docHistory.some((x) => x.governmentDocNo === id)) {
            console.log('this.governmentDocNo -> ', this.textSearch);

            this.textSearch = '';

            this.swalServiceService.alert(false, 'เอกสารถูกสเเกนเเล้ว');
            return;
        }

        this.apiDoc
            .documentFindOne(id)
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
                // this.swalServiceService.alert(false);
            })
            .catch((err) => {
                console.error('err->', err);
            });

        // console.log('docHistory -> ', this.docHistory);
    }

    insertDocument(content: any, type: number) {
        this.btnType = type;
        for (const iterator of this.dataWaitForSend) {
            for (const item of iterator.documentRoutingLists) {
                Object.assign(item, {isSelect: true});
            }
        }
        this.modalService.open(content, {size: 'xl'});
    }

    saveReceived() {
        let myAgencyId = '';
        let myAgencyIdSecondary = '';
        // let agencyReceivedIdSecondary = '';
        const userLocal = this.localService.getProfile();
        if (userLocal.agency.length && userLocal.agency && userLocal) {
            myAgencyId = userLocal.agency[0].id;
        }
        if (userLocal.agencySecondary.length && userLocal.agencySecondary && userLocal) {
            myAgencyIdSecondary = userLocal.agencySecondary[0].id;
            // agencyReceivedIdSecondary = userLocal.agencySecondary[0].agencyId;
        }
        let body: ReqUpdateHistoryDocuments[] = [];
        console.log('this.dataWaitForSend->', this.dataWaitForSend);

        switch (this.btnType) {
            case 1:
                for (const iterator of this.dataWaitForSend) {
                    for (const item of iterator.documentRoutingLists) {
                        if (myAgencyIdSecondary !== '') {
                            if (item.agencySecondaryIdRecipient === myAgencyIdSecondary) {
                                body.push({
                                    // userId: iterator.userId,
                                    status: 'receive',
                                    comment: iterator.comment ? iterator.comment : '',
                                    agencyIdSender: '',
                                    agencyIdRecipient: myAgencyId ? myAgencyId : '',
                                    documentId: iterator.id,
                                    agencySecondaryIdSender: myAgencyIdSecondary ? myAgencyIdSecondary : '',
                                    agencySecondaryIdRecipient: myAgencyIdSecondary ? myAgencyIdSecondary : '',
                                    formDoc: iterator.formDoc ? iterator.formDoc : '',
                                    toDoc: iterator.toDoc ? iterator.toDoc : '',
                                    documentRoutingId: item.id
                                });
                                break;
                            }
                        } else {
                            if (item.agencyIdRecipient === myAgencyId) {
                                body.push({
                                    // userId: iterator.userId,
                                    status: 'receive',
                                    comment: iterator.comment ? iterator.comment : '',
                                    agencyIdSender: '',
                                    agencyIdRecipient: myAgencyId ? myAgencyId : '',
                                    documentId: iterator.id,
                                    agencySecondaryIdSender: myAgencyIdSecondary ? myAgencyIdSecondary : '',
                                    agencySecondaryIdRecipient: myAgencyIdSecondary ? myAgencyIdSecondary : '',
                                    formDoc: iterator.formDoc ? iterator.formDoc : '',
                                    toDoc: iterator.toDoc ? iterator.toDoc : '',
                                    documentRoutingId: item.id
                                });
                                break;
                            }
                        }
                    }
                }

                this.apiDocHistory.updateHistoryDocuments(body).subscribe(
                    (res) => {
                        this.appService.successAlert(true, 'รับเอกสารเข้าระบบสำเร็จ', 2000);
                        this.docHistory = [];
                        this.dataWaitForSend = [];
                        this.searchPagination();
                        this.close();
                    },
                    (err) => {
                        console.log('err->', err);
                    }
                );
                break;

            case 2: //ส่งต่อ เอกสาร
                const body2 = [];
                for (const iterator of this.dataWaitForSend) {
                    for (const routing of iterator.documentRoutingLists) {
                        if (routing.selectRouting === true) {
                            for (const item of iterator.agencyData) {
                                if (item.isSelect === true) {
                                    for (const secondaryAgency of item.agencySecondaryLists) {
                                        if (secondaryAgency.isSelect === true) {
                                            body2.push({
                                                // userId: iterator.userId,
                                                status: 'sendOut',
                                                comment: iterator.comment ? iterator.comment : '',
                                                agencyIdSender: myAgencyId ? myAgencyId : '',
                                                agencyIdRecipient: item.id ? item.id : '',
                                                documentId: iterator.id,
                                                agencySecondaryIdSender: myAgencyIdSecondary ? myAgencyIdSecondary : '',
                                                agencySecondaryIdRecipient: secondaryAgency.id ? secondaryAgency.id : '',
                                                formDoc: iterator.formDoc ? iterator.formDoc : '',
                                                toDoc: iterator.toDoc ? iterator.toDoc : '',
                                                documentRoutingId: routing.id
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        continue;
                    }
                }

                console.log('body2-___->', body2);

                this.apiDoc.documentForWardOrReturn(body2).subscribe(
                    (res) => {
                        this.appService.successAlert(true, 'ส่งต่อเอกสารสำเร็จ', 2000);
                        this.docHistory = [];
                        this.dataWaitForSend = [];
                        this.searchPagination();
                        this.close();
                    },
                    (err) => {
                        console.error('err->', err);
                    }
                );
                break;

            case 3: //ส่งคืน เอกสาร
                const body3 = [];
                for (const iterator of this.dataWaitForSend) {
                    for (const item of iterator.documentRoutingLists) {
                        // if (myAgencyIdSecondary !== '') {
                        if (item.isSelect === true) {
                            body3.push({
                                // userId: iterator.userId,
                                status: 'sendOut',
                                comment: iterator.comment ? iterator.comment : '',
                                agencyIdSender: myAgencyId ? myAgencyId : '',
                                agencyIdRecipient: item.agencyIdRecipient ? item.agencyIdRecipient : '',
                                documentId: iterator.id,
                                agencySecondaryIdSender: myAgencyIdSecondary ? myAgencyIdSecondary : '',
                                agencySecondaryIdRecipient: item.agencySecondaryIdRecipient ? item.agencySecondaryIdRecipient : '',
                                formDoc: iterator.formDoc ? iterator.formDoc : '',
                                toDoc: iterator.toDoc ? iterator.toDoc : '',
                                documentRoutingId: item.id
                            });
                        }
                        continue;
                        // } else {
                        //     if (item.isSelect === true) {
                        //         body3.push({
                        //             // userId: iterator.userId,
                        //             status: 'sendOut',
                        //             comment: iterator.comment ? iterator.comment : '',
                        //             agencyIdSender: myAgencyId ? myAgencyId : '',
                        //             agencyIdRecipient: item.agencyIdRecipient ? item.agencyIdRecipient : '',
                        //             documentId: iterator.id,
                        //             agencySecondaryIdSender: myAgencyIdSecondary ? myAgencyIdSecondary : '',
                        //             agencySecondaryIdRecipient: item.agencySecondaryIdRecipient ? item.agencySecondaryIdRecipient : '',
                        //             formDoc: iterator.formDoc ? iterator.formDoc : '',
                        //             toDoc: iterator.toDoc ? iterator.toDoc : '',
                        //             documentRoutingId: item.id
                        //         });
                        //     }
                        //     continue;
                        // }
                    }
                }

                console.log('body3-___->', body3);

                this.apiDoc.documentForWardOrReturn(body3).subscribe(
                    (res) => {
                        this.appService.successAlert(true, 'ส่งต่อเอกสารสำเร็จ', 2000);
                        this.docHistory = [];
                        this.dataWaitForSend = [];
                        this.searchPagination();
                        this.close();
                    },
                    (err) => {
                        console.error('err->', err);
                    }
                );
                break;
        }
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

    async isSelectOrUnSelect(indexForm: number, indexAgency: number) {
        await this.appService.delay(20);
        this.dataWaitForSend[indexForm].agencyData[indexAgency].isSelect = this.dataWaitForSend[indexForm].agencyData[indexAgency].isSelectAll;
        for (const iterator of this.dataWaitForSend[indexForm].agencyData[indexAgency].agencySecondaryLists) {
            iterator.isSelect = this.dataWaitForSend[indexForm].agencyData[indexAgency].isSelectAll;
        }
    }

    async isSelectOrUnSelect2(indexForm: number, indexAgency: number) {
        await this.appService.delay(20);
        const isPass = this.dataWaitForSend[indexForm].agencyData[indexAgency].agencySecondaryLists.every((x) => x.isSelect);
        if (isPass && this.dataWaitForSend[indexForm].agencyData[indexAgency].isSelect) {
            this.dataWaitForSend[indexForm].agencyData[indexAgency].isSelectAll = true;
        } else {
            this.dataWaitForSend[indexForm].agencyData[indexAgency].isSelectAll = false;
        }
    }

    openModalDocument(tableDocument) {
        this.modalService.dismissAll();
        this.searchPagination();
        this.modalService.open(tableDocument, {centered: true, size: 'xl'});
    }

    async close() {
        this.modalService.dismissAll();
    }
    @debounce(200)
    getUserPagination() {
        this.reqPaginationDocumentHistory.page = Number(this.reqPaginationDocumentHistory.page);
        this.reqPaginationDocumentHistory.perPages = Number(this.reqPaginationDocumentHistory.perPages);

        const userLocal = this.localService.getProfile();
        if (userLocal.agency.length !== 0 && userLocal.agency && userLocal) {
            this.reqPaginationDocumentHistory.agencyId = userLocal.agency[0].id;
        }
        this.apiDoc.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
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
                    this.swalServiceService.alert(false, resp.msg);
                }
            },
            (err) => {
                this.havePagingDatas = false;
                this.swalServiceService.alert(false);
                console.error('userPagination -> ', err);
            }
        );
    }

    // getAllAgency() {
    //     this.allAgency = [];
    //     this.apiAgency.agencyGetAll().subscribe(
    //         (res) => {
    //             this.allAgency = res;
    //         },
    //         (error) => {
    //             console.log('error -> ', error);
    //         }
    //     );
    // }

    genAgency() {
        const agencyLists = [
            {
                collapsed: false,
                id: '5c65eb60-9a49-4ce7-845b-f2ea9f4baf07',
                agencyName: 'สำนักการศึกษา',
                abbreviationName: 'นบ',
                agencyCode: 'นบ',
                isSelect: false,
                isSelectAll: false,
                agencySecondaryLists: [
                    {
                        id: '1e6ba426-75bd-42fd-8485-b8e66bab913f',
                        agencyName: 'อัพเดทหน่วยงาน2',
                        abbreviationName: 'อพ2',
                        agencyCode: 'อพ2',
                        agencyId: '5c65eb60-9a49-4ce7-845b-f2ea9f4baf07',
                        isSelect: false
                    }
                ]
            }
        ];
        agencyLists.length = 0;

        if (!!this.agencyAll && this.agencyAll.length > 0) {
            for (const iterator of this.agencyAll) {
                const _create = {
                    collapsed: false,
                    id: iterator.id,
                    agencyName: iterator.agencyName,
                    abbreviationName: iterator.abbreviationName,
                    agencyCode: iterator.agencyCode,
                    agencySecondaryLists: [
                        {
                            id: '1e6ba426-75bd-42fd-8485-b8e66bab913f',
                            agencyName: 'อัพเดทหน่วยงาน2',
                            abbreviationName: 'อพ2',
                            agencyCode: 'อพ2',
                            agencyId: '5c65eb60-9a49-4ce7-845b-f2ea9f4baf07',
                            isSelect: false
                        }
                    ],
                    isSelect: false,
                    isSelectAll: false
                };

                _create.agencySecondaryLists.length = 0;

                if (!!iterator.agencySecondaryLists && iterator.agencySecondaryLists.length > 0) {
                    for (const iterator2 of iterator.agencySecondaryLists) {
                        const _agencySecondaryList = {
                            id: iterator2.id,
                            agencyName: iterator2.agencyName,
                            abbreviationName: iterator2.abbreviationName,
                            agencyCode: iterator2.agencyCode,
                            agencyId: iterator2.agencyId,
                            isSelect: false
                        };
                        _create.agencySecondaryLists.push(_agencySecondaryList);
                    }
                }

                agencyLists.push(_create);
            }
        }
        return agencyLists;
    }

    loadAgency() {
        return new Promise((resolve, reject) => {
            this.apiAgency.agencyGetAll().subscribe(
                (res) => {
                    this.agencyAll = res;

                    for (const item of this.agencyAll) {
                        Object.assign(item, {isDisable: false, collapsed: false, isSelect: false, isSelectAll: false});
                        for (const iterator2 of item.agencySecondaryLists) {
                            Object.assign(iterator2, {isDisable: false, isSelect: false, isSelectAll: false});
                        }
                    }

                    console.log('this.agencyAll♥♥♥♥⌂┘╛╒-->', this.agencyAll);

                    return resolve(this.agencyAll);
                },
                (err) => {
                    console.error('err->', err);
                    return reject(err);
                }
            );
        });
    }

    searchPagination(evt?: any) {
        //
        console.log('req paging -> ', this.reqPaginationDocumentHistory);
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');

        this.reqPaginationDocumentHistory.startAt = dateStartMoment;
        this.reqPaginationDocumentHistory.endAt = dateEndMoment;
        const userLocal = this.localService.getProfile();
        this.reqPaginationDocumentHistory.agencyId = userLocal.agency[0].id;
        // this.reqPaginationDocumentHistory.startAt = moment().startOf('month').format('YYYY-MM-DD');
        // this.reqPaginationDocumentHistory.endAt = moment().endOf('month').format('YYYY-MM-DD');
        this.apiDoc.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
            async (res) => {
                this.resPaginationDocumentHistory = res;
                this.resPaginationDocumentHistoryData = this.resPaginationDocumentHistory.resData;
                for (const item of this.resPaginationDocumentHistoryData.datas) {
                    Object.assign(item, {calFromNow: moment(item.createdAt).lang('th').fromNow(true)});
                    Object.assign(item.user, {phoneNumberSecure: await this.appService.securePhoneNumber(item.user.phoneNumber)});
                }

                if (this.dataWaitForSend.length > 0 && this.resPaginationDocumentHistoryData.datas.length > 0) {
                    console.log('is Search');

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
    async checkAll() {
        await this.appService.delay(10);
        if (
            !!this.resPaginationDocumentHistoryData &&
            !!this.resPaginationDocumentHistoryData.datas &&
            this.resPaginationDocumentHistoryData.datas.length > 0
        ) {
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
                for (const iterator of this.dataWaitForSend) {
                    Object.assign(iterator, {agencyData: this.agencyAll});
                    for (const routing of iterator.documentRoutingLists) {
                        Object.assign(routing, {selectRouting: true});
                    }
                }

                console.log('this.dataWaitForSend-________->', this.dataWaitForSend);

                this.modalService.dismissAll();
            }
        }
    }
    async clearDataWaitForSend() {
        this.dataWaitForSend = [];
    }
}
