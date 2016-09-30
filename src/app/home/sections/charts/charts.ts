import { OnInit, Renderer, ViewChild, ElementRef} from '@angular/core';
import { scaleLinear, scaleTime, ScaleTime } from 'd3-scale';
import { select, Selection } from 'd3-selection';
import { timeParse } from 'd3-time-format';
import { axisLeft, axisBottom, Axis } from 'd3-axis';
let d = (y,m,d)=>new Date(y, m, d);

export var dateParser = timeParse('%Y/%m/%d');

type marginType = {top:number, bottom:number, left: number, right: number };
type sizeType = {width:number, height:number};

export abstract class BasicChart implements OnInit {
    protected dynamicWidth: boolean = false;
    protected size: {svg:sizeType, inner:sizeType};
    protected _svg: any;
    protected _g:   any;
    protected margin: marginType = {top: 0, bottom: 0, left:0, right: 0};

    abstract data: any;
    abstract svgRef: ElementRef;

    abstract draw():void;
    abstract initData():void;
    protected abstract updateScales(): void;

    constructor(protected renderer:Renderer){}


    ngOnInit(){
        this.initChart();
        this.bindEvents();
    }

    bindEvents(){
        if(this.dynamicWidth){
            this.renderer.listen(window, 'resize', (e)=>this.resize(e));
        }
    }

    resize(e:any){
        this.setSize();
        this.updateScales();
    }

    initChart(){
        this.setSize();
        this.initSVG();
        this.initData();
        this.updateScales();
        this.draw();
    }
    setSize(){
        let parent = this.svgRef.nativeElement.parentNode;
        let width  = parent.getBoundingClientRect().width;
        let height = width * 0.66;
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
        this._svg = select(this.svgRef.nativeElement);
        this._svg = this._svg
                .attr('width',  this.size.svg.width)
                .attr('height', this.size.svg.height);
        this._g = this._svg.append('g');
        this._g.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

}

export abstract class AxedChart extends BasicChart {
    // d3 axes
    protected xAxis:Axis<any>;
    protected yAxis:Axis<any>;
    // selection of axes
    protected _xAxis:any;
    protected _yAxis:any;

    protected xScale: any;
    protected yScale: any;

    protected abstract getMaxValue(): number;
    protected abstract getDomainForX(): any[];
    protected margin: marginType = {top: 0, bottom: 20, left:50, right: 0};

    resize(e:any){
        super.resize(e);
        this.updateAxis();
    }

    draw(){
        this.drawAxes();
    }

    drawAxes(){
        this.xAxis = axisBottom(this.xScale);
        this.yAxis = axisLeft(this.yScale);

        this._xAxis = this._g.append('g')
            .attr('class','axis axis--x')
            .attr('transform', `translate(0, ${this.size.inner.height})`)
            .call(this.xAxis)

        this._yAxis = this._g.append('g')
            .attr('class','axis axis--y')
            .call(this.yAxis);
    }

    protected updateScales(){
        this.yScale = scaleLinear()
            .domain([0, this.getMaxValue()])
            .range([this.size.inner.height, 0]);

        let xDomain = this.getDomainForX();
        console.log('xDomain', xDomain);
        this.xScale = scaleTime().domain(xDomain).range([0, this.size.inner.width]);
    }

    updateAxis(){ }
}
