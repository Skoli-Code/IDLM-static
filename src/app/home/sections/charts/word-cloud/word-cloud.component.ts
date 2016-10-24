import { Component, Input, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import * as d3_cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { scaleLinear, ScaleLinear, scaleSequential, ScaleSequential } from 'd3-scale';
import { interpolateGreys } from 'd3-scale-chromatic';
import { extent } from 'd3-array';
import * as _ from 'lodash';

import { AbstractChart, sizeType } from '../charts';
import { DataLoaderService } from '../data-loader.service';

export type wordDataType = {text:string, size:number};

@Component({
  selector: 'idlmWordCloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudComponent extends AbstractChart {
    private words:Array<wordDataType>;
    private fontScale:ScaleLinear<number,number>;
    private fillScale:ScaleSequential<any>;
    private _texts:any;

    @ViewChild('chartPlayground') chartElement: ElementRef;
    @Input() wordFont:string='Impact';
    @Input() wordPadding:number=4;
    @Input() wordRotation:number=0;
    @Input() wordScale:[number, number];
    @Input() dataCatalogKey:string;
    @Input() ratio:number=0.7;

    constructor(renderer:Renderer, dataLoader:DataLoaderService){
        super(renderer, dataLoader);
    }

    fontScaleRange(){
        if(this.wordScale){
            return this.wordScale;
        }
        let maxFontSize = this.size.svg.width / 8;
        return [6, maxFontSize];
    }

    initScales(){
        let domain = extent(this.words.map((w)=>w.size));
        let range = this.fontScaleRange();
        this.fontScale = scaleLinear().domain(domain).range(range);
        this.fillScale = scaleSequential(interpolateGreys).domain([0, (range[1] + 30)]);
    }

    updateScales(){
        let range = this.fontScaleRange();
        this.fontScale.range(range);
        this.fillScale.domain([0, (range[1] + 30)]);
    }

    initSVG(){
        let _sizes = this.size.svg;
        let sizes = [_sizes.width, _sizes.height];

        this._svg = select(this.chartElement.nativeElement);
        this._svg
            .attr('width',  sizes[0])
            .attr('height', sizes[1]);

        this._g = this._svg.append('g')
            .attr('transform', (d)=>`translate(${sizes[0]/2}, ${sizes[1]/2})`);


    }

    updateSVG(){
        this._svg.attr('width',this.size.svg.width)
                 .attr('height', this.size.svg.height);

        this._g.attr('transform', (d)=>`translate(${this.size.svg.width/2}, ${this.size.svg.height/2})`);

    }

    initData(){
        this.words = this.data.map((d)=>{
            return {text:d[0], size:d[1]}
        });
    }

    initSizes(){
        let style = window.getComputedStyle(this.chartElement.nativeElement.parentNode, null);
        let width = +style.width.slice(0, -2);
        let height= +style.height.slice(0, -2);
        width -= +style.paddingLeft.slice(0, -2);
        width -= +style.paddingRight.slice(0, -2);
        let innerHeight = width * this.ratio;
        if(width < 610){
            innerHeight = height;
        }
        this.size = { svg: { width: width, height: height }, inner: { width: width, height: innerHeight }};
    }

    cloud(){
        let sizes = [this.size.inner.width, this.size.inner.height];
        return d3_cloud()
            .size(sizes)
            .font('PT Serif')
            .padding(this.wordPadding)
            .rotate(this.wordRotation)
            .words(_.cloneDeep(this.words))
            .on('end', (d)=> this.onLayoutDone(d))
            .fontSize((d)=>this.fontScale(d.size));
    }

    draw(){
        this.cloud().start();
    }
    resize(e:any){
        this._svg.attr('width', 0).attr('height', 0);
        super.resize(e);
    }

    updateDraw(){
        this.cloud().start();
    }

    onLayoutDone(data){
        this._g.selectAll('text').remove();
        let texts = this._g.selectAll('text').data(data);
        // texts.exit().remove();
        texts.enter().append("text")
            .attr('text-anchor', 'middle')
            .attr('transform', (d)=> `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .style('font-family', 'PT Serif')
            .style('fill', (d)=>this.fillScale(d.size + 30))
            .style('font-size', (d)=> d.size + 'px')
            .text(function(d) { return d.text; });

    }

}
