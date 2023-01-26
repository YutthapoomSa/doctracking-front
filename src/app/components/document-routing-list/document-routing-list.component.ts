import {Component, Input, OnInit} from '@angular/core';
import {AppService} from '@services/app.service';
import {ResDocumentRoutingListRender} from '@services/interfaces/document-routing-list.interface';

@Component({
    selector: 'app-document-routing-list',
    templateUrl: './document-routing-list.component.html',
    styleUrls: ['./document-routing-list.component.scss']
})
export class DocumentRoutingListComponent implements OnInit {
    @Input() routingList;
    public currentIndex = null;

    constructor(private appService: AppService) {}

    async ngOnInit() {}

    openCollapse(index: number) {
        if (this.currentIndex === index && this.routingList[index].isCollapse !== false) {
            this.routingList[index].isCollapse = false;
        } else {
            for (const [i, item] of this.routingList.entries()) {
                if (i === index) {
                    item.isCollapse = true;
                    this.currentIndex = i;
                }
                // else {
                //     item.isShow = false;
                // }
            }
        }
    }

    closeModal(isClose: boolean) {}
}
