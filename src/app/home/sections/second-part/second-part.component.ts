import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'idlm-second-part',
  templateUrl: './second-part.component.html',
  styleUrls: ['./second-part.component.scss']
})
export class SecondPartComponent implements OnInit {
    private progressPercentage:number = 0;
    private heightForScrollWatcher:string = '4000px';
    constructor() { }

    ngOnInit() {
    }

    onScroll(perc:number){
         this.progressPercentage = perc;
    }
}
