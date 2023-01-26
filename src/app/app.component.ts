import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiUserService} from '@services/api/api-user.service';
import {ReqRefreshToken} from '@services/api/api-user/interfaces/users-refresh-token';
import {AppService} from '@services/app.service';
import {KeyboardService} from '@services/keyboard.service';
import {LocalService} from '@services/local.service';
import moment from 'moment';
import {SwalServiceService} from './services/swal-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private timeInterval = null;

    constructor(
        private keyboardService: KeyboardService,
        public appService: AppService,
        private router: Router,
        private localStorageService: LocalService,
        private apiUser: ApiUserService,
        private swalServiceService: SwalServiceService
    ) {}

    ngOnInit() {
        let code = '';
        let reading = false;
        this.refreshToken();

        document.addEventListener('keypress', (e: any) => {
            //usually scanners throw an 'Enter' key at the end of read
            if (e.keyCode === 13) {
                if (code.length > 13) {
                    console.log(code);
                    code = '';
                }
            } else {
                code += e.key; //while this is not an 'enter' it stores the every key
                // console.log('code -> ', code);
            }

            //run a timeout of 200ms at the first read and clear everything
            if (!reading) {
                reading = true;
                setTimeout(async () => {
                    // if (code.indexOf('MN') === 0) {
                    // console.log('reading', code);

                    const usingObjectAssign = Object.assign([], code);
                    // console.log('usingObjectAssign', usingObjectAssign);

                    // const isPass = usingObjectAssign.some((x) => /^[a-zA-Z]+$/.test(x));
                    const isPass = usingObjectAssign.some((x) => /^[0-9]+$/.test(x));
                    // check ภาษาไทนก่อน navigate
                    if (code.length === 13 && isPass) {
                        this.keyboardService.sendKey(code);
                        if (!this.appService.isReceivePages) {
                            if (this.appService.trackingCodes.some((x) => x === code)) {
                                this.swalServiceService.alert(false, 'เอกสารถูกสเเกนเเล้ว');
                            } else if (this.appService.trackingCodes.some((x) => x === '')) {
                            } else {
                                this.appService.trackingCodes.push(code);
                            }

                            await this.router.navigate(['/receive-documents']);
                        }
                    }
                    // }
                    code = '';
                    reading = false;
                }, 400); //200 works fine for me but you can adjust it
            }
        });
    }

    private refreshToken() {
        this.clearRefreshToken();
        this.timeInterval = setInterval(() => {
            const tokenExpire = this.localStorageService.getTokenExpire();
            if (!tokenExpire) {
                try {
                    const now = moment();
                    const expire = moment(tokenExpire);
                    const expireSub5 = moment(tokenExpire).subtract('5', 'm');

                    if (now.isAfter(expire)) {
                        // เวลา ปัจจุบัน มากกว่า เวลาหมดอายุ
                        this.localStorageService.clearToken();
                        this.localStorageService.clearTokenExpire();
                    } else if (now.isAfter(expireSub5)) {
                        // เวลา ปัจจุบัน มากกว่า เวลาหมดอายุ-5นาที
                        const body: ReqRefreshToken = {
                            accessToken: this.localStorageService.getToken(),
                            refreshToken: this.localStorageService.getRefreshToken()
                        };
                        this.apiUser.userRefreshToken(body).subscribe(
                            (resp) => {
                                if (resp.resCode !== '0000') console.error('resCode error');
                                if (!resp.resData) console.error('resData null');
                                this.localStorageService.setToken(resp.resData.accessToken);
                                this.localStorageService.setRefreshToken(resp.resData.refreshToken);
                                this.localStorageService.setTokenExpire(resp.resData.expire);
                            },
                            (err) => {
                                console.error('userRefreshToken -> ', err);
                            }
                        );
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }, 5 * 60 * 1000);
    }

    private clearRefreshToken() {
        if (this.timeInterval !== null) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
    }
}
