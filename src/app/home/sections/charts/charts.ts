import { OnInit } from '@angular/core';
import { scaleTime, Time } from 'd3-scale';
import { timeParse } from 'd3-time-format';

import { DataType } from './data-loader.service';

let d = (y,m,d)=>new Date(y, m, d);

export var dateScale:Time = scaleTime().domain([ d(1997, 1, 1), d(2015, 11, 31)]);

export abstract class AbstractChart implements OnInit {
    abstract data: any;
    dateScale:  Time;
    dateParser: Function;

    constructor(){
        this.dateParser = timeParse('%Y/%m/%d');
        this.dateScale  = dateScale;
    }
    ngOnInit(){
        this.initChart();
    }

    abstract initChart(): any;
    abstract update(data: any): any;
}
