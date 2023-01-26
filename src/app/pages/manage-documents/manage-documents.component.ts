import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiAgencyService} from '@services/api/api-agency/api-agency.service';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ReqDeleteFileDocument} from '@services/api/api-document/interfaces/del-update.interface';
import {ReqPaginationDocument, ResPaginationDocumentData} from '@services/api/api-document/interfaces/doc-pagination.interface';
import {ReqUpdateDocument} from '@services/api/api-document/interfaces/doc-update.interface';
import {AppService} from '@services/app.service';
import dayjs from 'dayjs';
import {getMaterialFileIcon} from 'file-extension-icon-js';
import html2canvas from 'html2canvas';
import JsBarcode from 'jsbarcode';
import moment from 'moment';
import Swal from 'sweetalert2';
import {debounce} from 'typescript-debounce-decorator';
import {AgencySecondaryList, ResGetAllAgency} from './../../services/api/api-agency/interfaces/api-agency-get-all.interface';
import {GetAllAgencySecondaryData} from './../../services/api/api-agency/interfaces/api-agency-secondary.interface';
import {ReqCreateDocument} from './../../services/api/api-document/interfaces/doc-create.interface';
import {LocalService} from './../../services/local.service';
declare var $: any;
@Component({
    selector: 'app-manage-documents',
    templateUrl: './manage-documents.component.html',
    styleUrls: ['./manage-documents.component.scss']
})
export class ManageDocumentsComponent implements OnInit {
    public myForm: FormGroup;
    public myForm2: FormGroup;
    public collapse: boolean = false;
    public allAgency: ResGetAllAgency[] = [];
    public allAgencySecondary: GetAllAgencySecondaryData[] = [];
    public allAgencySecondary2: GetAllAgencySecondaryData[] = [];

    public barcode = [
        {
            name: '',
            barcode: '',
            isSelect: false
        }
    ];
    public departmentsForm = [
        {
            id: 1,
            code: new Date().getTime(),
            title: '',
            origin: '',
            destination: '',
            note: '',
            type: '',
            dateCreateAt: ''
        }
    ];
    public indexCountDoc = 0;
    public departments = [
        {
            id: 1,
            code: new Date().getTime(),
            title: 'ส่งเอกสารประจำเดือน',
            origin: 'สสส.',
            destination: 'สป.',
            note: 'เอกสารเร่งด่วน',
            type: 'ภายใน',
            dateCreateAt: dayjs().format('DD-MM-YYYY')
        },
        {
            id: 2,
            code: new Date().getTime(),
            title: 'ส่งเอกสารประจำเดือน',
            origin: 'สสส.',
            destination: 'สป.',
            note: 'เอกสารเร่งด่วน',
            type: 'ภายใน',
            dateCreateAt: dayjs().format('DD-MM-YYYY')
        }
    ];

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

    // form document
    public isEdited = false;
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

    private agencyAll: ResGetAllAgency[] = [];
    public agencySecondary: AgencySecondaryList[] = [];
    public pagingDocument: ReqPaginationDocument = {
        perPages: 10,
        // perPages: 10,
        page: 1,
        search: '',
        startAt: '',
        endAt: ''
    };

    public documentDataPaging: ResPaginationDocumentData = {
        itemsPerPage: 0,
        totalItems: 0,
        currentPage: 0,
        totalPages: 0,
        datas: []
    };

    public isSubmit = false;
    public indexView = null;
    public currentPage = 1;
    public perPage = [5, 10, 25, 50, 100];

    private timeCountInterval = null;

    public userAgency = {
        agency: [],
        agencySecondary: []
    };
    public agencyIdRecipient = '';
    public agencyIdSender = '';
    public agencySecondaryIdRecipient = '';
    public agencySecondaryIdSender = '';
    public userDetail;
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    placement = 'bottom';
    constructor(
        private modalService: NgbModal,
        private appService: AppService,
        private apiDocumentService: ApiDocumentService,
        private apiAgency: ApiAgencyService,
        private localService: LocalService,
        private sanitization: DomSanitizer,
        private fb: FormBuilder
    ) {
        this.initForm();
    }

    async ngOnInit(): Promise<void> {
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
        await this.loadAgency();
        this.paginationDocument();
        this.startCounterDate();
        this.loadLocalUserInfo();
        this.formDocument = [this.newDocumentForm()];
        this.apiAgency.agencyGetAll().subscribe(
            (res) => {
                this.allAgency = res;
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
        this.userDetail = this.localService.getProfile();
    }

    loadLocalUserInfo() {
        const userInfo = this.localService.getProfile();
        this.userAgency.agency = [];
        this.userAgency.agencySecondary = [];

        if (!!userInfo && !!userInfo.agency && userInfo.agency.length > 0) {
            for (const iterator of userInfo.agency) {
                this.userAgency.agency.push(iterator.id);
            }
        }

        if (!!userInfo && !!userInfo.agencySecondary && userInfo.agencySecondary.length > 0) {
            for (const iterator of userInfo.agencySecondary) {
                this.userAgency.agencySecondary.push(iterator.id);
            }
        }
    }

    isAgency(agencyId: string): boolean {
        return this.userAgency.agency.find((x) => agencyId === x) ? true : false;
    }

    startCounterDate() {
        this.timeCountInterval = setInterval(() => {
            if (!!this.documentDataPaging && !!this.documentDataPaging.datas && this.documentDataPaging.datas.length > 0) {
                for (const iterator of this.documentDataPaging.datas) {
                    iterator.dateUse = moment(iterator.createdAt).lang('th').fromNow(true);
                }
            }
        }, 1000);
    }

    clearCounterDate() {
        if (this.timeCountInterval) {
            clearInterval(this.timeCountInterval);
            this.timeCountInterval = null;
        }
    }

    loadAgency() {
        return new Promise((resolve, reject) => {
            this.apiAgency.agencyGetAll().subscribe(
                (res) => {
                    this.agencyAll = res;

                    for (const item of this.agencyAll) {
                        Object.assign(item, {isDisable: false});
                        for (const iterator2 of item.agencySecondaryLists) {
                            Object.assign(iterator2, {isDisable: false, isSelectAll: false});
                        }
                    }
                    return resolve(this.agencyAll);
                },
                (err) => {
                    console.error('err->', err);
                    return reject(err);
                }
            );
        });
    }

    calTimeUsageDocument() {}

    // delete
    deleteDocument(id: string) {
        Swal.fire({
            title: 'คุณแน่ใจที่จะเอกสารนี้หรือไม่?',
            text: 'หากลบแล้วข้อมูลจะไม่สามารถกู้คืนได้!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'gray',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                this.apiDocumentService.documentDelete(id).subscribe(
                    (res) => {
                        this.appService.successAlert(true, 'สร้างเอกสารสำเร็จ', 2000);
                    },
                    (err) => {
                        this.appService.successAlert(false, 'สร้างเอกไม่สารสำเร็จ !', 2000);
                        console.log('err->', err);
                    }
                );
            }
            this.paginationDocument();
        });
    }

    // pagination document
    @debounce(500)
    paginationDocument(evtSearch?: any, curr?: number) {
        if (evtSearch) {
            this.pagingDocument.search = evtSearch.target.value;
        }
        if (curr) {
            this.pagingDocument.page = curr;
        }
        const body: ReqPaginationDocument = {
            perPages: Number(this.pagingDocument.perPages),
            page: Number(this.pagingDocument.page),
            search: this.pagingDocument.search,
            startAt: '',
            endAt: ''
        };
        // const senderId = this.localService.getProfile();
        // console.log('secondaryId -> ', senderId);
        // let secondarySenderId;
        // if(!!senderId.agencySecondary && senderId.agencySecondary.length){
        //   secondarySenderId = senderId.agencySecondary[0].id
        // }

        this.apiDocumentService.documentPagination(body, '', '', '', '').subscribe(
            (res) => {
                if (res.resCode === '0000') {
                    this.barcode = [];
                    this.documentDataPaging = res.resData;
                    console.log(' this.documentDataPaging->', this.documentDataPaging);
                    for (let iterator of this.documentDataPaging.datas) {
                        this.barcode.push({
                            name: iterator.name,
                            barcode: iterator.barcode,
                            isSelect: true
                        });
                        Object.assign(iterator, {isSelect: true});
                    }

                    console.log('this.barcodes -> ', this.barcode);
                }
            },
            (err) => {
                console.log('err->', err);
            }
        );
    }

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

    newDocumentForm() {
        return {
            collapsed: false,
            id: '',
            governmentDocNo: '',
            name: '',
            detail: '',
            documentType: this.documentType[0].value,
            priority: this.priorityOption[0].value,
            isApprove: false,
            isStatusSendOut: '1',
            files: [],
            toDoc: '',
            formDoc: '',
            recipients: [],
            sender: {
                agencyIdSender: '',
                agencySecondaryIdSender: ''
            },
            agencyData: this.genAgency()
        };
    }

    /* add form */
    addDocumentArray(index: number) {
        if (index < 0) return;
        this.indexCountDoc = 0;
        for (let i = 0; i < index; i++) {
            this.formDocument.push(this.newDocumentForm());
        }

        // console.log('this.formDocument.get->', this.formDocument.get('formDocumentArray').value.length);
    }

    openModelAdd(model: any) {
        this.modalService.dismissAll();
        this.modalService.open(model, {size: 'xl'});
    }

    openNewModalAdd(model: any) {
        this.modalService.dismissAll();
        this.modalService.open(model, {size: 'xl', scrollable: true});
        this.indexCountDoc = 0;
    }

    openModelEdited(model: any, index: number) {
        this.isEdited = true;

        this.apiDocumentService.documentFindOne(this.documentDataPaging.datas[index].id).subscribe(
            (resp) => {
                if (resp.resCode !== '0000') {
                    return;
                }
                const _data = resp.resData;

                const agency = this.genAgency();
                let agencyIdSender = '';
                let agencySecondaryIdSender = '';

                if (_data.documentRoutingLists.length > 0) {
                    agencyIdSender = _data.documentRoutingLists[0].agencyIdSender;
                    agencySecondaryIdSender = _data.documentRoutingLists[0].agencySecondaryIdSender;
                }

                // map sender

                for (const iterator of _data.documentRoutingLists) {
                    for (const iterator2 of agency) {
                        if (iterator2.id === iterator.agencyIdRecipient) {
                            iterator2.isSelect = true;
                        }

                        if (iterator2.agencySecondaryLists.length === 0) continue;

                        for (const iterator3 of iterator2.agencySecondaryLists) {
                            if (iterator3.id === iterator.agencySecondaryIdRecipient) {
                                iterator3.isSelect = true;
                            }
                        }

                        const isSome = iterator2.agencySecondaryLists.some((x) => x.isSelect);

                        iterator2.collapsed = iterator2.collapsed || isSome;
                    }
                }

                this.formDocument = [
                    {
                        id: _data.id,
                        governmentDocNo: _data.governmentDocNo,
                        name: _data.name,
                        detail: _data.detail,
                        documentType: _data.documentType,
                        priority: _data.priority,
                        isApprove: false,
                        isStatusSendOut: '1',
                        files: _data.docFileLists.map((x) => {
                            return {
                                value: x.fileFullPath,
                                nameFile: x.fileName,
                                id: null,
                                isDelete: false,
                                icon: getMaterialFileIcon(x.fileName),
                                size: x.fileSize
                            };
                        }),
                        toDoc: _data.toDoc,
                        formDoc: _data.formDoc,
                        recipients: _data.documentRoutingLists.map((x) => {
                            return {
                                agencyIdRecipient: x.agencyIdRecipient,
                                agencySecondaryIdRecipient: x.agencySecondaryIdRecipient
                            };
                        }),
                        sender: {
                            agencyIdSender: _data.documentRoutingLists.length > 0 ? _data.documentRoutingLists[0].agencyIdSender : '',
                            agencySecondaryIdSender:
                                _data.documentRoutingLists.length > 0 ? _data.documentRoutingLists[0].agencySecondaryIdSender : ''
                        },
                        agencyData: agency
                    }
                ];
            },
            (err) => {
                console.error(err);
            }
        );

        this.modalService.open(model, {size: 'xl', scrollable: true});
    }

    openModalView(content, index: number) {
        this.indexView = index;
        this.modalService.open(content, {size: 'xl'});
    }

    async onSubmitTemplateBased() {
        try {
            if (this.isEdited) {
                for (const iterator of this.formDocument) {
                    const bodyUpdate: ReqUpdateDocument = {
                        name: iterator.name,
                        priority: iterator.priority,
                        documentType: iterator.documentType,
                        detail: iterator.detail,
                        governmentDocNo: iterator.governmentDocNo,
                        isApprove: `${iterator.isApprove}` === 'true' ? true : false,
                        isStatusSendOut: `${iterator.isStatusSendOut}` === '2' ? true : false
                    };

                    let formData: FormData = null;
                    let fileDelete: ReqDeleteFileDocument[] = [];

                    for (const iterator2 of iterator.files) {
                        if (iterator2.id !== null) continue;
                        if (iterator2.value === null) continue;
                        if (iterator2.isDelete === null) {
                            fileDelete.push({
                                documentId: iterator.id,
                                fileId: iterator2.id
                            });
                            continue;
                        }
                        if (formData === null) formData = new FormData();
                        formData.append('images', iterator2.value);
                    }

                    // update data
                    const result = await this.apiDocumentService.documentUpdate(bodyUpdate, iterator.id).toPromise();

                    // add file
                    if (result && result.resCode === '0000') {
                        if (formData !== null) {
                            await this.apiDocumentService.uploadsFile(result.resData.id, formData).toPromise();
                        }
                    } else {
                        throw new Error('error');
                    }

                    // del file
                    if (fileDelete.length > 0) {
                        await this.apiDocumentService.delFile(fileDelete).toPromise();
                    }

                    await Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขเอกสารสำเร็จ',
                        timer: 2000
                    });
                }
            } else {
                let formData: FormData = null;

                for (const iterator of this.formDocument) {
                    formData = null;

                    const _recipients = [
                        {
                            agencyIdRecipient: '',
                            agencySecondaryIdRecipient: ''
                        }
                    ];

                    _recipients.length = 0;
                    for (const iterator2 of iterator.agencyData) {
                        if (iterator2.isSelect) {
                            _recipients.push({
                                agencyIdRecipient: iterator2.id,
                                agencySecondaryIdRecipient: ''
                            });
                        }

                        for (const iterator3 of iterator2.agencySecondaryLists) {
                            if (iterator3.isSelect) {
                                _recipients.push({
                                    agencyIdRecipient: iterator2.id,
                                    agencySecondaryIdRecipient: iterator3.id
                                });
                            }
                        }
                    }

                    const body: ReqCreateDocument = {
                        name: iterator.name,
                        priority: iterator.priority,
                        documentType: iterator.documentType,
                        detail: iterator.detail,
                        governmentDocNo: iterator.governmentDocNo,
                        isApprove: `${iterator.isApprove}` === 'true' ? true : false,
                        isStatusSendOut: `${iterator.isStatusSendOut}` === '2' ? true : false,
                        toDoc: iterator.toDoc,
                        formDoc: iterator.formDoc,
                        recipients: _recipients,
                        sender: {
                            agencyIdSender: iterator.sender.agencyIdSender,
                            agencySecondarySender: iterator.sender.agencySecondaryIdSender
                        }
                    };

                    for (const iterator2 of iterator.files) {
                        if (iterator2.value === null) continue;
                        if (iterator2.isDelete === null) continue;
                        if (formData === null) formData = new FormData();
                        formData.append('images', iterator2.value);
                    }

                    const resultCreate = await this.apiDocumentService.documentCreate(body).toPromise();

                    if (resultCreate?.resCode !== '0000') {
                        throw new Error('resCode not success.');
                    }

                    if (formData !== null) {
                        const resultImage = await this.apiDocumentService.uploadsFile(resultCreate.resData.id, formData).toPromise();
                        if (resultImage?.resCode !== '0000') {
                            throw new Error('resCode not success.');
                        }
                    }
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'เพิ่มเอกสารสำเร็จ',
                    timer: 2000
                });
            }

            this.paginationDocument();
            this.modalService.dismissAll();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'ไม่สำเร็จ!',
                text: 'เกิดข้อผิดพลาดบางอย่าง',
                timer: 2000
            });
        }
    }

    deleteListDocument(index: number) {
        this.formDocument = this.formDocument.filter((x, i) => i !== index);
    }

    selectDocument(index) {
        this.barcode[index].isSelect = this.documentDataPaging.datas[index].isSelect;
    }

    openModalQrCode(modal: any) {
        this.modalService.dismissAll();
        for (const [index, item] of this.barcode.entries()) {
            $(document).ready(function () {
                JsBarcode('#barcode' + index, item.barcode, {
                    width: 2,
                    height: 25,
                    fontSize: 18,
                    textMargin: 15,
                    displayValue: true
                });
            });
        }

        this.modalService.open(modal, {size: 'lg'});
    }
    checkDisableBtn() {
        if (this.documentDataPaging.datas.length !== 0) {
            return false;
        } else {
            return true;
        }
    }

    clearData() {
        this.formDocument = [this.newDocumentForm()];
    }

    // เพิ่มหน่วยงานปลายทาง
    addRecipient(i: number) {
        this.formDocument[i].recipients.push({
            agencyIdRecipient: '',
            agencySecondaryIdRecipient: ''
        });
        console.log('formDocument -> ', this.formDocument[i].recipients);
    }

    // handleFileInputImg(event: any, i1: number, i2: number) {
    //     Array.from(event.target.files).forEach((f: any, i: number) => {
    //         this.formDocument[i1].files[i2].value = f;
    //         this.formDocument[i1].files[i2].nameFile = f.name;
    //     });

    // }

    // printBarcode() {
    //     var printContents = document.getElementById('qrcode').innerHTML;
    //     document.body.innerHTML = printContents;
    //     window.print();
    //     // window.location.reload();
    // }

    async printBarcode(): Promise<void> {
        let self = document.getElementById('barcode');
        let popupWin;
        var s = new XMLSerializer();
        let printContents = '<head><style>svg{width: 50mm; height: 20mm; text-align: left;}  @media print {body{margin: 0;}}</style></head>';
        printContents += '<body onload="window.print();window.close()">';
        // let printContents = '<body>';
        printContents += '<div style="width: 100mm; height: 25mm;">';
        printContents += '<table>';
        printContents += '<thead>';
        printContents += '<tr>';
        printContents += '<th></th>';
        printContents += '<th></th>';
        printContents += '</tr>';
        printContents += '</thead>';
        printContents += '<tbody>';

        // if (this.type === 'bill') {
        for (const [i, data] of this.barcode.entries()) {
            if (data.isSelect) {
                let img = document.getElementById('barcode' + i);
                // console.log('barcode->', img);
                if ((i + 1) % 2 === 0) {
                    printContents += '<td>';
                    printContents += s.serializeToString(img);
                    printContents += '</td>';
                    printContents += '</tr>';
                    // printContents += '<img src="' + img + '" style="width:49mm;height:25mm; />';
                } else {
                    printContents += '<tr>';
                    printContents += '<td>';
                    printContents += s.serializeToString(img);
                    printContents += '</td>';
                    // printContents += '<img src="' + img + '" style="width:49mm;height:25mm;" />';
                }
                // html2canvas(document.getElementById('barcode' + i), {allowTaint: true}).then(function (canvas) {
                //     // var img = canvas.toDataURL('image/png');
                //     printContents += canvas;
                //     console.log('canvas->', canvas);
                // });
            }

            await this.appService.delay(300);
            if (i === this.barcode.length - 1) {
                printContents += '</tbody>';
                printContents += '</table>';
                printContents += '</div>';
                printContents += '<body>';
                popupWin = window.open('', '_blank');
                await popupWin.document.write(printContents);
                await popupWin.document.close();

                console.log('printContents->', printContents);
            }
        }
        // }
    }

    checkInput() {
        const isPass = this.formDocument.some((x) => {
            return x.agencyData.some((x2) => x2.isSelect || x2.agencySecondaryLists.some((x3) => x3.isSelect));
        });

        if (!isPass) {
            return true;
        }

        for (const x of this.formDocument) {
            if (!x.name || (!x.sender.agencyIdSender && !x.sender.agencySecondaryIdSender)) {
                return true;
            }
        }
        return false;
    }

    changeAgencyIdSender(index: number) {
        this.formDocument[index];
    }

    getIndex(getIndex: number) {
        console.log('getIndex -> ', getIndex);
    }

    async isSelectOrUnSelect(indexForm: number, indexAgency: number) {
        await this.appService.delay(20);
        this.formDocument[indexForm].agencyData[indexAgency].isSelect = this.formDocument[indexForm].agencyData[indexAgency].isSelectAll;
        for (const iterator of this.formDocument[indexForm].agencyData[indexAgency].agencySecondaryLists) {
            iterator.isSelect = this.formDocument[indexForm].agencyData[indexAgency].isSelectAll;
        }
    }

    async isSelectOrUnSelect2(indexForm: number, indexAgency: number) {
        await this.appService.delay(20);
        const isPass = this.formDocument[indexForm].agencyData[indexAgency].agencySecondaryLists.every((x) => x.isSelect);
        if (isPass && this.formDocument[indexForm].agencyData[indexAgency].isSelect) {
            this.formDocument[indexForm].agencyData[indexAgency].isSelectAll = true;
        } else {
            this.formDocument[indexForm].agencyData[indexAgency].isSelectAll = false;
        }
    }

    // [start file] ──────────────────────────────────────────────────────────────
    /**
     * on file drop handler
     */
    onFileDropped($event, i1: number) {
        this.prepareFilesList($event, i1);
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(event, i1: number) {
        this.prepareFilesList(event.target.files, i1);
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>, i1: number) {
        for (const item of files) {
            this.formDocument[i1].files.push({
                value: item,
                nameFile: item.name,
                id: null,
                isDelete: false,
                icon: getMaterialFileIcon(item.name),
                size: item.size
            });
        }
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals = 0) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    getMaterialFileIcon1(iconBase64: string) {
        return this.sanitization.bypassSecurityTrustUrl(iconBase64);
    }
    // [end file] ──────────────────────────────────────────────────────────────
    findAgencySecondary(agencyId: string) {
        if (!!agencyId) {
            this.apiAgency.getAllAgencySecondary(agencyId).subscribe(
                (res) => {
                    this.allAgencySecondary = res.resData;
                    console.log('findAgencySecondary -> ', this.allAgencySecondary);
                },
                (error) => {
                    console.log('error -> ', error);
                }
            );
            console.log('agencyIdRecipient -> ', agencyId);
        }
    }

    findAgencySecondary2(agencyId: string) {
        if (!!agencyId) {
            this.apiAgency.getAllAgencySecondary(agencyId).subscribe(
                (res) => {
                    this.allAgencySecondary2 = res.resData;
                    console.log('findAgencySecondary -> ', this.allAgencySecondary);
                },
                (error) => {
                    console.log('error -> ', error);
                }
            );
            console.log('agencyIdRecipient -> ', agencyId);
        }
    }

    initForm() {
        this.myForm = this.fb.group({
            agencyIdRecipient: new FormControl('', Validators.required),
            agencyIdSender: new FormControl('', Validators.required),
            agencySecondaryIdRecipient: new FormControl('', Validators.required),
            agencySecondaryIdSender: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
            startAt: new FormControl('', Validators.required),
            endAt: new FormControl('', Validators.required)
        });
        this.myForm2 = this.fb.group({
            agencyIdRecipient: new FormControl(),
            agencyIdSender: new FormControl(),
            agencySecondaryIdRecipient: new FormControl(),
            agencySecondaryIdSender: new FormControl()
        });
    }

    searchPaginationDocument() {
        const dateStart = this.dateStart.year + '-' + this.dateStart.month + '-' + this.dateStart.day;
        const dateEnd = this.dateEnd.year + '-' + this.dateEnd.month + '-' + this.dateEnd.day;
        const dateStartMoment = moment(dateStart).format('YYYY-MM-DD');
        const dateEndMoment = moment(dateEnd).format('YYYY-MM-DD');

        this.pagingDocument.startAt = dateStartMoment;
        this.pagingDocument.endAt = dateEndMoment;
        console.log('dateEndMoment -> ', dateEndMoment);
        this.apiDocumentService
            .documentPagination(
                this.pagingDocument,
                this.agencyIdRecipient,
                this.agencySecondaryIdRecipient,
                this.agencyIdSender,
                this.agencySecondaryIdSender
            )
            .subscribe(
                (res) => {
                    if (res.resCode === '0000') {
                        this.barcode = [];
                        this.documentDataPaging = res.resData;
                        // console.log(' this.documentDataPaging->', this.documentDataPaging);
                        for (let iterator of this.documentDataPaging.datas) {
                            this.barcode.push({
                                name: iterator.name,
                                barcode: iterator.barcode,
                                isSelect: true
                            });
                            Object.assign(iterator, {isSelect: true});
                        }

                        console.log('this.barcodes -> ', this.barcode);
                        console.log(' this.documentDataPaging.datas->', this.documentDataPaging.datas);
                    }
                    console.log('searchPaginationDocument -> ', res);
                },
                (error) => {
                    console.log('error -> ', error);
                }
            );
    }
}
