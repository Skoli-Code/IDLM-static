import { Component, Input, Renderer, ViewChild, ElementRef } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
// d3 imports
import { select } from 'd3-selection';
import { line, stack, area } from 'd3-shape';
import { scaleLinear, ScaleLinear, scaleQuantize, ScaleQuantize, ScaleTime } from 'd3-scale';
import { max, range } from 'd3-array';
import { entries } from 'd3-collection';
import { transition } from 'd3-transition';

// internal
import { PERIODS, IPeriod } from './periods.constant';
import { AxedChart, dateParser, LineChartNode, ScrollableChart } from '../charts';
import { DataLoaderService } from '../data-loader.service';
import { fadeDown } from '../../../../shared/animations';

interface State {
    domain: any[],
    range: any[],
    scale: ScaleLinear<any,any>|ScaleQuantize<any>
};

interface StateObject {
    lines: State,
    removeLines: State,
    areas: State,
    focusPeriods: State
};

@Component({
  selector: 'idlmChart-1-1',
  templateUrl: './chart-1-1.component.html',
  styleUrls: ['./chart-1-1.component.scss'],
  animations: [ fadeDown() ]
})
export class Chart_1_1Component extends AxedChart implements ScrollableChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    // template attributes
    hideFirstContent: boolean = false;
    heightForScrollWatcher:string = "8000px";
    dataCatalogKey:string="1.1";
    currentState:State;
    states: StateObject;
    legends = {
        lines: 0,
        areas: 1
    };
    legend:number;

    private areaData: any;
    private previousPercentage: number = 0;
    private previousPeriodNumber: number = null;
    private focusShown:boolean=false;

    // d3 graphic elements
    private _area:      any;
    private _focusArea: any;
    private _focusRect: any;
    private _clip:      any;
    private _lines:     any;

    protected yScale: ScaleLinear<any,any>;
    protected xScale: ScaleTime<any,any>;

    private periodsData: IPeriod[];
    periodContent:SafeHtml = null;

    constructor(protected renderer:Renderer, protected dataLoader:DataLoaderService){
        super(renderer, dataLoader);
    }

    isLines(){
        return this.legend == this.legends.lines
    }

    isAreas(){
        return this.legend == this.legends.areas
    }

    draw(){
        this.drawLines();
        this.drawClip();
        this.drawStackedArea(this.areaData.values);
        this.drawFocusRect();
        this.drawAxes();
    }

    updateDraw(){
        this._lines.selectAll('path').attr('d', (d)=>this.lineFn(d.value.values));
        this._focusRect.attr('height', this.size.inner.height);
        this._clip.attr('height', this.size.inner.height);
        this._focusArea.attr('d', this.drawAreaWithPerc(100));
        this.onScroll(this.previousPercentage, true);
    }

    initData(){
        for (let i in this.data) {
            let _data = this.data[i];
            _data.values = _data.values.map((d)=>{
                d.date = dateParser(d.date);
                return d;
            });
        }
        this.areaData = this.data['islam'];
        // TODO: une fois les périodes éditorialisées et rajoutées dans les
        // données, les utiliser ici.
        this.periodsData = PERIODS;
        this.initStates();
    }
    private initStates(){
        this.states = {
            // lines scale, percentage of line drawing.
            lines: {
                domain: [0, 20],
                range: [2000, 0],
                scale: scaleLinear()
            },
            // removeLines scale is to make "musulman" line dispappear (from top to bottom);
            removeLines: {
                domain: [20, 25],
                range: [0, -1000],
                scale: scaleLinear()
            },
            // areas scroll scale is to make stacked area appears.
            areas: {
                domain: [20, 25],
                range: [0, 100],
                scale: scaleLinear()
            },
            // focus some specific areas in the graph
            focusPeriods: {
                domain: [25, 100],
                range: range(this.periodsData.length),
                scale: scaleQuantize()
            }
        }

        for(let i in this.states){
            let state = this.states[i];
            state.scale = state.scale
                .domain(state.domain)
                .range(state.range);
        }

        if(this.previousPercentage == 0){
            this.currentState = this.states.lines;
        }

    }
    getMaxYValue(){
        return 24000;
    }
    getXValues():any[]{
        let values = [];
        for( let i in this.data){
            for(let d of this.data[i].values){
                values.push(d.date);
            }
        }
        return values;
    }
    private lineFn(values){
        return line<LineChartNode>()
            .x((d)=>{
                return this.xScale(d.date);
            })
            .y((d)=>{
                return this.yScale(d.value);
            })(values);
    }
    private drawLines(){
        this._lines = this._g.selectAll('.line')
            .data(entries(this.data))
            .enter().append('g').attr('class', 'line');

        this._lines
                .append('path')
                .attr('fill', 'none')
                .attr('d', (d)=>this.lineFn(d.value.values))
                .attr('stroke-dasharray', 2000)
                .attr('stroke-dashoffset', 2000)
                .attr('class', (d)=>{
                    return `line ${d.key}`;
                });
    }
    private stacks(data){
        let stack_fn = stack()
            .keys(['figaro', 'lemonde', 'liberation'])
            .value((d,key)=>{
                return d['sub_values'][key];
            });
        return stack_fn(data);
    }
    private drawStackedArea(data){
        let stacked_data = this.stacks(data);
        // first area draw for the "normal" area
        this._area = this._g.append('g').attr('class', 'area-group regular');
        this._area.selectAll('path.area.regular')
            .data(stacked_data)
            .enter()
                .append('path').attr('class', (d)=>`area regular ${d.key}`)
                .attr('d', this.drawAreaWithPerc(0));

        // 2nd path creation (dedicated for focus)
        this._focusArea = this._g.append('g').attr('class', 'area-group focus')
            .selectAll('path.area.focus')
            .data(stacked_data)
            .enter()
                .append('path').attr('class', (d)=>`area focus ${d.key}`)
                .attr('clip-path', 'url(#focusClip)')
                .style('opacity', 0)
                .attr('d', this.drawAreaWithPerc(100));
    }

    private drawAreaWithPerc(perc:number=0){
        perc = perc / 100;
        return area()
            .y1((d)=>this.yScale(d[1] * perc))
            .y0((d)=>this.yScale(d[0] * perc))
            .x((d,i)=>this.xScale(this.areaData.values[i].date));
    }

    private drawFocusRect(){
        this._focusRect = this._g.append('rect').attr('class', 'focus-rect')
            .style('opacity', 0)
            .attr('width', 0)
            .attr('height', this.size.inner.height);
    }

    private drawClip(){
        this._clip = this._g.append('clipPath')
            .attr('id', 'focusClip')
            .append('rect')
                .attr('class', 'focus-rect')
                .attr('width', 0)
                .attr('height', this.size.inner.height);
    }

    private focusPeriod(period_nb:number){
        if(this.previousPeriodNumber != period_nb){
            let period = this.periodsData[period_nb];
            if(period.dates[0] < this.xScale.domain()[0]){
                period.dates[0] = this.xScale.domain()[0];
            }
            let start_x = this.xScale(period.dates[0]);
            let width = this.xScale(period.dates[1]) - start_x;
            this._g.selectAll('.focus-rect').transition().duration(330)
                .attr('width', width)
                .attr('transform', `translate(${start_x}, 0)`);

            this.previousPeriodNumber = period_nb;
            this.periodContent = period.content;
        }
    }

    // draws 2 the 2 lines progressively
    private setLinesAt(perc:number){
        let state_perc = this.getStatePercentage(this.states.lines, perc);
        this._g.selectAll('path.line').attr('stroke-dashoffset', state_perc);
    }

    // remove one line progressively
    private translateLineTo(key, perc){
        let state_perc = this.getStatePercentage(this.states.removeLines, perc);
        this._g.select('.line.musulman')
            .attr('transform', `translate(0, ${state_perc})`);
    }

    // make areas more or less big
    private updateAreas(perc){
        let state_perc = this.getStatePercentage(this.states.areas, perc);
        this._area.selectAll('.regular').attr('d', this.drawAreaWithPerc(state_perc));
    }
    /**
     * Focus a specific period (determined with scroll position)
     * @see states.focusPeriods
     * @see focusPeriod
     */
    private setFocusAt(perc){
        let t = transition('focusTransition').duration(330);
        let period_nb = this.getStatePercentage(this.states.focusPeriods, perc);
        if(perc > this.states.focusPeriods.domain[0]){
            if(!this.focusShown){
                this._focusArea.selectAll('.area.focus').transition(t).style('opacity', 0.8);
                this._focusRect.transition(t).style('opacity', 0.07);
                this.focusShown = true;
            }
            this.hideFirstContent = true;
            this.focusPeriod(period_nb);
            this._lines.transition(t).style('opacity', 0);
        } else {
            if(this.focusShown){
                this._g.selectAll('.focus-rect,.area.focus').transition(t).style('opacity', 0);
                this.focusShown = false;
            }
            this._lines.transition(t).style('opacity', 1);
            this.hideFirstContent = false;
        }
    }

    private getStatePercentage(state:State, perc:number){
        let state_perc = state.range[0];
        if(perc > state.domain[0]){
            state_perc = state.scale(perc);
        }
        if(perc > state.domain[1]){
            state_perc = state.range[1];
        }
        return state_perc;
    }

    private updateCurrentState(percentage:number){
        if(percentage <= this.states.removeLines.domain[1]){
            this.legend = this.legends.lines;
        } else {
            this.legend = this.legends.areas;
        }
    }

    onScroll(perc:number, do_percentage_check=false){
        if(!this.data){ return; }
        if(this.previousPercentage == perc && !do_percentage_check){ return; }
        // short fail to avoid computation
        // if(perc == 0 || perc == 100){ return; }
        // major steps:
        this.setLinesAt(perc);
        this.translateLineTo('musulman', perc);
        this.updateAreas(perc);
        this.setFocusAt(perc);
        this.updateCurrentState(perc);
        this.previousPercentage = perc;
    }
}
