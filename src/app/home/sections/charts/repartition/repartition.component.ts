import { Component, OnInit, Input } from '@angular/core';

export interface Repartition {
    lemonde:number,
    figaro:number,
    liberation:number
}

@Component({
    selector: 'idlmRepartitionChart',
    templateUrl: './repartition.component.html',
    styleUrls: ['./repartition.component.scss']
})
export class RepartitionComponent implements OnInit {
    @Input() repartition: Repartition;
    constructor() { }
    ngOnInit() {
    }
}
