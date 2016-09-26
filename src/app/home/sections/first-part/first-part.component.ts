import { Component, OnInit } from '@angular/core';
import { ScrollableSection } from '../home-section';

@Component({
  selector: 'idlm-first-part',
  templateUrl: './first-part.component.html',
  styleUrls: ['./first-part.component.css']
})
export class FirstPartComponent extends ScrollableSection implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
