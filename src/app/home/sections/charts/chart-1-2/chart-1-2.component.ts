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
import { scaleLinear, ScaleLinear, scaleTime } from 'd3-scale';
import { min } from 'd3-array';

import { Repartition } from '../repartition/repartition.component';

import { fixedWidthFadeRight } from '../../../../shared/animations';
import * as _ from 'lodash'

interface Event {
    description: string,
    date: Date,
    link: string
}

let sameMonth = (d1,d2)=>{
    return (d1.getMonth() == d2.getMonth()) && (d1.getFullYear() == d2.getFullYear());
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
            sub = sub.map((d) => {
                d.date = dateParser(d.date);
                return d;
            });
        }
        this.lineData = this.data['occurrences'];
        this.eventsData = this.data['events'];
    }

    protected initScales() {
        super.initScales();
        this.invertDateScale = scaleTime().domain(this.xScale.domain()).range([0, 100]);
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

        this._events.attr('transform', (d) => this.transformEvent(d));
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

    private transformEvent(d) {
        let occurence = _.find(this.lineData, (el) => {
            return el.date.getTime() == d.getTime();
        }).value;
        return `translate(${this.xScale(d)}, ${this.yScale(occurence)})`;
    }

    private drawEvents() {
        let dates = _.uniq(_.map(this.eventsData, (d) => d.date));
        this._events = this._g.selectAll('.event')
            .data(dates)
            .enter()
            .append('path').attr('class', 'event')
            .attr('d', symbol().size(60))
            .attr('transform', (d) => this.transformEvent(d));
    }
    private setLineAt(percentage: number) {
        let line_percentage = this.lineDrawScale(percentage);
        this._visibilityClip.attr('width', line_percentage);
    }

    private showEventsFor(percentage: number) {
        let isActive = (date, ts)=>{
            let ets = date.getTime();
            return sameMonth(new Date(this.activeTS), date) && ets >= ts;
        };

        let date = this.invertDateScale.invert(percentage);
        let ts = date.getTime();
        let offsetTS = 120 * 86400 * 1000;
        this.updateContextialValues(date);

        // first filtering to guess what the next events will be
        let events = _.filter(this.eventsData, (d) => sameMonth(d.date, date));
        if (events.length) {
            this.activeTS = ts;
            this.offsetTS = this.activeTS + offsetTS; // nb of days * a day in seconds * 1000ms
        }

        // 2. we need to show the events actually after reaching their points :3
        this.activeEvents = _.filter(this.eventsData, (e)=>isActive(e.date, ts));
        this._events.classed('active',(e)=>isActive(e, ts));

        // 3. If we go too far away from the limits we need to hide events
        if(ts > this.offsetTS || ts < this.activeTS){
            this.activeEvents = [];
            this.activeTS = -1;
            this.offsetTS = -1;
            this._events.classed('active',false);
        }

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

    onScroll(percentage: number) {
        if (!this.data) { return; }
        if (percentage == this.previousPercentage) { return; }
        this.progress = percentage;
        this.setLineAt(percentage);
        this.showEventsFor(percentage);
        this.previousPercentage = percentage;
    }
}
