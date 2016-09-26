import { Component, ElementRef, Input, OnInit, OnChanges,SimpleChange } from '@angular/core';

import { select } from 'd3-selection';
import { scaleTime, Time } from 'd3-scale';

@Component({
  selector: 'idlm-date-indicator',
  template: `
    <div class='slider'>
        <div class='slider__indicator'>{{ currentDate }}</div>
        <div class='slider__bar'></div>
    </div>
  `,
  styleUrls: ['./date-slide-indicator.component.scss']
})
export class DateSlideIndicatorComponent implements OnInit {

    @Input() dates: Array<Date>;
    @Input() progressPerc: number;
    private currentDate: string;
    private scale: Time;

    constructor(private el ElementRef) {
    }

    ngOnInit() {
        this.scale = scaleTime().domain(this.dates).range([0,100]);

    }


    scrollWatcherCallback(perc){
        console.log('OH UEAH', perc);
    }

}
