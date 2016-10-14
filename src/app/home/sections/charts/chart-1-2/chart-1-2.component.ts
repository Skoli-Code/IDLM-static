import { Component, Input, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AxedChart, dateParser, LineChartNode, ScrollableChart } from '../charts';
import { DataLoaderService } from '../data-loader.service';

import {line, symbol} from 'd3-shape';
import {scaleLinear, ScaleLinear, scaleTime} from 'd3-scale';
import {max} from 'd3-array';

import { Repartition } from '../repartition/repartition.component';

interface Event {
    description:string,
    date:Date,
    link:string
}

@Component({
  selector: 'idlmChart-1-2',
  templateUrl: './chart-1-2.component.html',
  styleUrls: ['./chart-1-2.component.scss']
})
export class Chart_1_2Component extends AxedChart implements ScrollableChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    heightForScrollWatcher:string = "12000px";
    activeEvents: any[];
    dataCatalogKey:string="1.2";

    contextualData: {
        date: Date,
        titleOccurences:number,
        totalOccurences:number,
        corpus: Repartition
    };

    private _visibilityClip: any;
    private _line: any;
    private _events: any;
    private lineData: any[];
    private eventsData: any[];
    private active_ts: number;
    private offset_ts: number;
    private lineDrawScale: ScaleLinear<any, any>;
    private invertDateScale: any;
    private previousPercentage: number=0;
    private lineStrokeDasharray: number=4500;
    debug:boolean=true;


    constructor(protected renderer:Renderer, protected dataLoader:DataLoaderService){
        super(renderer, dataLoader);
    }

    initData(){
        for(let i in this.data){
            let sub = this.data[i];
            sub = sub.map((d)=>{
                d.date = dateParser(d.date);
                return d;
            });
        }
        this.lineData = this.data['occurrences'];
        this.eventsData = this.data['events'];
    }

    protected updateScales(){
        super.updateScales();
        this.invertDateScale = scaleTime().domain(this.xScale.domain()).range([0, 100]);
        this.lineDrawScale = scaleLinear().domain([0,100]).range([0, this.size.inner.width]);
    }

    getMaxYValue(){
        return 4000;
    }

    getXValues(){
        return this.lineData.map((d)=>d.date);
    }

    draw(){
        this.drawVisibilityClip();
        this.drawLine();
        this.drawEvents();
        this.drawAxes();
    }

    private drawVisibilityClip(){
        this._visibilityClip = this._g.append('clipPath').attr('id', 'visibilityClip')
            .append('rect').attr('height', this.size.inner.height).attr('width',0);
    }

    private drawLine(){
        let line_fn = line<LineChartNode>()
            .x((d)=>this.xScale(d.date))
            .y((d)=>this.yScale(d.value));

        this._line = this._g.append('path')
            .datum(this.lineData)
            .attr('class', 'line')
            .attr('clip-path', 'url(#visibilityClip)')
            .attr('d', line_fn);
    }

    private drawEvents(){
        let dates = _.uniq(_.map(this.eventsData, (d)=>d.date));
        this._events = this._g.selectAll('.event').data(dates)
            .enter()
            .append('path').attr('class', 'event')
            .attr('d', symbol().size(60))
            .attr('transform', (d)=>{
                let occurence = _.find(this.lineData, (el)=>{
                    return el.date.getTime() == d.getTime();
                }).value;
                return `translate(${this.xScale(d)}, ${this.yScale(occurence)})`;
            });
    }
    private setLineAt(percentage:number){
        let line_percentage = this.lineDrawScale(percentage);
        this._visibilityClip.attr('width', line_percentage);
    }

    private showEventsFor(percentage:number){
        let _i     = this.invertDateScale.invert;
        let _d     = (d)=>(new Date(d.getFullYear(), d.getMonth(), 0));
        let date   = _i(percentage);
        this.updateContextalValues(_d(date));

        let ts     = date.getTime();
        // first filtering to guess what the next events will be
        let events = _.filter(this.eventsData, (d)=>{
            return d.date.getTime() == _d(date).getTime()
        });
        if(events.length){
            this.active_ts = events[0].date.getTime();
            this.offset_ts = this.active_ts + 120 * 86400 * 1000; // nb of days * a day in seconds * 1000ms
        }
        if(this.active_ts && ts > this.active_ts && ts < this.offset_ts){
            this.activeEvents = _.filter(this.eventsData, (d)=>d.date.getTime()==this.active_ts);
        }
        if(ts > this.offset_ts || ts < this.active_ts){
            this.activeEvents = [];
        }

        let _activeEvents = this._events.classed('active', (d)=>{
            if(this.active_ts){
                return d.getTime() == this.active_ts && date.getTime() <= this.offset_ts && ts > this.active_ts;
            } else {
                return false;
            }
        });
    }

    private updateContextalValues(date){
        let data   = null;
        let values = _.find(this.lineData, (d)=>d.date.getTime() == date.getTime());
        let percScale = scaleLinear().domain([0,1]).range([0, 70]);
        if(values){
            data = {
                date: date,
                totalOccurences:values.value,
                titleOccurences:values.sub_values.title,
                corpus:_.pick(values.sub_values, ['lemonde', 'liberation', 'figaro'])
            }
            for(let i in data.corpus){
                // compute percentage (actually it's between 0 and 75% percent)
                data.corpus[i] = percScale(data.corpus[i] / values.value);
            }
        }
        this.contextualData = data;

    }



    onScroll(percentage:number){
        if(!this.data){ return; }
        if(percentage == this.previousPercentage){ return; }
        this.setLineAt(percentage);
        this.showEventsFor(percentage);
        this.previousPercentage = percentage;
    }
}
