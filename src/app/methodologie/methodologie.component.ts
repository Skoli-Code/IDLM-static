import 'jquery';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-methodologie',
    templateUrl: './methodologie.component.html',
    styleUrls: ['./methodologie.component.css']
})
export class MethodologieComponent implements OnInit {
    constructor() { }
    ngOnInit() {
        $(window).scrollTop(0);
    }

}
