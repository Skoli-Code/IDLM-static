import { Component, Renderer, ElementRef } from '@angular/core';
import { AbstractChart } from '../charts';
import { DataLoaderService } from '../data-loader.service';

@Component({
  selector: 'idlmChart-3-2',
  templateUrl: './chart-3-2.component.html',
  styleUrls: ['./chart-3-2.component.scss']
})
export class Chart_3_2Component extends AbstractChart {
    dataCatalogKey:string='3.2';
    chartElement:any=null;

    constructor(renderer:Renderer, dataLoader:DataLoaderService) {
        super(renderer, dataLoader);
    }
    initSVG(){

    }
    initData(){

    }
    updateScales(){

    }
    draw(){

    }

}
