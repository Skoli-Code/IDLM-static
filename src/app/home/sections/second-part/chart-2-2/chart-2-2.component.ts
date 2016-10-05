import { Component, Input, ElementRef, ViewChild, Renderer } from '@angular/core';
import { AbstractChart } from '../../charts/charts';
import { DataLoaderService } from '../../charts/data-loader.service';

@Component({
  selector: 'idlmChart-2-2',
  templateUrl: './chart-2-2.component.html',
  styleUrls: ['./chart-2-2.component.css']
})
export class Chart_2_2Component extends AbstractChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    dataCatalogKey:string="2.2";


    constructor(renderer:Renderer, dataLoader:DataLoaderService){
        super(renderer, dataLoader);
    }

    initChart(){
    }
    initData(){
    }
    updateScales(){
    }
    draw(){
    }
}
