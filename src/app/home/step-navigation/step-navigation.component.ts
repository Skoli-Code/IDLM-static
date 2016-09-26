import { PlatformLocation } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import * as _ from 'lodash';
import 'jquery';

@Component({
  selector: 'idlm-step-navigation',
  templateUrl: './step-navigation.component.html',
  styleUrls: ['./step-navigation.component.scss']
})
export class StepNavigationComponent implements OnInit {
    private steps: NodeListOf<Element>;
    private activeFragment: string;

    constructor(private location: PlatformLocation) { }

    onStepClicked(step){
        this.activeFragment = step.id;
        this.onHashChange(step.id);
    }

    ngOnInit() {
        this.location.onHashChange((e)=>{
            let hash = (e as any).newURL.split('#')[1];
            this.activeFragment = hash;
            this.onHashChange(hash);
        });
        this.steps = document.querySelectorAll('.anchor');
        let hash = this.location.hash.substr(1);
        if(hash.length > 1){
            this.activeFragment = hash;
        }
    }

    onHashChange(hash){
        let target = $('#'+hash);
        $('html,body').stop().animate({scrollTop: target.offset().top }, '400');
    }

    isActive(anchor){
        return this.activeFragment == (anchor.id || null);
    }

    getVisibleAnchor():Element{
        let scroll_top = document.body.scrollTop;
        let _steps = _.filter(this.steps, (s)=> {
            let rect = s.getBoundingClientRect();
            return Math.abs(rect.top) < rect.height/10 || rect.bottom == 0;
        });
        return _steps.length ? _steps[0] : null;
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(e){
        let activeAnchor = this.getVisibleAnchor();
        if(activeAnchor && !this.isActive(activeAnchor)){
            this.setActive(activeAnchor);
            this.updateUrl();
        }
    }

    setActive(el:Element){
        if(!el){ return; }
        this.activeFragment = el.id;
    }

    updateUrl(){
        if(this.activeFragment){
            // this.location.hash = this.activeFragment;
            this.location.replaceState(this.activeFragment, '', '/#' + this.activeFragment);
        }
    }
}
