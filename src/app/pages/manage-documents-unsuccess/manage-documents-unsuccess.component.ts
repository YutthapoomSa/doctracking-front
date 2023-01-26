import {Component, OnInit} from '@angular/core';
import dayjs from 'dayjs';
@Component({
    selector: 'app-manage-documents-unsuccess',
    templateUrl: './manage-documents-unsuccess.component.html',
    styleUrls: ['./manage-documents-unsuccess.component.scss']
})
export class ManageDocumentsUnsuccessComponent implements OnInit {
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
    constructor() {}

    ngOnInit(): void {}
}
