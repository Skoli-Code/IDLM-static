import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { select, Selection } from 'd3-selection';
import { line } from 'd3-shape';
import { scaleLinear, Linear } from 'd3-scale';
import { min, max } from 'd3-array';
import { AbstractChart } from '../../charts/charts';

import * as _ from 'lodash';

interface Node {
    date: Date;
    value: number;
}

@Component({
  selector: 'idlmChart-1-1',
  templateUrl: './chart-1-1.component.html',
  styleUrls: ['./chart-1-1.component.scss']
})
export class Chart_1_1Component extends AbstractChart implements OnInit {
    @Input() data: Object;
    @ViewChild('chartPlayground') svgRef: ElementRef;
    private debug: boolean = true;
    private _svg:  Selection;
    private _g:    Selection;
    private _line: Selection;
    private size: {width:number, height:number} = { width: 500, height: 320 };
    private valueScale: any;

    private scrollScales: {first:Linear<any>, second:Linear<any>, third:Linear<any>, fourth:Linear<any> } = {
        // first scale, percentage of line drawing.
        first: scaleLinear().domain([0,45]).range([0,100]),
        // second scale is to make "musulman" line dispappear (from top to bottom);
        second: scaleLinear().domain([45, 50]).range([0, 1000]),
        // third scroll scale is to make stacked area appears.
        third: scaleLinear().domain([50, 55]).range([0, 100]),
        // fourt scroll scale is to focus some specific areas in the graph
        // TODO: change 5 by the actual number of periods to focus on.
        fourth: scaleLinear().domain([55, 100]).range([0, 5])
    };

    heightForScrollWatcher:string = "4000px";

    initChart(){
        this.initSVG();
        this.initData();
        this.updateScales();
        this.draw();
    }

    private initSVG(){
        this._svg = select(this.svgRef.nativeElement);
        this._svg = this._svg
                .attr('width',  this.size.width )
                .attr('height', this.size.height );
        this._g   = this._svg.append('g');
    }
    private initData(){
        for (let i in this.data) {
            let _data = this.data[i];
            _data.values = _data.values.map((d:Node)=>{
                d.date = this.dateParser(d.date);
                return d;
            });
            this.data[i] = _data;
        }
        console.log('data initialized: ', this.data);
    }

    private updateScales(){
        let maxVal = -1;
        for (let i in this.data){
            let sub = this.data[i];
            for (let d of sub.values){
                maxVal = d.value > maxVal ? d.value : maxVal;
            }
        }
        this.dateScale = this.dateScale.range([0, this.size.width]);
        this.valueScale = scaleLinear()
            .domain([0, maxVal])
            .range([this.size.height, 0]);
    }
    private draw(){
        this.drawLines();
        // this.drawArea();
    }

    private drawLines(){
        _.map(_.toArray(this.data), (d)=>this.drawLine(d));
    }

    private drawLine(data:any){
        let line_fn = line()
            .x((d:Node)=>{ return this.dateScale(d.date) })
            .y((d:Node)=>{ return this.valueScale(d.value) });

        let color_class = data.line_color_class;
        this._line = this._g.append('path')
            .datum(data.values)
            .attr('fill', 'none')
            .attr('d', line_fn)
            .attr('class', `path ${color_class}`);

    }

    update(data:any){
    }

    onScroll(perc:number){
        // major steps:
        // - 0-45%   => draw 2 lines for our 2 dataset (islam & musulman)
        // - 45-50%  => make "musulman"'s line disappear (translate to bottom)
        // - 50-100% =>
    }
}
