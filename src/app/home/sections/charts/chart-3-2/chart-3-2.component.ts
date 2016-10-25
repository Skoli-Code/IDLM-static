import { Component, Renderer } from '@angular/core';
// d3 imports
import { sum, max } from 'd3-array';
import {
    scaleQuantize, ScaleQuantize,
    scaleTime, ScaleTime,
    scaleLinear
} from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { transition } from 'd3-transition';

// internal imports
import { dateParser, AbstractChart, ScrollableChart } from '../charts';
import { DataLoaderService } from '../data-loader.service';
import { Repartition } from '../repartition/repartition.component';
import { _extent } from '../utils';

type Datum = [Date,number];

interface SourceDatum {
    occurences:number,
    source: string,
    sub_values: Array<Datum>
}

type adjectiveType = {
    name: string,
    repartition: Repartition,
    values:Array<SourceDatum>
};

@Component({
  selector: 'idlmChart-3-2',
  templateUrl: './chart-3-2.component.html',
  styleUrls: ['./chart-3-2.component.scss'],
})
export class Chart_3_2Component extends AbstractChart implements ScrollableChart {
    chartElement:any=null;

    dataCatalogKey:string='3.2';
    progress:number=0;
    sizeRatio: 0.4;
    heightForScrollWatcher:string="7000px";
    active:adjectiveType;

    private xScale: ScaleTime<any, any>;
    private adjScale:ScaleQuantize<any>;
    private _cells: any;
    private margins: {top:number, left:number, bottom:number, right:number};

    constructor(renderer:Renderer, dataLoader:DataLoaderService) {
        super(renderer, dataLoader);
    }

    initSVG(){
        this._svg = this._cells.selectAll('svg')
            .attr('width',  this.size.svg.width)
            .attr('height', this.size.svg.height);

        this._g = this._svg.append('g')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this._g.append('line').attr('class', 'axis')
            .attr('x1', 0)
            .attr('x2', this.size.inner.width)
            .attr('y1', this.size.inner.height)
            .attr('y2', this.size.inner.height);
    }

    initSizes(){
        let _holder = select('.chart-3-2');
        this._cells = _holder.selectAll('.chart-cell');
        this._cells.selectAll('svg').attr('width', 0).attr('height', 0);
        let node = this._cells.node();
        let width = Math.floor(node.getBoundingClientRect().width) * 0.66;
        let height = width * this.sizeRatio;
        this.margins = {
            top: 20, left: 0, right: 100, bottom: 20
        };

        this.size = {
            inner: {
                width: width - this.margins.left - this.margins.right,
                height: height - this.margins.top - this.margins.bottom
            },
            svg: { width: width, height: height }
        };
    }

    initData(){
        this.data = this.data.sort((a,b)=>a.order > b.order);
        this.data = this.data.map((adj)=>{
            // first loop to compute all total occurences & change structure
            adj.values = adj.values.map((src)=>{
                src.sub_values = src.sub_values.map(o=>{
                    o[0] = dateParser(o[0]);
                    return o;
                });
                src.occurences = sum(src.sub_values, (v)=>v[1]);
                return src;
            });
            // third and final loop to compute repartition
            let total = sum(adj.values, (d:SourceDatum)=>d.occurences);
            adj.repartition = {};
            adj.values.forEach((v)=>{
                adj.repartition[v.source] = (v.occurences*100)/total;
            });
            return adj;
        });
        let adj = this.data[0].name;
        this.setAdjectiveActive(adj);
    }

    activeFor(src:string){
        return this.active.values.find(v=>v.source==src);
    }

    setAdjectiveActive(name){
        this.active = this.data.find((adj)=>adj.name == name);
    }

    initScales(){
        let dates = this.data[0].values[0].sub_values.map(d=>d[0]);
        let adjectives = this.data.map((d)=>d.name)
        this.adjScale = scaleQuantize().domain([0,100]).range(adjectives);
        this.xScale = scaleTime().domain(_extent(dates)).range([0, this.size.inner.width]);
    }

    updateScales(){
        this.xScale.range([0, this.size.inner.width]);
    }

    updateCharts(){
        let t = transition('lineShift').duration(100);
        this.active.values.forEach(val=>{
            let data = val.sub_values;
            let domain = [0, max(val.sub_values.map((d)=>d[1]))];
            let yScale = scaleLinear()
                .domain(domain)
                .range([this.size.inner.height, 0]);

            let lineFn = line<Datum>()
                .x(d=>this.xScale(d[0]))
                .y(d=>yScale(d[1]));

            let _g = select(`.chart-cell--${val.source}`)
                .select('g');

            let _line = _g.selectAll('path')
                .data([data]);

            let _lineEnter = _line.enter().append('path').attr('d', lineFn);

            _line.transition(t).attr('d', lineFn);


        });
    }

    draw(){
        this.updateCharts();
    }

    updateDraw(){
        this._g.selectAll('line.axis')
            .attr('x1', 0)
            .attr('x2', this.size.inner.width)
            .attr('y1', this.size.inner.height)
            .attr('y2', this.size.inner.height);
    }

    onScroll(percentage:number){
        this.progress = percentage;
        if(!this.adjScale){ return; }
        var adj = this.adjScale(percentage);
        if(adj != this.active){
            this.setAdjectiveActive(adj);
            this.updateCharts();
        }
    }
}
