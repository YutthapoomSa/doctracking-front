import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiAgencyService} from '@services/api/api-agency/api-agency.service';
import {ReqPaginationAgency, ResPaginationAgencyData} from '@services/api/api-agency/interfaces/api-pagination';
import {LocalService} from '@services/local.service';
import Swal from 'sweetalert2';
import {reqAgency} from './../../services/api/api-agency/interfaces/api-agency';
import {ReqUpdateAgency, ReqUpdateAgencySecondaryList} from './../../services/api/api-agency/interfaces/api-agency-update.interface';
import {ReqCreateAgencySecondary} from './../../services/api/api-agency/interfaces/api-create-agency-secondary.interface';
import {SwalServiceService} from './../../services/swal-service.service';

@Component({
    selector: 'app-manage-departments',
    templateUrl: './manage-departments.component.html',
    styleUrls: ['./manage-departments.component.scss']
})
export class ManageDepartmentsComponent implements OnInit {
    // public departments = [
    //     {
    //         id: 1,
    //         agencyCode: 'สป-01',
    //         agencyName: 'สำนักงานการปฏิรูปที่ดินเพื่อเกษตรกรรม',
    //         abbreviationName: 'สป'
    //     },
    //     {
    //         id: 2,
    //         agencyCode: 'สช-01',
    //         agencyName: 'สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน',
    //         abbreviationName: 'สช'
    //     },
    //     {
    //         id: 3,
    //         agencyCode: 'สศ-01',
    //         agencyName: 'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',
    //         abbreviationName: 'สศ'
    //     },
    //     {
    //         id: 4,
    //         agencyCode: 'สสส-01',
    //         agencyName: 'สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ',
    //         abbreviationName: 'สสส'
    //     },
    //     {
    //         id: 5,
    //         agencyCode: 'สค-01',
    //         agencyName: '-',
    //         abbreviationName: 'สค'
    //     },
    //     {
    //         id: 6,
    //         agencyCode: 'กย-01',
    //         agencyName: '-',
    //         abbreviationName: 'กย'
    //     },
    //     {
    //         id: 7,
    //         agencyCode: 'กส-01',
    //         agencyName: '-',
    //         abbreviationName: 'กส'
    //     },
    //     {
    //         id: 8,
    //         agencyCode: 'กจ-01',
    //         agencyName: '-',
    //         abbreviationName: 'กจ'
    //     },
    //     {
    //         id: 9,
    //         agencyCode: 'กสผ-01',
    //         agencyName: '-',
    //         abbreviationName: 'กสผ'
    //     },
    //     {
    //         id: 10,
    //         agencyCode: 'สธ-01',
    //         agencyName: 'สาธารณสุข',
    //         abbreviationName: 'สธ'
    //     },
    //     {
    //         id: 11,
    //         agencyCode: 'ตส-01',
    //         agencyName: '-',
    //         abbreviationName: 'ตส'
    //     }
    // ];

    public ngForm = {
        id: null,
        agencyCode: '',
        agencyName: '',
        abbreviationName: '',
        agencyList: [
            {
                id: null,
                agencyCode: '',
                agencyName: '',
                abbreviationName: ''
            }
        ]
    };

    public pagingAgency: ReqPaginationAgency = {
        perPages: 10,
        page: 1,
        search: ''
    };
    public agencyDataPaging: ResPaginationAgencyData = {
        itemsPerPage: 0,
        totalItems: 0,
        currentPage: 0,
        totalPages: 0,
        datas: []
    };
    public currentPage = 1;
    public perPage = [5, 10, 25, 50, 100];
    public idEdit: boolean = false;
    public indexForView: number = null;
    public userDetail;
    constructor(
        private apiAgency: ApiAgencyService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private swalService: SwalServiceService,
        private localService: LocalService
    ) {
        // this.initForm();
    }

    initForm() {
        this.ngForm = {
            id: null,
            agencyCode: '',
            agencyName: '',
            abbreviationName: '',
            agencyList: [
                {
                    id: null,
                    agencyCode: '',
                    agencyName: '',
                    abbreviationName: ''
                }
            ]
        };
    }

    addFormAgencyList() {
        this.ngForm.agencyList.push({
            id: null,
            agencyCode: '',
            agencyName: '',
            abbreviationName: ''
        });
    }

    ngOnInit(): void {
        this.paginationAgency();
        this.initForm();
        this.userDetail = this.localService.getProfile();
        console.log('userDetail -> ', JSON.parse(JSON.stringify(this.userDetail)));
    }

    // pagination
    paginationAgency(evtSearch?: any, curr?: number) {
        if (evtSearch) {
            this.pagingAgency.search = evtSearch.target.value;
        }
        if (curr) {
            this.pagingAgency.page = curr;
        }
        const body: ReqPaginationAgency = {
            perPages: Number(this.pagingAgency.perPages),
            page: Number(this.pagingAgency.page),
            search: this.pagingAgency.search
        };

        this.apiAgency.agencyPagination(body).subscribe(
            (res) => {
                if (res.resCode === '0000') {
                    this.agencyDataPaging = res.resData;
                }
            },
            (err) => {
                console.log('err->', err);
            }
        );
    }

    // delete all
    delAgency(id: string) {
        Swal.fire({
            title: 'คุณแน่ใจที่จะลบหน่วยงานนี้หรือไม่?',
            text: 'หากลบแล้วข้อมูลจะไม่สามารถกู้คืนได้!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'gray',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                this.apiAgency.agencyDeleteById(id).subscribe(
                    (res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'ลบข้อมูลสำเร็จ',
                            showConfirmButton: false,
                            timer: 1000
                        });
                        this.paginationAgency();
                        this.closeModal();
                    },
                    (err) => {
                        console.error('err->', err);
                    }
                );
            }
        });
    }

    closeModal() {
        this.modalService.dismissAll();
    }

    // openModal
    openModelAdd(model: any) {
        // this.modalService.dismissAll();
        this.idEdit = false;
        this.modalService.open(model, {size: 'xl', scrollable: true});
    }

    openModelEdited(model: any, agencyId: string) {
        // this.modalService.dismissAll();
        this.idEdit = true;
        // this.ngForm.id = this.ngForm.id;
        // this.ngForm.agencyCode = this.ngForm.agencyCode;
        // this.ngForm.agencyName = this.ngForm.agencyName;
        // this.ngForm.abbreviationName = this.ngForm.abbreviationName;
        this.modalService.open(model, {size: 'xl'});

        this.apiAgency.getAgency(agencyId).subscribe(
            (res) => {
                const resGetAgency = res;
                this.ngForm.id = resGetAgency.resData.id;
                this.ngForm.agencyCode = resGetAgency.resData.agencyCode;
                this.ngForm.agencyName = resGetAgency.resData.agencyName;
                this.ngForm.abbreviationName = resGetAgency.resData.abbreviationName;
                this.ngForm.agencyList = resGetAgency.resData.agencySecondaryLists;
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    openModalView(content: any, index) {
        this.indexForView = index;
        this.modalService.open(content, {size: 'xl'});
    }

    onSubmitTemplateBased() {
        console.log(this.ngForm);
        this.modalService.dismissAll();
        this.initForm();
    }

    onSubmit() {
        const body = {
            agencyCode: this.ngForm.agencyCode,
            agencyName: this.ngForm.agencyName,
            abbreviationName: this.ngForm.abbreviationName
        };
        if (this.ngForm.id !== null) {
            const id = this.ngForm.id;
            // this.apiAgency.agencyUpdate(body, id).subscribe(
            //     (res) => {
            //         Swal.fire({
            //             icon: 'success',
            //             title: 'แก้ไขสำเร็จ',
            //             showConfirmButton: false,
            //             timer: 1000
            //         });
            //         this.paginationAgency();
            //         this.closeModal();
            //     },
            //     (err) => {
            //         Swal.fire({
            //             icon: 'error',
            //             title: 'แก้ไขไม่สำเร็จ',
            //             showConfirmButton: false,
            //             timer: 2000
            //         });
            //         console.error('err->', err);
            //     }
            // );
            return;
        }
        this.apiAgency.agencyRegister(body).subscribe(
            (res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    showConfirmButton: false,
                    timer: 1000
                });
                this.paginationAgency();
                this.closeModal();
            },
            (err) => {
                console.log('err->', err);
                Swal.fire({
                    icon: 'error',
                    title: 'บันทึกไม่สำเร็จ',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        );
    }
    checkDisable() {
        if (
            !!this.ngForm.agencyName &&
            this.ngForm.agencyName !== '' &&
            !!this.ngForm.abbreviationName &&
            this.ngForm.abbreviationName !== '' &&
            !!this.ngForm.agencyCode &&
            this.ngForm.agencyCode !== ''
        ) {
            for (const item of this.ngForm.agencyList) {
                if (
                    !!item.agencyName &&
                    item.agencyName !== '' &&
                    !!item.abbreviationName &&
                    item.abbreviationName !== '' &&
                    !!item.agencyCode &&
                    item.agencyCode !== ''
                ) {
                    console.log('if for');
                    return false;
                } else {
                    console.log('else for');
                    return true;
                }
            }
        } else {
            console.log('else');

            return true;
        }
    }
    saveDepartments() {
        console.log('isEdit -> ', this.idEdit);
        if (this.idEdit && this.ngForm.id !== null) {
            // edit item
            const bodyAgencySecondary: ReqUpdateAgencySecondaryList[] = [];
            for (const item of this.ngForm.agencyList) {
                bodyAgencySecondary.push({
                    id: item.id,
                    abbreviationName: item.abbreviationName,
                    agencyCode: item.agencyCode,
                    agencyName: item.agencyName
                });
            }
            const body: ReqUpdateAgency = {
                agencyName: this.ngForm.agencyName,
                abbreviationName: this.ngForm.abbreviationName,
                agencyCode: this.ngForm.agencyCode,
                agencySecondaryLists: bodyAgencySecondary
            };
            console.log('ngForm edit body-> ', body);

            this.apiAgency.agencyUpdate(body, this.ngForm.id).subscribe(
                (res) => {
                    console.log('res update agency -> ', res);
                    this.swalService.alert(true, 'แก้ไขข้อมูลสำเร็จ');
                    this.initForm();
                    this.paginationAgency();
                    this.modalService.dismissAll();
                },
                (error) => {
                    this.swalService.alert(false, 'ไม่สามารถแก้ไขข้อมูลได้');
                    console.log('error -> ', error);
                }
            );
        } else {
            // save item
            const body: reqAgency = {
                abbreviationName: this.ngForm.abbreviationName,
                agencyCode: this.ngForm.agencyCode,
                agencyName: this.ngForm.agencyName
            };
            this.apiAgency.agencyRegister(body).subscribe(
                (res) => {
                    console.log('saveDepartment -> ', res);
                    for (const iterator of this.ngForm.agencyList) {
                        const bodyAgencySecondary: ReqCreateAgencySecondary = {
                            agencyId: res.resData.id,
                            agencyCode: iterator.agencyCode,
                            abbreviationName: iterator.abbreviationName,
                            agencyName: iterator.agencyName
                        };
                        this.apiAgency.agencySecondaryRegister(bodyAgencySecondary).subscribe(
                            (res) => {
                                console.log('bodyAgencySecondary -> ', res);
                                if (res.resCode === '0000') {
                                    this.swalService.alert(true, 'เพิ่มข้อมูลสำเร็จ');
                                } else {
                                    this.swalService.alert(false, 'ไม่สามารถเพิื่มข้อมูลได้');
                                }
                            },
                            (err) => {
                                console.log('err -> ', err);
                                this.swalService.alert(false, 'ไม่สามารถเพิื่มข้อมูลได้');
                            }
                        );
                        bodyAgencySecondary;
                    }
                    this.paginationAgency();
                    this.initForm();
                    this.modalService.dismissAll();
                },
                (err) => {
                    console.log('err ->', err);
                }
            );
        }
    }

    delFormAgencyList(i: number) {
        if (this.ngForm.agencyList.length === 1) {
            return;
        } else {
            this.ngForm.agencyList.splice(i, 1);
        }
    }
}
