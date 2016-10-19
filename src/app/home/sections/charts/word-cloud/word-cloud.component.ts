import { Component, Input, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import * as d3_cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { scaleLinear, ScaleLinear, scaleSequential, ScaleSequential } from 'd3-scale';
import { interpolateGreys } from 'd3-scale-chromatic';
import { extent } from 'd3-array';

import { AbstractChart, sizeType } from '../charts';
import { DataLoaderService } from '../data-loader.service';

export type wordDataType = {text:string, size:number};

@Component({
  selector: 'idlmWordCloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent extends AbstractChart {
    private cloudLayout:Cloud<cloud.Word>;
    private words:Array<wordDataType>;
    private fontScale:ScaleLinear<number,number>;
    private fillScale:ScaleSequential<any>;
    private _texts:any;

    @ViewChild('chartPlayground') chartElement: ElementRef;
    @Input('fontScale') fontScaleDomain: number[]=[6,100];
    @Input() wordFont:string='Impact';
    @Input() wordPadding:number=4;
    @Input() wordRotation:number=0;
    @Input() dataCatalogKey:string;
    @Input() ratio:number=0.7;

    constructor(renderer:Renderer, dataLoader:DataLoaderService){
        super(renderer, dataLoader);
    }

    initScales(){
        let domain = extent(this.words.map((w)=>w.size));
        this.fontScale = scaleLinear().domain(domain).range(this.fontScaleDomain);
        this.fillScale = scaleSequential(interpolateGreys).domain([0, this.fontScaleDomain[1] + 30]);
    }

    updateScales(){
    }

    bindEvents(){
        super.bindEvents();
        this.cloudLayout.on('end', ()=>this.onLayoutDone());
    }

    initSVG(){
        let _sizes = this.size.svg;
        let sizes = [_sizes.width, _sizes.height];

        this.cloudLayout = d3_cloud()
            .size(sizes)
            .padding(this.wordPadding)
            .rotate(this.wordRotation)
            .words(this.words)
            .fontSize((d)=>this.fontScale(d.size));

        this._svg = select(this.chartElement.nativeElement);
        this._svg
            .attr('width',  sizes[0])
            .attr('height', sizes[1]);

        this._g = this._svg.append('g')
            .attr('transform', (d)=>`translate(${sizes[0]/2}, ${sizes[1]/2})`);
    }

    initData(){
        this.words = this.data.map((d)=>{
            return {text:d[0], size:d[1]}
        });
    }

    initSizes(){
        let parent = this.chartElement.nativeElement.parentNode.parentNode;
        let bbox = parent.getBoundingClientRect();
        this.size = { svg: { width: bbox.width, height: bbox.width * this.ratio }};
    }

    draw(){
        this.cloudLayout.start();
    }
    updateSVG(){
        this._svg.attr('width',this.size.svg.width)
                 .attr('height', this.size.svg.height);

    }
    updateDraw(){
        let _sizes = this.size.svg;
        let sizes = [_sizes.width, _sizes.height];

        this.cloudLayout.size(sizes)
            .fontSize((d)=>this.fontScale(d.size))
            .on('end',()=>{
                this._texts.attr('transform', (d)=>`translate(${[d.x, d.y]})rotate(${d.rotate})`)
                    .style('fill',      (d)=>this.fillScale(d.size + 30))
                    .style('font-size', (d)=>d.size + "px");
            })
            .start();
    }

    onLayoutDone(){
        this._texts = this._g.selectAll('text').data(this.words);

        this._texts.enter().append("text")
            .attr('transform', (d)=> `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .style('font-size', (d)=> d.size + 'px')
            .style('font-family', 'PT Serif')
            .style('fill', (d)=>this.fillScale(d.size + 30))
            .attr('text-anchor', 'middle')
            .text(function(d) { return d.text; })
            .attr('transform',  (d)=>`translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .style('fill',      (d)=>this.fillScale(d.size + 30))
            .style('font-size', (d)=>d.size + "px");

    }

}
