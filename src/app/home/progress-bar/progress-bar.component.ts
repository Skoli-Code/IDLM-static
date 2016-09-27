import { Component, ElementRef, Input, OnInit, OnChanges,SimpleChanges, EventEmitter } from '@angular/core';

import { select } from 'd3-selection';
import { scaleTime, Time } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

@Component({
  selector: 'idlmProgressBar',
  template: `
    <div class='progress'>
        <div class='progress__indicator'>{{ currentDateStr }}</div>
        <div class='progress__bar'>
            <div class='progress__bar__inner' [style.width]="progressPercentage + '%'"></div>
        </div>
    </div>
  `,
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnChanges {
    @Input() useMonthFormat: boolean = false;
    @Input() dates: Array<Date>;
    @Input() progressPercentage: number;
    @Ouput() dateChanged: EventEmitter<date>
    private currentDate: Date;
    private currentDateStr: string;
    private scale: Time;

    constructor(private el:ElementRef) {
    }

    ngOnInit() {
        let dateFormatStr = this.useMonthFormat ? '%B %Y' :  '%Y';
        this.timeFormat = timeFormat(dateFormatStr);
        this.scale = scaleTime().domain(this.dates).range([0,100]);
        this.initialized = true;
    }

    ngOnChanges(changes: SimpleChanges):void{
        if(!this || !this.initialized){ return ; }
        if(changes.progressPercentage){
            this.progressPercentage = changes.progressPercentage.currentValue;
            let date = this.scale.invert(this.progressPercentage);
            this.currentDateStr = this.timeFormat(date);
            if(date != this.currentDate){
                this.dateChanged.emit(date);
            }
            this.currentDate = date;
        }
    }


}
