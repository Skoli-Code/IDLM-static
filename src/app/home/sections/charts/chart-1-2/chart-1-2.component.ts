import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    Renderer

} from '@angular/core';
import { AxedChart, dateParser, LineChartNode, ScrollableChart } from '../charts';
import { DataLoaderService } from '../data-loader.service';

import { line, symbol } from 'd3-shape';
import { scaleLinear, ScaleLinear, scaleTime, scaleSequential } from 'd3-scale';
import { min } from 'd3-array';

import { Repartition } from '../repartition/repartition.component';

import { fixedWidthFadeRight } from '../../../../shared/animations';
import { EventType } from '../../../../shared/scroll-watcher.directive';

import * as _ from 'lodash'

interface Event {
    description: string,
    date: Date,
    link: string
}

const eqDates = (d1, d2)=>{ return d1.getTime() === d2.getTime()}

let sameMonth = (date1,date2)=>{
    return (date1.getMonth() == date2.getMonth()) && (date1.getFullYear() == date2.getFullYear());
};

let beginingOfTheMonth = (date)=>new Date(date.getFullYear(), date.getMonth(), 1);

let stepScale = function(steps, invertDateScale){
    let percentagesSteps = steps.map((step)=>{
        const p = invertDateScale(step.date);
        const domain = [p, p+2];
        return { static: true, domain: domain, scale:function(p){ return domain[0]; }};
    });
    let _steps = [];

    for(let i in percentagesSteps){
        let step = percentagesSteps[i];
        let nextStep = +i+1 < percentagesSteps.length ? percentagesSteps[+i+1]:null;

        let nextStepRange =  [step.domain[0], nextStep ? nextStep.domain[0]:100 ];
        let nextStepDomain = [step.domain[1], nextStep ? nextStep.domain[0]:100 ];
        // linear, from step.range[0]

        _steps.push({
            domain: nextStepDomain,
            scale: scaleLinear().domain(nextStepDomain).range(nextStepRange)
        });
        if(+i === 0){
            const previousStepDomain = [0, step.domain[0]];
            _steps.push({
                domain:previousStepDomain, scale: function(x){ return x; }
            });
        }
        _steps.push(step);
    }
    return scaleSequential((p)=>{
        let step = _steps.find(function(step){ return p < step.domain[1] && p >= step.domain[0] });
        return step ? step.scale(p) : p;
    });
};

@Component({
    selector: 'idlmChart-1-2',
    templateUrl: './chart-1-2.component.html',
    styleUrls: ['./chart-1-2.component.scss'],
    animations: [ fixedWidthFadeRight ]
})
export class Chart_1_2Component extends AxedChart implements ScrollableChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    heightForScrollWatcher: string = "20000px";
    dataCatalogKey: string = "1.2";
    progress:number=0;
    contextualData: {
        date: Date,
        titleOccurences: number,
        totalOccurences: number,
        corpus: Repartition
    };
    stepScale:any;

    private _visibilityClip: any;
    private _line: any;
    private lineData: any[];
    // events data and internal mixture
    private eventsData: any[];
    private _events: any;

    activeEvents: any[]=[];
    // active timestamp used to show events based on scroll position
    private activeTS: number = -1;
    // offset timestamp used to show events for a longer range of scrolling
    private offsetTS: number = -1;
    private lineDrawScale: ScaleLinear<any, any>;
    private invertDateScale: any;
    private previousPercentage: number = 0;

    constructor(protected renderer: Renderer, protected dataLoader: DataLoaderService) {
        super(renderer, dataLoader);
    }

    initData() {
        for (let i in this.data) {
            let sub = this.data[i];
            sub = sub.map((node) => {
                const date = dateParser(node.date);
                node.date = date;
                return node;
            });
        }
        this.lineData = this.data['occurrences'];
        this.eventsData = this.data['events'];
    }

    protected initScales() {
        super.initScales();
        this.invertDateScale = scaleTime().domain(this.xScale.domain()).range([0, 100]);
        this.stepScale = stepScale(this.eventsData, this.invertDateScale);
        this.lineDrawScale = scaleLinear().domain([0, 100]).range([0, this.size.inner.width]);
    }
    protected updateScales() {
        super.updateScales();
        this.lineDrawScale.range([0, this.size.inner.width]);
    }

    getMaxYValue() {
        return 4000;
    }

    getXValues() {
        return this.lineData.map((d) => d.date);
    }

    draw() {
        this.drawVisibilityClip();
        this.drawLine();
        this.drawEvents();
        this.drawAxes();
    }

    updateDraw() {
        this._line.transition().duration(100)
            .attr('d', this.lineFn());

        this._events.attr('transform', (date) => this.transformEvent(date));
        this._visibilityClip.attr('height', this.size.inner.height);

        this.setLineAt(this.previousPercentage);
    }

    private drawVisibilityClip(){
        this._visibilityClip = this._g.append('clipPath')
            .attr('id', 'visibilityClip')
            .append('rect')
            .attr('height', this.size.inner.height)
            .attr('width', 0);
    }

    private lineFn() {
        return line<LineChartNode>()
            .x((d) => this.xScale(d.date))
            .y((d) => this.yScale(d.value));
    }

    private drawLine() {
        this._line = this._g.append('path')
            .datum(this.lineData)
            .attr('class', 'line')
            .attr('clip-path', 'url(#visibilityClip)')
            .attr('d', this.lineFn());
    }

    private transformEvent(event) {
        let occurence = _.find(this.lineData, (node) => {
            return eqDates(node.date, event.date);
        }).value;
        return `translate(${this.xScale(event.date)}, ${this.yScale(occurence)})`;
    }

    private drawEvents() {
        // let dates = _.uniq(_.map(this.eventsData, (d) => d.date));
        this._events = this._g.selectAll('.event')
            .data(this.eventsData)
            .enter()
            .append('path').attr('class', 'event')
            .attr('d', symbol().size(60))
            .attr('transform', (event) => this.transformEvent(event));
    }
    private setLineAt(percentage: number) {
        let stepped_percentage = this.stepScale(percentage);
        console.log('in', percentage, stepped_percentage);
        let line_percentage = this.lineDrawScale(stepped_percentage);
        this._visibilityClip.attr('width', line_percentage);
        this.showEventsFor(stepped_percentage);

    }

    private showEventsFor(percentage: number) {
        // let isActive = (date, ts)=>{
        //     let ets = date.getTime();
        //     return sameMonth(new Date(this.activeTS), date) && ets >= ts;
        // };

        let activeDate = this.invertDateScale.invert(percentage);
        this.updateContextialValues(activeDate);
        let activeEvents = this._events.filter((event)=>eqDates(event.date, activeDate));
        this.activeEvents = activeEvents.data();
        this._events.classed('active',(event)=>eqDates(event.date, activeDate));
    }

    private updateContextialValues(date) {
        let data = null;
        let minDate = min(this.getXValues())
        date = date < minDate ? minDate : date;
        let values = _.find(this.lineData, (d) => sameMonth(d.date, date));
        let percScale = scaleLinear().domain([0, 1]).range([0, 70]);
        if (values) {
            data = {
                date: date,
                totalOccurences: values.value,
                titleOccurences: values.sub_values.title,
                corpus: _.pick(values.sub_values, ['lemonde', 'liberation', 'figaro'])
            }
            for (let i in data.corpus) {
                // compute percentage (actually it's between 0 and 75% percent)
                data.corpus[i] = percScale(data.corpus[i] / values.value);
            }
        }
        this.contextualData = data;
    }

    onScroll(event:EventType) {
        const percentage = event.percentage;
        if (!this.data) { return; }
        if (percentage == this.previousPercentage) { return; }
        this.progress = percentage;
        this.setLineAt(percentage);
        this.previousPercentage = percentage;
    }
}
