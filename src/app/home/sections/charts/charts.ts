import { OnInit, Renderer, ViewChild, ElementRef, Component} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { extent } from 'd3-array';
import { scaleLinear, scaleTime, ScaleTime } from 'd3-scale';
import { select, Selection } from 'd3-selection';
import { timeParse, timeFormat } from 'd3-time-format';
import { axisLeft, axisBottom, Axis } from 'd3-axis';

import { DataLoaderService } from './data-loader.service';

export interface LineChartNode {
    date: Date;
    value: number;
}

export interface ScrollableChart {
    onScroll(percentage:number):void;
    heightForScrollWatcher:string;
}

export var dateParser = timeParse('%Y/%m/%d');

export type marginType = {top:number, bottom:number, left: number, right: number };
export type sizeType = {width:number, height:number};

export abstract class AbstractChart implements OnInit {
    protected dynamicWidth: boolean = false;
    protected sizeRatio:number=0.66;
    protected size: {svg:sizeType, inner:sizeType};
    protected _svg: any;
    protected _g:   any;
    protected margin: marginType = {top: 0, bottom: 0, left:0, right: 0};

    data: any;
    abstract chartElement: ElementRef;
    protected abstract dataCatalogKey: string;

    abstract draw():void;
    abstract initData():void;
    protected abstract updateScales(): void;

    constructor(protected renderer:Renderer, protected dataLoader:DataLoaderService){
        this.dataLoader = dataLoader;
        this.renderer = renderer;
    }

    ngOnInit(){
        this.dataLoader.load(this.dataCatalogKey).subscribe((data)=>{
            this.data = data;
            this.initSizes();
            this.initData();
            this.updateScales();
            this.initSVG();
            this.bindEvents();
            this.draw();
            return data;
        });
    }
    bindEvents(){
        if(this.dynamicWidth){
            this.renderer.listen(window, 'resize', (e)=>this.resize(e));
        }
    }

    resize(e:any){
        this.initSizes();
        this.updateScales();
    }

    initSizes(){
        let parent = this.chartElement.nativeElement.parentNode;
        let width  = Math.floor(parent.getBoundingClientRect().width);
        let height = width * this.sizeRatio;
        this.size = {
            svg: {
                width:  width,
                height: height
            },
            inner: {
                width:  width  - this.margin.left - this.margin.right,
                height: height - this.margin.top  - this.margin.bottom
            }
        };
    }

    initSVG(){
        this._svg = select(this.chartElement.nativeElement);
        this._svg = this._svg
                .attr('width',  this.size.svg.width)
                .attr('height', this.size.svg.height);
        this._g = this._svg.append('g');
        this._g.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

}


export abstract class AxedChart extends AbstractChart {
    debug:boolean=false;
    // d3 axes
    protected xAxis:Axis<any>;
    protected yAxis:Axis<any>;
    // selection of axes
    protected _xAxis:any;
    protected _yAxis:any;

    protected xScale: any;
    protected yScale: any;

    protected abstract getMaxYValue(): number;
    protected abstract getXValues(): any[];
    protected margin: marginType = {top: 10, bottom: 25, left:50, right: 15};

    resize(e:any){
        super.resize(e);
        this.updateAxis();
    }

    drawAxes(){
        let _d = (y)=>(new Date(y, 12, 0));
        let xTicksValues = [];
        for(let i = 1997; i < 2016; i++){
            xTicksValues.push(_d(i));
        }

        // TODO: improve ticks thanks to: http://fiddle.jshell.net/zUj3E/1/
        this.xAxis = axisBottom(this.xScale);
        this.yAxis = axisLeft(this.yScale);
        this._xAxis = this._g.append('g')
            .attr('class','axis axis--x')
            .attr('transform', `translate(0, ${this.size.inner.height})`)
            .call(this.xAxis.ticks(17)
                .tickValues(xTicksValues)
                .tickFormat(timeFormat("%Y"))
            );
        this._xAxis.selectAll('.tick').each(function(){
            let tick = select(this);
            let text = tick.select('text');
            let val  = +text.text();
            if(val%5==0){
                let y = 12;
                text.attr('y', y + 3);
                tick.select('line').attr('y2', y);
            } else {
                text.remove();
            }
        });

        this._yAxis = this._g.append('g')
            .attr('class','axis axis--y')
            .call(this.yAxis.ticks(6));
    }

    protected updateScales(){
        this.yScale = scaleLinear()
            .domain([0, this.getMaxYValue()])
            .range([this.size.inner.height, 0]);

        let xDomain = extent(this.getXValues());
        this.xScale = scaleTime()
            .domain(xDomain)
            .range([0, this.size.inner.width]);
    }

    updateAxis(){
        this._xAxis.call(this.xAxis);
        this._yAxis.call(this.yAxis);
    }
}
