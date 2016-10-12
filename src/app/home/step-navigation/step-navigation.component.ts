// ng imports
import { AsyncPipe, PlatformLocation } from '@angular/common';
import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
// others libs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import 'jquery';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'idlm-step-navigation',
    templateUrl: './step-navigation.component.html',
    styleUrls: ['./step-navigation.component.scss']
})
export class StepNavigationComponent implements OnInit {
    private steps: NodeListOf<Element>;
    private activeFragment: BehaviorSubject<string>;

    constructor(private location: PlatformLocation){
    }

    onStepClicked(step) {
        this.activeFragment.next(step.id);
        this.onHashChange(step.id);
    }

    ngOnInit() {
        this.steps = document.querySelectorAll('.anchor');
    }

    ngAfterViewInit() {
        let h = '';
        this.location.onHashChange((e) => {
            let hash = (e as any).newURL.split('#')[1];
            this.activeFragment.next(hash);
            this.onHashChange(hash);
        });
        let hash = this.location.hash.substr(1);
        if (hash.length > 1) {
            h = hash;
        }
        this.activeFragment = new BehaviorSubject<string>(h);

    }

    onHashChange(hash) {
        let target = $('#' + hash);
        $('html,body').stop().animate({
            scrollTop: target.offset().top
        }, '400');
    }

    isActive(anchor) {
        if(!this.activeFragment){ return false; }
        return this.activeFragment.getValue() == (anchor.id || null);
    }

    getVisibleAnchor(): Element {
        let scroll_top = document.body.scrollTop;
        let _steps = _.filter(this.steps, (s) => {
            let rect = s.getBoundingClientRect();
            return Math.abs(rect.top) < rect.height / 10 || rect.bottom == 0;
        });
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
