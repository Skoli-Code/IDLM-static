import {
    trigger,
    transition,
    style,
    state,
    animate
} from '@angular/core';

export var fadeRight = trigger('fadeRight', [
    transition('void => *', [
        style({position:'absolute', opacity: 0, transform: 'translateX(-100%)'}),
        animate(200, style({opacity: 1, transform: 'translateX(0)'}))
    ]),
    transition('* => void', [
        style({position:'absolute',opacity: 1, transform: 'translateX(0%)'}),
        animate(200, style({opacity: 0, transform: 'translateX(100%)'}))
    ])
]);




export var fadeDown = trigger('fadeDown', [

]);

export var fadeUp = trigger('fadeUp', [])
