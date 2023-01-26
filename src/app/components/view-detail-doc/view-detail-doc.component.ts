import {ResDocumentFindOne} from './../../services/api/api-document/interfaces/document-findone.interface';
import {Component, Input, OnInit} from '@angular/core';
import {ApiDocumentService} from '@services/api/api-document/api-document.service';
import {ResDocumentFindOneResData} from '@services/api/api-document/interfaces/document-findone.interface';
import * as _async from 'async';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
@Component({
    selector: 'app-view-detail-doc',
    templateUrl: './view-detail-doc.component.html',
    styleUrls: ['./view-detail-doc.component.scss']
})
export class ViewDetailDocComponent implements OnInit {
    @Input() documentId: string;

    public data: ResDocumentFindOneResData = null;
    public imageShow: string = '';
    public pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

    constructor(private apiDocumentService: ApiDocumentService, private modalService: NgbModal, private router: Router) {}

    async ngOnInit() {
        const x = await this.loadDocument();
    }

    loadDocument(): Promise<ResDocumentFindOne> {
        return new Promise((resolve, reject) => {
            this.apiDocumentService.documentFindOne(this.documentId).subscribe(
                (resp) => {
                    if (resp.resCode !== '0000') {
                        return;
                    }
                    this.data = resp.resData;
                    return resolve(resp);
                },
                (err) => {
                    return reject(err);
                }
            );
        });
    }

    openViewer(content: any, path: any) {
        // this.router.navigateByUrl(this.pdfSrc);
        const typeFile = path.split('.');
        this.imageShow = '';

        console.log('typeFile->', typeFile[typeFile.length - 1]);
        switch (typeFile[typeFile.length - 1].toLowerCase()) {
            case 'pdf':
                window.open(path, '_blank');
                break;
            case 'jpg':
                // console.log('.JPG');
                this.imageShow = path;
                this.modalService.open(content, {size: 'lg'});
                break;
            case 'jpeg':
                // console.log('.JPEG');
                this.imageShow = path;
                this.modalService.open(content, {size: 'lg'});
                break;
            case 'png':
                // console.log('.PNG');
                this.imageShow = path;
                this.modalService.open(content, {size: 'lg'});
                break;
        }
    }
}
