import {Component, OnInit} from '@angular/core';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiAgencyService} from '@services/api/api-agency/api-agency.service';
import {ReqPaginationAgency} from '@services/api/api-agency/interfaces/api-pagination';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ReqDocumentSummary, ResDocumentSummaryData} from '@services/api/api-document/interfaces/document-summary';
import {SwalServiceService} from '@services/swal-service.service';
import {ChartFontOptions, ChartOptions} from 'chart.js';
import moment from 'moment';
import {Select2OptionData} from 'ng-select2';
import {Options} from 'select2';
import {debounce} from 'typescript-debounce-decorator';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    public agencys: Select2OptionData[] = [];
    public bodyDocumentSummary: ReqDocumentSummary = {
        agencyId: '',
        startAt: '',
        endAt: ''
    };
    public isStatus = [];
    public optionsSelect2: Options;
    public reqDocumentSummary: GetSummary = {
        agencyId: [],
        startAt: {
            year: Number(moment().startOf('month').format('YYYYY')),
            month: Number(moment().startOf('month').format('MM')),
            day: Number(moment().startOf('month').format('DD'))
        },
        endAt: {
            year: Number(moment().endOf('month').format('YYYYY')),
            month: Number(moment().endOf('month').format('MM')),
            day: Number(moment().endOf('month').format('DD'))
        }
    };
    public reqPaginationAgency: ReqPaginationAgency = {
        perPages: 10000,
        page: 1,
        search: ''
    };
    public resDocumentSummary: ResDocumentSummaryData = {
        sumOfDateLists: [],
        summaryAll: {
            success: 0,
            unsuccessful: 0,
            reject: 0,
            create: 0,
            noEvent: 0,
            processing: 0,
            total: 0
        }
    };
    chartData = [
        {
            data: [],
            label: 'ทั้งหมด'
        },
        {
            data: [],
            label: 'อยู่ระหว่างดำเนินการ'
        },
        {
            data: [],
            label: 'เสร็จสิ้น'
        }
    ];

    chartLabels = [];
    chartOptions: ChartOptions = {
        responsive: true,
        legend: {
            labels: {
                // This more specific font property overrides the global property
                fontColor: 'black',
                fontFamily: 'Mitr'
            }
        }
    };

    chartFontOptions: ChartFontOptions = {
        // fontFamily: 'tahoma'
    };
    constructor(
        private apiAgency: ApiAgencyService,
        private apiDocument: ApiDocumentService,
        private swalService: SwalServiceService,
        private modalService: NgbModal
    ) {}

    async ngOnInit() {
        await this.getAgency();
        await this.repairReqDoc();
        this.getDocumentSummary();
    }

    async repairReqDoc() {
        const startAt = moment(
            this.reqDocumentSummary.startAt.year + '-' + this.reqDocumentSummary.startAt.month + '-' + this.reqDocumentSummary.startAt.day
        ).format('YYYY-MM-DD');
        const endAt = moment(
            this.reqDocumentSummary.endAt.year + '-' + this.reqDocumentSummary.endAt.month + '-' + this.reqDocumentSummary.endAt.day
        ).format('YYYY-MM-DD');

        this.bodyDocumentSummary = {
            agencyId: this.reqDocumentSummary.agencyId.length > 0 ? this.reqDocumentSummary.agencyId[0] : '',
            startAt: startAt,
            endAt: endAt
        };
    }

    async getAgency() {
        await this.apiAgency
            .agencyPagination(this.reqPaginationAgency)
            .toPromise()
            .then((resp) => {
                if (resp.resCode === '0000') {
                    if (resp.resData.datas.length > 0) {
                        let datas = [{id: '', text: ''}];
                        for (const [i, data] of resp.resData.datas.entries()) {
                            if (i === 0) this.reqDocumentSummary.agencyId.push(data.id);
                            datas.push({
                                id: data.id,
                                text: data.agencyName
                            });
                        }
                        this.agencys = datas;
                    }
                } else {
                    this.swalService.alert(false, resp.msg);
                }
            })
            .catch((err) => {
                this.swalService.alert(false);
                console.error('getPaginationAgrncy -> ', err);
            });
    }

    @debounce(200)
    async getDocumentSummary() {
        await this.repairReqDoc();

        this.apiDocument.documentSummary(this.bodyDocumentSummary).subscribe(
            (resp) => {
                if (resp.resCode === '0000') {
                    this.resDocumentSummary = resp.resData;

                    this.chartLabels = [];
                    for (const data of resp.resData.sumOfDateLists) {
                        this.chartLabels.push(data.date);
                    }
                    for (const data of this.chartData) {
                        data.data = [];
                        if (data.label === 'ทั้งหมด') {
                            for (const data2 of resp.resData.sumOfDateLists) {
                                data.data.push(data2.data.total);
                            }
                        }
                        if (data.label === 'อยู่ระหว่างดำเนินการ') {
                            for (const data2 of resp.resData.sumOfDateLists) {
                                data.data.push(data2.data.processing);
                            }
                        }
                        if (data.label === 'เสร็จสิ้น') {
                            for (const data2 of resp.resData.sumOfDateLists) {
                                data.data.push(data2.data.success);
                            }
                        }
                    }
                } else {
                    this.swalService.alert(false, resp.msg);
                }
            },
            (err) => {
                this.swalService.alert(false);
                console.error('documentSummary -> ', err);
            }
        );
    }

    async openModalPaginationDoc(content: any, status: string[]) {
        this.isStatus = status;
        await this.repairReqDoc();
        this.modalService.open(content, {size: 'lg'});
    }
}

interface GetSummary {
    agencyId?: string[];
    startAt: NgbDateStruct;
    endAt: NgbDateStruct;
}
