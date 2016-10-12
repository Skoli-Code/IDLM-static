import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'idlmRef',
    templateUrl: './ref.component.html',
    styleUrls: ['./ref.component.scss']
})
export class RefComponent implements OnInit {
    @Input() ref: string;
    @Input() text: string;
    constructor() { }

    ngOnInit() {
    }

}
