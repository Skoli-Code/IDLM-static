import {
    trigger,
    transition,
    style,
    state,
    animate
} from '@angular/core';

var defaultDuration:number=200;
export var fadeRight = trigger('fadeRight', [
    transition('void => *', [
        style({ opacity: 0, transform: 'translate(-100%, 0)'}),
        animate(200, style({ opacity: 1, transform: 'translate(0%, 0)'}))
    ]),
    transition('* => void', [
        style({opacity: 1, transform: 'translate(0%, 0)'}),
        animate(200, style({opacity: 0, transform: 'translate(100%, 0)'}))
    ]),
]);

export function fade(duration:number=defaultDuration){
    return trigger('fade', [
        transition('void => *', [
            style({opacity:0, position: "absolute"}),
            animate(duration, style({position: 'absolute', opacity: 1}))
        ]),
        // transition('* => *', [
        //
        // ]),
        transition('* => void', [
            style({opacity:1, position: 'absolute'}),
            animate(duration, style({position: 'absolute', opacity: 0}))
        ])
    ]);
}
export function fadeDown(duration:number=defaultDuration){
    return trigger('fadeDown', [
        transition('void => *', [
            style({position:'absolute', opacity: 0, transform: 'translateY(-100%)'}),
            animate(duration, style({opacity: 1, transform: 'translateY(0)'}))
        ]),
        transition('* => *', [
            style({position:'absolute', opacity: 0, transform: 'translateY(-100%)'}),
            animate(duration, style({opacity: 1, transform: 'translateY(0)'}))
        ]),
        transition('* => void', [
            style({position:'absolute',opacity: 1, transform: 'translateY(0%)'}),
            animate(duration, style({opacity: 0, transform: 'translateY(100%)'}))
        ])
    ]);
}
export var fadeUp = trigger('fadeUp', [])

export function slideRight(duration:number=defaultDuration){
    return trigger('slideRight', [
        transition('void => *', [
            style({transform: 'translateX(100%)'}),
            animate(duration, style({transform: 'translateX(0%)'}))
        ]),
        transition('* => void', [
            style({transform: 'translateX(0%)'}),
            animate(duration, style({transform: 'translateX(100%)'}))
        ])
    ]);
}
