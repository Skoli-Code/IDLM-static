/**
 * Code took from scrollWatcher v1.0.0 (Developed by Elliot Bentley for The Wall
 * Street Journal. Released under the ISC license).
 * ISC: https://raw.githubusercontent.com/WSJ/scroll-watcher/master/LICENSE
 * Adaptation for angular 2 by Pierre Bellon
 */

import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer,
    OnInit
} from '@angular/core';
import 'jquery';
let requestAnimationFrame = window.requestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame;

@Directive({ selector: '[idlmScrollWatcher]' })
export class ScrollWatcherDirective implements OnInit {
    private outerId: string = Math.random().toString().replace('.', '');
    private active: boolean = false;
    private hasBeenActive: boolean = false;
    private maxedOut: boolean =  false;
    private previousPos: number = 0;
    private previousInnerHeight: number;
    private outer: ElementRef;
    private interval: number;
    private _el: any;
    private $el: any;
    private _outer: any;
    private $outer: any;
    private navBarHeight: number=50;
    @Output() onScroll: EventEmitter<number> = new EventEmitter<number>();

    constructor(private el: ElementRef, private renderer: Renderer) {
        this._el = this.el.nativeElement;
        this.$el = $(this._el);
        this.outer = new ElementRef(this._el.parentNode);
        this._outer = this.outer.nativeElement;
        this.$outer = $(this._outer);
        // start watching immediately
        this.start();
    }

    ngOnInit(){
        this.navBarHeight = $('.main-nav').height();
    }

    // starts watching for scroll movement
    start(){
        this.renderer.setElementAttribute(this._outer, 'id', this.outerId);
        // sticky stuff
        // let native_sticky = navigator.userAgent.indexOf('Firefox') === -1;
        $(this._el).fixTo(this._outer, {
            useNativeSticky:false, mind:'.main-nav'
        });
        this.interval = requestAnimationFrame(()=>{this.onTick()});
        return this;
    }

    // check if child element is taller than window height
    // stop checking and unstick
    stop(){
        cancelAnimationFrame(this.interval);
        this.renderer.setElementAttribute(this._outer, 'id', '');
        $(this._el).fixTo('destroy');
        return this;
    }

    // stop checking but keep stuck
    pause(){
        cancelAnimationFrame(this.interval);
        return this;
    }

    onTick() {
        this.checkInnerHeight();
        let scrollDistance = this.getScrollDistance();
        let scrollPos = this.getScrollPos(scrollDistance);
        let cappedScrollPos = this.capPercentage(scrollPos);
        let scrollPosMaxOrMore = ((scrollPos >= 100) || (scrollPos <= 0));
        // 'maxedOut' is true when the scrollPos is outside of 0-100
        // and has run once at this.state maxed-out scroll position.
        // It improves performance by only running the callback when necessary
        if (scrollPos !== this.previousPos) {
            this.maxedOut = false;
        }
        if (!scrollPosMaxOrMore) {
            // 'active' property is for external API
            this.active = true;
            this.hasBeenActive = true;
            this.maxedOut = false;
        }
        if (!this.maxedOut) {
            // run callback function as specified by user
            this.onScroll.emit(cappedScrollPos);
        }

        if (scrollPosMaxOrMore) {
            this.maxedOut = true;
            // 'active' property is for external API
            this.active = false;
        }
        this.previousPos = scrollPos;
        this.interval = requestAnimationFrame(()=>{this.onTick()});
    }
    // gets scroll position as pixels from top of parent
    getScrollDistance() {
        // cross-browser compatibility functionality from MDN
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return y - this.$outer.offset().top;
    }

    // gets scroll position as % of container
    getScrollPos(scrollDistance) {
        return (scrollDistance / (this.$outer.height() - $(window).height())) * 100;
    }

    // toggles stickiness of 'inner' element
    stickUnstick(scrollPos) {
        if (scrollPos === 0) {
            this.renderer.setElementStyle(this._el, 'position', 'relative');
        } else if (scrollPos === 100) {
            this.renderer.setElementStyle(this._el, 'position', 'absolute');
            this.renderer.setElementStyle(this._el, 'bottom', '0');
        } else {
            this.renderer.setElementStyle(this._el, 'position', 'fixed');
        }
    }

    // prevent number from going under 0% or over 100%
    capPercentage(scrollPerc) {
        if (scrollPerc > 100) {
            scrollPerc = 100;
        } else if (scrollPerc < 0) {
            scrollPerc = 0;
        }
        return scrollPerc;
    }

    checkInnerHeight() {
        let newInnerHeight = this._el.getBoundingClientRect().height;
        if (newInnerHeight === this.previousInnerHeight) {
            return;
        }
        this.renderer.setElementStyle(this._el, 'height', 'auto');
        newInnerHeight = this._el.getBoundingClientRect().height;
        let overflow = window.innerHeight - newInnerHeight;
        if (overflow >= 0) {
            newInnerHeight = window.innerHeight - (overflow + 5);
            this.renderer.setElementStyle(this._el, 'height', newInnerHeight);
            this.renderer.setElementStyle(this._el, 'margin-bottom', ""+overflow);
        }
        this.previousInnerHeight = newInnerHeight;
    }


    // does current device support scrollWatcher? returns true or false
    supported() {
        // feature sniff for old browsers
        if(!('indexOf' in [])){ return false; }
        // before iOS 8, CSS position fixed did not work
        var iOS_matches = navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS (\d_\d)/i);
        if (iOS_matches) {
            var version = parseFloat(iOS_matches[iOS_matches.length - 1].replace('_', '.'));
            if (version < 8) {
                return false;
            }
        }
        return true;
    }

}
