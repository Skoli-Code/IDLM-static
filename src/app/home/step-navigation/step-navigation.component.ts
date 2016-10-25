// ng imports
import { AsyncPipe, PlatformLocation } from '@angular/common';
import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// others libs
import * as _ from 'lodash';
import 'jquery';

// internal imports
import { initSocials, meta, Socials } from './socials';
import { slideRight } from '../../shared/animations';
import { isInViewPort } from '../../shared/utils';

function w():any{
    return window;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'idlm-step-navigation',
    templateUrl: './step-navigation.component.html',
    styleUrls: ['./step-navigation.component.scss'],
    animations: [ slideRight(100) ]
})
export class StepNavigationComponent implements OnInit {
    socials: Socials;
    private FB: any;
    private steps: NodeListOf<Element>;
    private activeFragment: BehaviorSubject<string>;
    constructor(private location: PlatformLocation){
    }

    openFacebookDialog(){
        if(!this.FB){ return; }
        let params = {
            method: 'share',
            href: meta.url
        };
        this.FB.ui(params);
    }

    onStepClicked(step) {
        this.activeFragment.next(step.id);
        this.onHashChange(step.id);
    }

    ngOnInit() {
        this.FB = w().FB;
        if(this.FB){
            let params = {
                appId  : 1939376526289572,
                xfbml  : true,
                version: 'v2.8'
            }
            this.FB.init(params);
        } else {
            console.error('Facebook SDK is not loaded !');
        }

        this.steps = document.querySelectorAll('.anchor');
        this.socials = initSocials();
        let h = '';
        this.location.onHashChange((e) => {
            let hash = (e as any).newURL.split('#')[1];
            this.activeFragment.next(hash);
            this.onHashChange(hash);
        });
        let hash = this.location.hash.substr(1);
        if (hash.length > 1) {
            h = hash;
        } else if($(window).scrollTop() < $(window).height()) {
            h = 'cover';
        }
        this.activeFragment = new BehaviorSubject<string>(h);
    }

    onHashChange(hash) {
        let target = $('#' + hash);
        let navh = $('.main-nav').height();
        $('html,body').stop().animate({
            scrollTop: target.offset().top - navh
        }, '400');
    }

    isActive(anchor) {
        if(!this.activeFragment){ return false; }
        return this.activeFragment.getValue() == (anchor.id || null);
    }

    isCover(){
        if(!this.activeFragment){ return true; }
        return this.activeFragment.getValue() == 'cover';
    }

    getVisibleAnchor(): Element {
        let scroll_top = document.body.scrollTop;
        let wh = $(window).height();
        let _steps = _.filter(this.steps, isInViewPort);
        return _steps.length ? _steps[0] : null;
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(e) {
        let activeAnchor = this.getVisibleAnchor();
        if (activeAnchor && !this.isActive(activeAnchor)) {
            this.setActive(activeAnchor);
            this.updateUrl();
        }
    }

    setActive(el: Element) {
        if (!el) { return; }
        this.activeFragment.next(el.id);
    }

    updateUrl() {
        if (this.activeFragment) {
            let h = this.activeFragment.getValue();
            // this.location.hash = this.activeFragment;
            this.location.replaceState(h, '', '/#' + h);
        }
    }
}
