import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { AbstractChart } from '../../charts/charts';

@Component({
  selector: 'idlmChart-2-2',
  templateUrl: './chart-2-2.component.html',
  styleUrls: ['./chart-2-2.component.css']
})
export class Chart_2_2Component extends AbstractChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    dataCatalogKey:string="2.2";

    initChart(){
    }
    initData(){
    }
    updateScales(){
    }
    draw(){
    }
}
