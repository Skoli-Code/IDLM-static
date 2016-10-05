import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { DataLoaderService } from '../charts/data-loader.service';

@Component({
    selector: 'idlm-first-part',
    templateUrl: './first-part.component.html',
    styleUrls: ['./first-part.component.scss'],
})
export class FirstPartComponent implements OnInit {
    progressPercentage: number;
    heightForScrollWatcher: string = "8000px";

    chart_1_1_data: Object;
    chart_1_2_data: Object;

    constructor(private dataLoader:DataLoaderService){
    }

    ngOnInit() {
        this.chart_1_1_data = this.dataLoader.get('1.1');
        this.chart_1_2_data = this.dataLoader.get('1.2');
    }


    onScrollSecondChart(perc:number){
        this.progressPercentage = perc;
    }
}
