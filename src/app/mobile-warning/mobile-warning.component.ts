import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'idlmMobileWarning',
    templateUrl: './mobile-warning.component.html',
    styleUrls: ['./mobile-warning.component.scss']
})
export class MobileWarningComponent implements OnInit {
    hidden:boolean=false;
    constructor() { }
    ngOnInit() {
    }

    hide(){
        this.hidden = true;
    }

}
