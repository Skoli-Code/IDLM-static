import { Input, Directive, ElementRef, HostListener } from '@angular/core';

type windowSize = [number, number];
@Directive({
    selector: '[idlmOpenModal]'
})
export class OpenModalDirective {
    private _el:Element;

    @Input('idlmOpenModal') href:string;
    @Input() windowSize:windowSize = [500, 400];

    constructor(private el: ElementRef) {
        this._el = el.nativeElement;
    }

    @HostListener('click', ['$event'])
    onClick(e){
        e.preventDefault();
        let wname = this._el.classList[1];
        let ww = window.innerWidth;
        let wh = window.innerHeight;
        let w = this.windowSize[0];
        let h = this.windowSize[1];
        let wstyle = `
            height=${h},width=${w},top=${(wh/2)-h/2},left=${(ww/2)-(w/2)},
            toolbar=0,location=0
        `;
        window.open(this.href, wname, wstyle);
    }

}
