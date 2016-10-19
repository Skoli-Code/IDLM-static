import { Component, OnInit } from '@angular/core';
import 'jquery';

@Component({
    selector: 'idlmNavbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
    scrollToTop() {
        $('html,body').animate({
            scrollTop: 0
        }, 400);
    }
}
