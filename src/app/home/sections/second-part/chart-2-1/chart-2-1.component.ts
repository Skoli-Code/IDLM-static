import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { AbstractCloudChart } from '../../charts/word-cloud.chart';
import { cloud } from 'd3-cloud';

@Component({
  selector: 'idlmChart-2-1',
  templateUrl: './chart-2-1.component.html',
  styleUrls: ['./chart-2-1.component.scss']
})
export class Chart_2_1Component extends AbstractChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    dataCatalogKey:string="2.1";
    abstract words:wordDataType[];

    initData(){
        this.words = this.data.map((d)=>{text:d[0], size:d[1]});
    }

    updateScales(){
    }

    draw(){
        this.cloud.start();
    }
}
