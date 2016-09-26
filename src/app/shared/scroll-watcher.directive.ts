/**
 * Code took from scrollWatcher v1.0.0 (Developed by Elliot Bentley for The Wall
 * Street Journal. Released under the ISC license).
 * ISC: https://raw.githubusercontent.com/WSJ/scroll-watcher/master/LICENSE
 * Adaptation for angular 2 by Pierre Bellon
 */

import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import 'jquery';

@Directive({
    selector: '[idlmScrollWatcher]'
})
export class ScrollWatcherDirective {
    private outerId: string = Math.random().toString().replace('.', '');
    private active: boolean = false
    private hasBeenActive: boolean = false;
    private maxedOut: boolean =  false;
    private previousPos: number = 0;
    private previousInnerHeight: number;
    private outer: ElementRef;
    private interval: number;

    @Input('idlmScrollWatcher') updateCallback: Function;

    constructor(private el: ElementRef, private renderer: Renderer) {
        this.outer = new ElementRef(el.nativeElement.parentNode);
        // start watching immediately
        this.start();
    }

    // check if child element is taller than window height
    // stop checking and unstick
    stop(){
        clearInterval(this.interval);
        this.renderer.setElementAttribute(this.outer, 'id', '');
        $(this.el).fixTo('destroy');
        return this;
    }

    // stop checking but keep stuck
    pause(){
        clearInterval(this.interval);
        return this;
    }
    // starts watching for scroll movement
    start(){
        // sticky stuff
        this.renderer.setElementAttribute(this.outer, 'id', this.outerId);
        $(this.el).fixTo('#' + this.outerId);
        this.interval = setInterval(this.onTick, 20);
        return this;
    }

    onTick() {
        this.checkInnerHeight();
        var scrollDistance = this.getScrollDistance();
        var scrollPos = this.getScrollPos(scrollDistance);
        var cappedScrollPos = this.capPercentage(scrollPos);
        var scrollPosMaxOrMore = ((scrollPos >= 100) || (scrollPos <= 0));

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
            this.updateCallback(cappedScrollPos, this.outer);
        }

        if (scrollPosMaxOrMore) {
            this.maxedOut = true;
            // 'active' property is for external API
            this.active = false;
        }
        this.previousPos = scrollPos;
    }
    // gets scroll position as pixels from top of parent
    getScrollDistance() {
        // cross-browser compatibility functionality from MDN
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return y - this.outer.nativeElement.getBoundingClientRect().top;
    }

    // gets scroll position as % of container
    getScrollPos(scrollDistance) {
        return (scrollDistance / (this.outer.nativeElement.getBoundingClientRect().height - window.innerHeight)) * 100;
    }

    // toggles stickiness of 'inner' element
    stickUnstick(scrollPos) {
        if (scrollPos === 0) {
            this.renderer.setElementStyle(this.el, 'position', 'relative');
        } else if (scrollPos === 100) {
            this.renderer.setElementStyle(this.el, 'position', 'absolute');
            this.renderer.setElementStyle(this.el, 'bottom', '0');
        } else {
            this.renderer.setElementStyle(this.el, 'position', 'fixed');
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
        let newInnerHeight = this.el.nativeElement.getBoundingClientRect().height;
        if (newInnerHeight === this.previousInnerHeight) {
            return;
        }
        this.renderer.setElementStyle(this.el, 'height', 'auto');
        newInnerHeight = this.el.nativeElement.getBoundingClientRect().height;
        let overflow = window.innerHeight - newInnerHeight;
        if (overflow >= 0) {
            newInnerHeight = window.innerHeight - (overflow + 5);
            this.renderer.setElementStyle(this.el, 'height', newInnerHeight);
            this.renderer.setElementStyle(this.el, 'margin-bottom', ""+overflow);
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
