import { Component, Input, ElementRef, ViewChild, Renderer } from '@angular/core';
import { AbstractChart, dateParser } from '../../charts/charts';
import { DataLoaderService } from '../../charts/data-loader.service';
import { polygonCentroid } from 'd3-polygon';
import { ScaleLogarithmic, scaleLog } from 'd3-scale';
import { select } from 'd3-selection';
import { extent } from 'd3-array';
import { forceSimulation, forceCenter } from 'd3-force';
import * as _ from 'lodash';

type pointType   = [number, number];
type polygonType = {
    source:string,
    polygon:pointType[],
    centroid:pointType
};

type pointsType = {
    a:pointType,
    b:pointType,
    c:pointType,
    d:pointType,
    e:pointType,
    f:pointType,
    g:pointType,
    h:pointType
};

// code took from http://bl.ocks.org/larsenmtl/39a028da44db9e8daf14578cb354b5cb
let getLineIntersection = ( l1:[pointType, pointType], l2[pointType])=>{
    let s1 = [
        l1[1][0] - l1[0][0],
        l1[1][1] - l1[0][1]
    ];
    let s2 = [
        l2[1][0] - l2[0][0],
        l2[1][1] - l2[0][1]
    ];
    // intersection compute
    let s, t;
    s = -s1[1] * (l1[0][0] - l2[0][0]) + s1[0] * ( l1[0][1] - l2[1][1]));
    s = s / (-s2[0] * s1[1] + s1[0] * s2[1]);

    t = (s2[0] * (l1[0][1] - l2[0][1]) - s2[1] * (l1[0][0] - l2[1][0]));
    t = t / (-s2[0] * s1[1] + s1[0] * s2[1]);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        let intX = l1[0] + (t * s1[0]);
        let intY = l1[1] + (t * s1[1]);
        return {
            x: intX,
            y: intY
        };
    }
    return false;
};

@Component({
  selector: 'idlmChart-2-2',
  templateUrl: './chart-2-2.component.html',
  styleUrls: ['./chart-2-2.component.css']
})
export class Chart_2_2Component extends AbstractChart {
    @ViewChild('chartPlayground') chartElement: ElementRef;
    dataCatalogKey:string="2.2";

    private forceLayout:any;
    private bubbleScale: ScaleLogarithmic<number, number>;
    private layouts:any;
    private bubbleAreas: any;
    private bubbles: any;
    private points:any;
    private years:Date[];

    constructor(renderer:Renderer, dataLoader:DataLoaderService){
        super(renderer, dataLoader);
    }

    initData(){
        this.initLayouts();
        this.data = this.data.map((s)=>{
            s.tops = s.tops.map((top)=>{
                top.date = dateParser(top.date);
                return top;
            });
            s.layout = this.layouts.find((p)=>p.source == s.source);
            return s;
        });

        this.years = this.data[0].tops.map((t)=>t.date);
    }

    getWordsDomain(){
        let values:number[] = [];
        for (let source of this.data) {
            for(let top of source.tops){
                for (let word of top.words) {
                    values.push(word[1]);
                }
            }
        }
        return extent(values);
    }

    getPolygonPoints():pointsType{
        let ta = 1/2;
        let tb = 2/3;
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

    initLayouts(){
        let onTick = function(){
            let nodes = this.nodes;
        }
        let layoutSimulation = forceSimulation();
        let points = this.getPolygonPoints();
        let p1 = [points.a, points.e, points.h, points.g];
        let p2 = [points.e, points.b, points.f, points.h];
        let p3 = [points.g, points.h, points.f, points.c, points.d];

        let c1 = polygonCentroid(p1);
        let c2 = polygonCentroid(p2);
        let c3 = polygonCentroid(p3);

        this.layouts = [
            {
                source: 'lemonde',
                polygon: p1,
                layout: layoutSimulation
                    .force('center', forceCenter(c1))
                    .on('tick', onTick);
            },
            {
                source: 'figaro',
                polygon: p2,
                layout: layoutSimulation
                    .force('center', forceCenter(c2))
                    .on('tick', onTick);
            },
            {
                source: 'liberation',
                polygon: p3,
                layout: layoutSimulation
                    .force('center', forceCenter(c3))
                    .on('tick', onTick);
            }
        ];
    }

    updateScales(){
        this.bubbleScale = scaleLog().domain(this.getWordsDomain()).range([20, 50]);
    }

    drawAreas(){
        this.bubbleAreas = this._g.selectAll('.bubble-group')
            .data(this.data)
            .enter().append('g').attr('class', (d)=>`bubble-group ${d.source}`);
    }

    drawPointsFor(year:Date){
        let layout = this.forceLayout;

        this.bubbles = this.bubbleAreas.selectAll('.bubble')
            .data((d)=>{
                return d.tops.find((d)=>d.date.getTime() == year.getTime()).words;
            });

        this.bubbles.enter()
            .append('circle')
            .attr('class', 'bubble')
            .attr('r', (d)=>this.bubbleScale(d[1]))
            .text((d)=>d[0])
            .call(function(d){
                let center = select(this.parentNode).node();
            });
    }

    draw(){
        this.drawAreas();
        this.drawPointsFor(this.years[0]);
    }
}
