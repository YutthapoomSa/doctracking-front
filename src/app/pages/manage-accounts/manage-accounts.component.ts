import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiAgencyService} from '@services/api/api-agency/api-agency.service';
import {ReqPaginationAgency} from '@services/api/api-agency/interfaces/api-agency-apgination';
import {ApiUserService} from '@services/api/api-user.service';
import {ReqUserPagination, ResUserPagination} from '@services/api/api-user/interfaces/users-pagination';
import {ReqUsersRegister} from '@services/api/api-user/interfaces/users-register';
import {ReqUserUpdate} from '@services/api/api-user/interfaces/users-update';
import {ResAllAgencySecondaryData, ResRole} from '@services/app-service';
import {AppService} from '@services/app.service';
import {LocalService} from '@services/local.service';
import {SwalServiceService} from '@services/swal-service.service';
import {Select2OptionData} from 'ng-select2';
import {Options} from 'select2';
import {debounce} from 'typescript-debounce-decorator';
import {ResAllAgency} from './../../services/app-service';

@Component({
    selector: 'app-manage-accounts',
    templateUrl: './manage-accounts.component.html',
    styleUrls: ['./manage-accounts.component.scss']
})
export class ManageAccountsComponent implements OnInit {
    public isEdit = false;
    public accounts = [];
    public agencys: Select2OptionData[] = [];
    public gender: ResRole[] = [];
    public haveUserPagingDatas = false;
    public myForm: FormGroup;
    public optionsSelect2: Options;
    public reqPaginationAgency: ReqPaginationAgency = {
        perPages: 10000,
        page: 1,
        search: ''
    };
    public reqUserPagination: ReqUserPagination = {
        perPages: 10,
        page: 1,
        search: ''
    };
    public reqUsersRegister: ReqUsersAddOrupdate = {
        id: null,
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        phoneNumber: '',
        role: '',
        // agencyId: '',
        // agencyIds: []
        agencyId: '',
        agencySecondaryId: ''
    };
    public resUserPagination: ResUserPagination = {
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
    public role: ResRole[] = [];
    public allAgency: ResAllAgency[] = [];
    public allAgencySecondary: ResAllAgencySecondaryData[] = [];
    public userForm: FormGroup;
    public userDetail;
    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        private appService: AppService,
        private apiAgency: ApiAgencyService,
        private swalService: SwalServiceService,
        private apiUser: ApiUserService,
        private localService: LocalService
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        console.log('pass init');

        this.getUserPagination();
        this.userDetail = this.localService.getProfile();
    }

    clearData() {
        this.agencys = [];
        this.reqUsersRegister = {
            id: null,
            email: '',
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            gender: '',
            phoneNumber: '',
            role: '',
            agencyId: '',
            agencyIds: [],
            agencySecondaryId: ''
        };
    }

    delete(id: string) {
        this.swalService
            .confirmAlert('ต้องการลบข้อมูลผู้ใช้ ?', 'ต้องการลบข้อมูลผู้ใช้ ใช่หรือไม่', 'ลบข้อมูลผู้ใช้', 'ยกเลิก')
            .then((resp) => {
                if (resp) {
                    this.apiUser.deleteUser(id).subscribe(
                        (resp) => {
                            if (resp.resCode === '0000') {
                                this.swalService.alert(true);
                                this.getUserPagination();
                            } else {
                                this.swalService.alert(false, resp.msg);
                            }
                        },
                        (err) => {
                            console.error('deleteUser -> ', err);
                            this.swalService.alert(false);
                        }
                    );
                }
            })
            .catch((err) => {
                console.error('confirmAlert -> ', err);
            });
    }

    // ──────get agency data───────────────────────────────────────────────────────────
    getAgency() {
        this.apiAgency.agencyPagination(this.reqPaginationAgency).subscribe(
            (resp) => {
                if (resp.resCode === '0000') {
                    if (resp.resData.datas.length > 0) {
                        let datas = [{id: '', text: ''}];
                        for (const data of resp.resData.datas) {
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
            },
            (err) => {
                this.swalService.alert(false);
                console.error('getPaginationAgrncy -> ', err);
            }
        );
    }

    getGender() {
        this.gender = this.appService.getGender();
    }

    // ───────get agency data──────────────────────────────────────────────────────────
    getAllAgency() {
        this.allAgency = [];
        this.apiAgency.agencyGetAll().subscribe(
            (res) => {
                this.allAgency = res;
            },
            (error) => {
                console.log('error -> ', error);
            }
        );
    }
    // ───────get role data──────────────────────────────────────────────────────────
    getRole() {
        this.role = [];
        this.role = this.appService.getRole();
    }

    getUserById(id: string) {
        this.apiUser.getUserById(id).subscribe(
            (resp) => {
                if (resp.resCode === '0000' && resp.resData) {
                    this.reqUsersRegister = {
                        id: resp.resData.id,
                        email: resp.resData.email,
                        username: resp.resData.userName,
                        password: null,
                        firstName: resp.resData.firstName,
                        lastName: resp.resData.lastName,
                        gender: resp.resData.gender,
                        phoneNumber: resp.resData.phoneNumber,
                        role: resp.resData.role,
                        agencyId: null,
                        agencyIds: []
                        // agencySecondaryId: a
                    };
                    for (const data of resp.resData.userAgencyLists) {
                        this.reqUsersRegister.agencyIds.push(data.agencyId);
                    }
                } else {
                    this.swalService.alert(false, resp.msg);
                }

                this.initForm();
            },
            (err) => {
                console.error('getUserById -> ', err);
            }
        );
    }

    @debounce(200)
    getUserPagination() {
        this.reqUserPagination.page = Number(this.reqUserPagination.page);
        this.reqUserPagination.perPages = Number(this.reqUserPagination.perPages);

        this.apiUser.userPagination(this.reqUserPagination).subscribe(
            (resp) => {
                console.log('userPagination -> ', resp);

                if (resp.resCode === '0000') {
                    this.resUserPagination = resp;
                    if (resp.resData.datas.length > 0) {
                        this.haveUserPagingDatas = true;
                    } else {
                        this.haveUserPagingDatas = false;
                    }
                } else {
                    this.haveUserPagingDatas = false;
                    this.swalService.alert(false, resp.msg);
                }
            },
            (err) => {
                this.haveUserPagingDatas = false;
                this.swalService.alert(false);
                console.error('userPagination -> ', err);
            }
        );
    }

    initForm() {
        this.myForm = this.fb.group({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            userName: new FormControl('', Validators.required),
            password: this.reqUsersRegister.id ? new FormControl() : new FormControl('', Validators.required),
            role: new FormControl('', Validators.required),
            department: new FormControl('', Validators.required),
            tel: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
        });

        this.userForm = this.fb.group({
            userName: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    // ───────get data for crud──────────────────────────────────────────────────────────
    loadDataCrud() {
        this.getAgency();
        this.getGender();
        this.getRole();
        this.getAllAgency();
    }

    onSubmitTemplateBased() {
        console.log(this.myForm);
        this.save();
    }

    onSubmitUserBased() {
        console.log(this.userForm);
        this.modalService.dismissAll();
        this.initForm();
    }

    // ──────open modal add───────────────────────────────────────────────────────────
    openModelAdd(model: any) {
        this.isEdit = false;
        this.clearData();
        this.initForm();
        this.loadDataCrud();
        this.modalService.dismissAll();
        this.modalService.open(model, {size: 'lg'});
    }

    openModelEdited(model: any, id: string) {
        this.isEdit = true;
        this.clearData();
        this.loadDataCrud();
        this.getUserById(id);
        this.modalService.dismissAll();
        this.modalService.open(model, {size: 'lg'});
    }

    openModalShowPassword(modal: any, index) {
        this.modalService.dismissAll();
        console.log(this.accounts[index]);

        this.userForm.get('userName').setValue(this.accounts[index].userName);
        this.userForm.get('password').setValue(this.accounts[index].password);
        this.modalService.open(modal, {centered: true, size: 'sm'});
    }

    // ────save users data─────────────────────────────────────────────────────────────
    save() {
        if (this.reqUsersRegister.id && this.reqUsersRegister.id !== '') {
            const _body: ReqUserUpdate = {
                email: this.reqUsersRegister.email,
                username: this.reqUsersRegister.username,
                password: this.reqUsersRegister.password,
                firstName: this.reqUsersRegister.firstName,
                lastName: this.reqUsersRegister.lastName,
                gender: this.reqUsersRegister.gender,
                phoneNumber: this.reqUsersRegister.phoneNumber,
                role: this.reqUsersRegister.role,
                agencyId: this.reqUsersRegister.agencyIds.length > 0 ? this.reqUsersRegister.agencyIds[0] : null,
                agencySecondaryId: this.reqUsersRegister.agencySecondaryId ? this.reqUsersRegister.agencySecondaryId : null
            };
            this.apiUser.userUpdate(_body, this.reqUsersRegister.id, this.reqUsersRegister.agencyId).subscribe(
                (resp) => {
                    this.clearData();
                    console.log('userUpdate -> ', resp);
                    if (resp.resCode === '0000') {
                        this.swalService.alert(true);
                        this.getUserPagination();
                    } else {
                        this.swalService.alert(false, resp.msg);
                    }
                },
                (err) => {
                    this.clearData();
                    console.error('userUpdate -> ', err);
                    this.swalService.alert(false);
                }
            );
        } else {
            const _body: ReqUsersRegister = {
                email: this.reqUsersRegister.email,
                username: this.reqUsersRegister.username,
                password: this.reqUsersRegister.password,
                firstName: this.reqUsersRegister.firstName,
                lastName: this.reqUsersRegister.lastName,
                gender: this.reqUsersRegister.gender,
                phoneNumber: this.reqUsersRegister.phoneNumber,
                role: this.reqUsersRegister.role,
                agencyId: this.reqUsersRegister.agencyIds.length > 0 ? this.reqUsersRegister.agencyIds[0] : null
            };
        }
        this.apiUser.usersRegister(this.reqUsersRegister).subscribe(
            (resp) => {
                this.clearData();
                console.log('usersRegister -> ', resp);
                if (resp.resCode === '0000') {
                    this.swalService.alert(true);
                    this.getUserPagination();
                } else {
                    this.swalService.alert(false, resp.msg);
                }
            },
            (err) => {
                this.clearData();
                console.error('usersRegister -> ', err);
                this.swalService.alert(false);
            }
        );
    }

    selectMainAgency(evt) {
        this.apiAgency.getAllAgencySecondary(evt).subscribe(
            (res) => {
                this.allAgencySecondary = res.resData;
                console.log('this.allAgencySecondary->', this.allAgencySecondary);
            },
            (err) => {
                console.log('err->', err);
            }
        );
    }
}

interface ReqUsersAddOrupdate {
    id?: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    role: string;
    agencyId: string;
    agencyIds?: string[];
    agencySecondaryId?: string;
}
