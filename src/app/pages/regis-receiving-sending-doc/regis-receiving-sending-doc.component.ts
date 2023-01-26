import {ResGetAllAgency} from './../../services/api/api-agency/interfaces/api-agency-get-all.interface';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RegisPrintService} from '@components/print/regis-print/regis-print.service';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiAgencyService} from '@services/api/api-agency/api-agency.service';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ReqPaginationDocument, ResPaginationDocumentData} from '@services/api/api-document/interfaces/doc-pagination.interface';
import {ResDocumentFineOneRoutingList} from '@services/api/api-document/interfaces/document-findone.interface';
import {AppService} from '@services/app.service';
import moment from 'moment-timezone';
import {debounce} from 'typescript-debounce-decorator';
import {ResFindOneDocumentArray} from './../../services/api/api-document/interfaces/find-one-document-array.interface';
moment.tz.setDefault('Asia/Bangkok');

@Component({
    selector: 'app-regis-receiving-sending-doc',
    templateUrl: './regis-receiving-sending-doc.component.html',
    styleUrls: ['./regis-receiving-sending-doc.component.scss']
})
export class RegisReceivingSendingDocComponent implements OnInit {
    public myForm = {
        endAt: '2022-11-30',
        page: 1,
        perPages: 10,
        search: '',
        startAt: '2022-11-01'
    };

    public textSearch: string = '';
    public allAgency: ResGetAllAgency[] = [];
    public agencyIdRecipient: string = '';

    public ngPagination: ReqPaginationDocument = {
        perPages: 10,
        page: 1,
        search: '',
        startAt: '',
        endAt: ''
    };

    public documentIds: '';

    public data: ResPaginationDocumentData = null;
    public resFindOneDocumentHistoryForTimeLine: ResDocumentFineOneRoutingList[];
    public ngCheckAllItem = false;
    public indexView: number;

    public arrDocumentIdsChecked = [
        {
            id: '',
            no: ''
        }
    ];

    public resFindOneDocumentArray: ResFindOneDocumentArray;
    public dateStart: NgbDateStruct = {
        year: +moment().format('YYYY'),
        month: +moment().format('M'),
        day: +moment().startOf('month').format('D')
    };

    public dateEnd: NgbDateStruct = {
        year: +moment().format('YYYY'),
        month: +moment().format('M'),
        day: +moment().endOf('month').format('D')
    };

    public placement = 'bottom';
    constructor(
        private apiDocumentService: ApiDocumentService,
        private appService: AppService,
        private regisPrintService: RegisPrintService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private apiAgency: ApiAgencyService
    ) {
        // this.initForm();
        this.arrDocumentIdsChecked = [];
    }

    initForm() {
        // this.myForm = {
        //     endAt: '2022-11-30',
        //     page: 1,
        //     perPages: 10,
        //     search: '',
        //     startAt: '2022-11-01'
        // };
        // this.myForm = this.fb.group({
        //     startAt: new FormControl('', Validators.required),
        //     endAt: new FormControl('', Validators.required),
        //     agencyIdRecipient: new FormControl('', Validators.required)
        // });
    }
    ngOnInit(): void {
        this.paginationDocument();
        this.apiAgency.agencyGetAll().subscribe(
            (res) => {
                this.allAgency = res;
                console.log('allAgency page regis -> ', this.allAgency);
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }

    @debounce(500)
    paginationDocumentDebounce() {
        this.paginationDocument();
    }

    searchPagination() {
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');

        this.ngPagination.startAt = dateStartMoment;
        this.ngPagination.endAt = dateEndMoment;
        const agencyIdRecipient = this.agencyIdRecipient ? this.agencyIdRecipient : '';

        this.apiDocumentService.documentPagination(this.ngPagination, agencyIdRecipient, '', '', '').subscribe(
            (res) => {
                if (res.resCode !== '0000') {
                    // toast
                    return;
                }

                this.data = res.resData;

                if (!!this.data && !!this.data.datas && this.data.datas.length > 0) {
                    for (const iterator of this.data.datas) {
                        Object.assign(iterator, {checked: this.isCheckStack(iterator.id)});
                    }
                }
            },
            (err) => {
                console.log('err->', err);
            }
        );
    }
    paginationDocument() {
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
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');

        this.ngPagination.startAt = dateStartMoment;
        this.ngPagination.endAt = dateEndMoment;
        this.apiDocumentService.documentPagination(this.ngPagination, '', '', '', '').subscribe(
            (res) => {
                if (res.resCode !== '0000') {
                    // toast
                    return;
                }

                this.data = res.resData;

                if (!!this.data && !!this.data.datas && this.data.datas.length > 0) {
                    for (const iterator of this.data.datas) {
                        Object.assign(iterator, {checked: this.isCheckStack(iterator.id)});
                    }
                }
            },
            (err) => {
                console.log('err->', err);
            }
        );
    }

    // ──────────────────────────────────────────────────────────────
    async checkAll() {
        await this.appService.delay(10);
        if (!!this.data && !!this.data.datas && this.data.datas.length > 0) {
            if (this.ngCheckAllItem) {
                for (const iterator of this.data.datas) {
                    iterator.checked = true;
                    this.arrDocumentIdsChecked.push({
                        id: iterator.id,
                        no: iterator.docNo
                    });
                }
            } else {
                for (const iterator of this.data.datas) {
                    iterator.checked = false;
                    this.arrDocumentIdsChecked = this.arrDocumentIdsChecked.filter((x) => x.id !== iterator.id);
                }
            }

            this.arrDocumentIdsChecked = [...new Set(this.arrDocumentIdsChecked)];
        }
    }

    async isCheckAll(isDelay?: boolean) {
        if (isDelay !== undefined && isDelay) {
            await this.appService.delay(10);
        }
        if (!!this.data && !!this.data.datas && this.data.datas.length > 0) {
            this.ngCheckAllItem = this.data.datas.every((x) => x.checked === true);
        } else {
            this.ngCheckAllItem = false;
        }
    }

    async checkUnCheck(i: number) {
        await this.appService.delay(10);
        if (this.data.datas[i].checked) {
            this.arrDocumentIdsChecked.push({
                id: this.data.datas[i].id,
                no: this.data.datas[i].docNo
            });
        } else {
            this.arrDocumentIdsChecked = this.arrDocumentIdsChecked.filter((x) => x.id !== this.data.datas[i].id);
        }
        this.arrDocumentIdsChecked = [...new Set(this.arrDocumentIdsChecked)];
        this.isCheckAll(true);
    }

    isCheckStack(id: string) {
        return this.arrDocumentIdsChecked.some((x) => x.id === id);
    }
    // ──────────────────────────────────────────────────────────────

    openLink() {
        const ids = this.arrDocumentIdsChecked.map((x) => x.id);
        window.open(`http://localhost:4200/regis-print?ids=${ids}`, '_blank');
        this.apiDocumentService.findOneDocumentArray(ids).subscribe(
            (res) => {
                this.resFindOneDocumentArray = res;
                console.log('resFindOneDocumentArray -> ', this.resFindOneDocumentArray);
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }

    openModalView(content, index: number, barcode?: string) {
        this.indexView = index;
        // console.log('data->', this.data.datas[index].documentRoutingLists);
        if (barcode) {
            this.findOneDocumentHistory(barcode);
        }
        this.modalService.open(content, {size: 'xl'});
    }

    // load Data
    findOneDocumentHistory(barcode: string) {
        this.apiDocumentService.documentFindOne(barcode).subscribe(
            (res) => {
                console.log('res->', res);
                this.resFindOneDocumentHistoryForTimeLine = res.resData.documentRoutingLists;
                // this.docHistory.find((x) => {
                //     x.documentRoutingLists.find((x2) => {
                //         if (x.governmentDocNo === barcode) {
                //             this.historyDetail = x2.docHistoryLists;
                //         }
                //     });
                // });
                // this.resFindOneDocumentHistory = res;
                // this.resFindOneDocumentHistoryForTimeLine = res.resData.documentRoutingLists;
                // // this.historyDetail = this.resFindOneDocumentHistory.resData.docHistoryLists;
                // console.log('resFindOneDocumentHistory -> ', this.resFindOneDocumentHistory);
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }

    close() {
        this.modalService.dismissAll();
    }
}
