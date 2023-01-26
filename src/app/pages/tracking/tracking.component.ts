import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';
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
import {AppService} from './../../services/app.service';
import {LocalService} from './../../services/local.service';
import {SwalServiceService} from './../../services/swal-service.service';

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
    public noHistory = false;
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
    public myForm: FormGroup;
    public resFindOneDocumentHistory: ResDocumentFindOne;
    public resFindOneDocumentHistoryForTimeLine: ResDocumentFineOneRoutingList[];
    public historyDetail: ResDocumentFindOneDocHistoryList[] = [];
    public havePagingDatas = false;

    public reqPaginationDocumentHistory: ReqPaginationDocumentHistory = {
        perPages: 10,
        page: 1,
        search: '',
        agencyId: '',
        startAt: '',
        endAt: '',
        status: ['sendOut'],
        isAgencyCheckLast: true,
        isCheckAgencyIdSender: true,
        isCheckAgencyIdRecipient: true,
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
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    placement = 'bottom';
    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        private appService: AppService,
        private localService: LocalService,
        private apiDocumentService: ApiDocumentService,
        private swalService: SwalServiceService
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
        console.log('user info -> ', this.localService.getProfile());
        this.searchPagination();
    }
    @debounce(200)
    getUserPagination() {
        this.reqPaginationDocumentHistory.page = Number(this.reqPaginationDocumentHistory.page);
        this.reqPaginationDocumentHistory.perPages = Number(this.reqPaginationDocumentHistory.perPages);

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
    async openVerticallyCentered(content) {
        this.modalService.open(content, {centered: true, size: 'lg'});
    }

    close() {
        this.modalService.dismissAll();
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
    searchPagination() {
        console.log('req paging -> ', this.reqPaginationDocumentHistory);
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');
        console.log('dateEndMoment -> ', dateEndMoment);

        // this.reqPaginationDocumentHistory.startAt = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        // this.reqPaginationDocumentHistory.endAt = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        this.reqPaginationDocumentHistory.startAt = dateStartMoment;
        this.reqPaginationDocumentHistory.endAt = dateEndMoment;
        // this.reqPaginationDocumentHistory.status = [this.statusSelected];
        const userLocal = this.localService.getProfile();
        if (userLocal.agency.length !== 0 && userLocal.agency && userLocal) {
            this.reqPaginationDocumentHistory.agencyId = userLocal.agency[0].id;
        }
        // console.log('this.reqPaginationDocumentHistory -> ', this.reqPaginationDocumentHistory);

        this.apiDocumentService.paginationDocumentHistory(this.reqPaginationDocumentHistory).subscribe(
            async (res) => {
                this.resPaginationDocumentHistory = res;
                this.resPaginationDocumentHistoryData = this.resPaginationDocumentHistory.resData;
                for (const item of this.resPaginationDocumentHistoryData.datas) {
                    Object.assign(item, {calFromNow: moment(item.createdAt).lang('th').fromNow(true)});
                }
                console.log('resPaginationDocumentHistoryData -> ', this.resPaginationDocumentHistoryData);
                for (const item of this.resPaginationDocumentHistoryData.datas) {
                    const phoneStringSecure = await this.appService.securePhoneNumber(item.user.phoneNumber);
                    Object.assign(item.user, {phoneNumberSecure: String(phoneStringSecure)});
                }
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    async openHistory(content, barcode: string) {
        this.modalService.dismissAll();
        this.modalService.open(content, {centered: true, size: 'lg'});
        this.apiDocumentService.documentFindOne(barcode).subscribe(
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
