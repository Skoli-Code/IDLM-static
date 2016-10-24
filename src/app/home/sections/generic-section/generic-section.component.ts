import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'idlmSection',
  templateUrl: './generic-section.component.html',
  styleUrls: ['./generic-section.component.scss']
})
export class GenericSectionComponent implements OnInit {
    @Input() anchor:string;
    @Input() topPadding:boolean=false;
    constructor() { }
    ngOnInit() {
    }

}
