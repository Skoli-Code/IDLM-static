import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';
import { AbstractChart, dateParser, ScrollableChart } from '../charts';
import { DataLoaderService } from '../data-loader.service';
import { _extent } from '../utils';
import { EventType } from '../../../../shared/scroll-watcher.directive';

import { polygonCentroid } from 'd3-polygon';
import { line } from 'd3-shape';
import { transition } from 'd3-transition';
import {
    scaleLog,
    scaleLinear,
    ScaleLinear,
    scaleTime
} from 'd3-scale';

import { select, event } from 'd3-selection';
let d3Event = event;

import { min, max } from 'd3-array';
import {
    forceSimulation,
    forceCenter,
    forceCollide
} from 'd3-force';

import * as _ from 'lodash';

type ptType   = [number, number];
type polygonType = ptType[];

type pointsType = {
    a:ptType, b:ptType, c:ptType,
    d:ptType, e:ptType, f:ptType,
    g:ptType, h:ptType
};

@Component({
  selector: 'idlmChart-2-2',
  templateUrl: './chart-2-2.component.html',
  styleUrls: ['./chart-2-2.component.scss']
})
export class Chart_2_2Component extends AbstractChart implements ScrollableChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    dataCatalogKey:string="2.2";
    sizeRatio: 1;
    heightForScrollWatcher='8000px';
    progress:number=0;
    drawned:boolean=false;
    private maxBubbleSize:number=60;

    private currentYear:number;
    private borderPadding:number = 5;
    private layouts:any;
    private bubbleAreas: any;
    private bubbleAreasEnter: any;
    private bubbles: any;
    private tooltip: any;
    private yearScale: any;
    private points:any;
    private years:Date[];

    constructor(renderer:Renderer, dataLoader:DataLoaderService){
        super(renderer, dataLoader);
    }
    initSizes(){
        let parent  = this.chartElement.nativeElement.parentNode;
        let width   = Math.floor(parent.getBoundingClientRect().width);
        let wHeight = jQuery(window).height();
        let height = wHeight - 60;

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

    initScales(){
        let dates = this.data[0].tops.map((t)=>t.date);
        this.yearScale = scaleTime()
            .domain(_extent(dates))
            .range([0,100]);

        this.initLayouts();
    }

    updateScales(){
        this.initLayouts();
    }

    initData(){
        this.data = this.data.map((s)=>{
            s.tops = s.tops.map((top)=>{
                top.date = dateParser(top.date);
                // we just show the top 20 words
                top.words = top.words.slice(0, 16);
                return top;
            });
            return s;
        });
    }

    getPolygonPoints():pointsType{
        let ta = 3/7;
        let tb = 5/6;
        let w = this.size.inner.width, h = this.size.inner.height;
        return {
            a:[ 0,   0],
            b:[ w,   0],
            c:[ w,   h],
            d:[ 0,   h],
            e:[ w/2, 0],
            f:[ w,   tb * h],
            g:[ 0,   tb * h],
            h:[ w/2, ta * h]
        };
    }


    // inspired from http://bl.ocks.org/larsenmtl/39a028da44db9e8daf14578cb354b5cb
    initLayouts(){
        let points = this.getPolygonPoints();
        let p1 = [points.a, points.e, points.h, points.g];
        let p2 = [points.e, points.b, points.f, points.h];
        let p3 = [points.g, points.h, points.f, points.c, points.d];

        this.layouts = [
            { source: 'lemonde',    polygon: p1 },
            { source: 'figaro',     polygon: p2 },
            { source: 'liberation', polygon: p3 }
        ];

        this.layouts = this.layouts.map((layout)=>{
            layout.tops   = this.data.find((d)=>d.source == layout.source).tops;

            let center:ptType = polygonCentroid(layout.polygon);
            if(center[1] > this.size.inner.height * 0.5){
                center[1] -= center[1] * (1/15);
            }
            layout.center = center;
            layout.force = forceSimulation()
                // .alpha(0.2)
                .velocityDecay(0.5)
                .force('center',  forceCenter(layout.center[0], layout.center[1]))
                .force('polygon', forceCollidePolygon(layout.polygon).iterations(4))
                .force('collide', forceCollide().iterations(3))
                .stop();
            return layout;
        });
    }

    drawSeperator(){
        let points = this.getPolygonPoints();
        let path = [ points.g, points.h, points.e, points.h, points.f ];
        this._g.append('path')
            .datum(path)
            .attr('class', 'separator')
            .attr('d', line().x((d)=>d[0]).y((d)=>d[1]));
    }

    yearTop(tops){
        return tops.find((t)=>t.date.getFullYear() == this.currentYear).words;
    }

    previousWords(source){
        let words = [];
        let lowest_year = this.yearScale.domain()[0].getFullYear();
        let previous_year = this.currentYear - 1;
        if(previous_year > lowest_year){
            let data = this.data.find((d)=>d.source == source).tops;
            words = data.find((d)=>d.date.getFullYear() == previous_year).words.map((d)=>d[0]);
        }
        return words;
    }

    drawPointsFor(year:number){
        let t = transition<any>('updateNode').duration(330);

        for (let layout of this.layouts){
            let data = this.yearTop(layout.tops);
            let maxSize = this.size.inner.width / 16;
            if(this.size.inner.width > this.size.inner.height){
                maxSize = this.size.inner.height / 12;
            }
            let scale = scaleLog()
                .domain(_extent(data.map(d=>d[1])))
                .range([20, maxSize]);

            // check if node's words is a new one or not
            let isNewWord = (d)=>{
                let previousWords = this.previousWords(layout.source);
                return previousWords.length && previousWords.indexOf(d[0]) == -1;
            }

            let truncateText = (text, radius)=>{
                // rule: 20px for 4 characters
                let pxpc = 4.2;
                let r = Math.floor(radius) - 2;
                if((text.length * pxpc) > r){
                    let nbmax = Math.floor( r / pxpc );
                    text = text.slice(0, nbmax - 1);
                    text += '.';
                }
                return text;
            };

            // Data setting
            let bubbles = this._g.select('.bubble-group.'+layout.source)
                .selectAll('.bubble')
                .data(data);

            // CREATION
            let bubblesEnter = bubbles.enter().append('g')
                .attr('class', 'bubble')
                .classed('new', isNewWord);

            bubblesEnter.append('circle')
                .attr('r', (d)=>scale(d[1]));

            bubblesEnter.append('text')
                .attr('dy', '.3em')
                .style('text-anchor', 'middle')
                .text((d)=>truncateText(d[0], scale(d[1])));

            // bubblesEnter.append('svg:title').text((d)=>d[0]);

            // UPDATE
            // accessor for updated node: accessing it directly with d[0] do
            // not work for strange reason ://
            let textUpdate = (d)=>data[d.index][0];
            bubbles.classed('new', isNewWord);

            bubbles.selectAll('title').text((d)=>textUpdate(d));

            bubbles.selectAll('text').text((d)=>{
                return truncateText(textUpdate(d), scale(data[d.index][1]));
            });

            bubbles.selectAll('circle').transition(t).attr('r', (d)=>{
                return scale(data[d.index][1]);
            });

            // delete
            bubbles.exit().transition(t)
                .attr('transform', 'translate(0, -200)')
                .style('opacity', 0)
                .remove();

            bubblesEnter.on("mouseover", (d)=>{
                this.tooltip.text(d[0]);
                this.tooltip.style("visibility", "visible");
              })
              .on("mousemove", (event)=>{
                  return this.tooltip.style("top", (event.y-10)+"px").style("left",(event.x+10)+"px");
              })
              .on("mouseout", ()=>{
                  return this.tooltip.style("visibility", "hidden");
              });

            let fradius = (d)=>{
                return scale(d[1]) + 5;
            }
            let force = layout.force;
            force.force('collide').radius(fradius);
            force.force('polygon').radius(fradius);
            force.nodes(data).alpha(0.5).restart();

            layout.force.on('tick', function(){
                bubblesEnter.merge(bubbles).attr('transform', (d)=>{
                    if(!d.y || !d.x){ return; }
                    return `translate(${d.x}, ${d.y})`;
                });
            });
        }
        this.drawned = true;
    }
    drawLegend(){
        select('.chart-2-2 .chart__legend').selectAll('li').each(function(){
            let li = select(this);
            li.append('svg')
                .attr('width', 20)
                .attr('height', 20)
                .append('g')
                .append('circle').attr('r', 6).attr('transform', `translate(7, 13)`);
            li.append('span').text(li.attr('data'));
        });
    }

    drawTooltip(){
        this.tooltip = select('.chart .scroll-content')
            .append('div')
            .style("position", "absolute")
            .style("z-index", "1000")
            .style("pointer-events", "none")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "rgba(0, 0, 0, 0.95)")
            .style("border-radius", "6px")
            .style("font", "12px sans-serif")
            .text("tooltip");

    }

    draw(){
        this.drawTooltip();
        this.bubbleAreas = this._g.selectAll('.bubble-group')
            .data(this.data);

        this.bubbleAreasEnter = this.bubbleAreas.enter()
            .append('g')
            .attr('class', (d)=>`bubble-group ${d.source}`);

        this.drawSeperator();
        this.drawLegend();
    }

    updateDraw(){
        this.drawned = false;
        this._g.select('.separator').remove();
        this._g.selectAll('.bubble-group').selectAll('.bubble').remove();
        this.drawSeperator();
        this.drawPointsFor(this.currentYear);
    }

    onScroll(event:EventType){
        const percentage = event.percentage;
        this.progress = percentage;
        if(!this.yearScale && !this.layouts){ return; }
        let year = this.yearScale.invert(percentage);
        if(this.currentYear != year.getFullYear() || this.drawned == false){
            this.currentYear = year.getFullYear();
            this.drawPointsFor(this.currentYear);
        }
    }
}

// inspired from http://bl.ocks.org/larsenmtl/39a028da44db9e8daf14578cb354b5cb
function forceCollidePolygon(polygon:polygonType):any {
    // took from d3-force/src/constant.js
    function constant(x){
      return function() {
        return x;
      };
    }
    // took from d3-force/src/jiggle.js
    function jiggle() {
        return (Math.random() - 0.5) * 1e-6;
    }
    // adapted from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
    function intersection(p0:ptType, p1:ptType, p2:ptType, p3:ptType): ptType {
        let s1 = [ p1[0] - p0[0], p1[1] - p0[1]];
        let s2 = [ p3[0] - p2[0], p3[1] - p2[1]];
        // intersection compute
        let s, t;
        s = -s1[1] * (p0[0] - p2[0]) + s1[0] * (p0[1] - p3[1]);
        t =  s2[0] * (p0[1] - p2[1]) - s2[1] * (p0[0] - p3[0]);
        s = s / (-s2[0] * s1[1] + s1[0] * s2[1]);
        t = t / (-s2[0] * s1[1] + s1[0] * s2[1]);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            return [
                p0[0] + (t * s1[0]),
                p0[1] + (t * s1[1])
            ];
        }
        return null;
    }

    return (()=>{
        let nodes, n, radius, iterations = 1;
        let absub  = (a,b)=>Math.max(a,b)-Math.min(a,b)
        let center = polygonCentroid(polygon);

        var force: any = function(){
            for(let i = 0; i < iterations; i++){
                for(let j = 0; j < n; j++){
                    let node = nodes[j];
                    let r = radius(node);
                    // positionning helpers
                    let px = (node.x >= center[0]?1:-1);
                    let py = (node.y >= center[1]?1:-1);
                    // change focus to the center of the triangle
                    let target:ptType = [ node.x+px*r, node.y+py*r ];
                    for(let k = 0; k < polygon.length; k++){
                        let n = (k+1) < polygon.length ? (k+1):0;
                        let p1 = polygon[k];
                        let p2 = polygon[n];
                        let intersect = intersection(p1, p2, center, target);
                        if(intersect){
                            node.vx = -px/Math.sqrt(absub(intersect[0], target[0]));
                            node.vy = -py/Math.sqrt(absub(intersect[1], target[1]));
                            break;
                        }
                    }
                }
            }
            return;
        }

        force.iterations = function(a) {
            return arguments.length ? (iterations = +a, force) : iterations;
        };
        force.initialize = function(a){
            n = (nodes = a).length;
        };
        force.radius = function(a:any):any{
            return arguments.length ? (radius = typeof a === "function" ? a : constant(+a), force) : radius;
        };
        return force;
    })();
}
