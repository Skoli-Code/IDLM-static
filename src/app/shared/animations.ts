import {
    trigger,
    transition,
    style,
    state,
    animate
} from '@angular/core';

var defaultDuration:number=200;
export var fixedWidthFadeRight = trigger('fixedWidthFadeRight', [
    transition('void => *', [
        style({
            'z-index': -1, position: 'absolute',
            width: '500px', opacity: 0, transform: 'translate(-100%, 0)'
        }),
        animate(200, style({
            opacity: 1, transform: 'translate(0%, 0)'
        }))
    ]),
    transition('* => void', [
        style({
            'z-index': -1, position: 'absolute',
            width: '500px', opacity: 1, transform: 'translate(0%, 0)'
        }),
        animate(200, style({
            opacity: 0, transform: 'translate(100%, 0)'
        }))
    ]),
]);

export function fadeRight(duration:number=defaultDuration){
    return trigger('fadeRight', [
        transition('void => *', [
            style({
                position:'absolute', top:0, opacity: 0, transform: 'translate(-100%, 0)'
            }),
            animate(duration, style({
                opacity: 1, transform: 'translate(0%, 0)'
            }))
        ]),
        transition('* => void', [
            style({
                position: 'absolute', top:0, opacity: 1, transform: 'translate(0%, 0)'
            }),
            animate(duration, style({
                opacity: 0, transform: 'translate(100%, 0)'
            }))
        ])
    ]);
};
export function fadeInOut(duration:number=defaultDuration){
    return trigger('fadeInOut', [
        transition('* => *', [
            style({opacity: 0}),
            animate(duration, style({opacity: 1}))
        ]),
    ])
}

export function fade(duration:number=defaultDuration){
    return trigger('fade', [
        transition('void => *', [
            style({opacity: 0}),
            animate(duration, style({opacity: 1}))
        ]),
        transition('* => void', [
            animate(duration, style({opacity: 0}))
        ]),
    ]);
}

export function fadeDown(duration:number=defaultDuration){
    return trigger('fadeDown', [
        transition('void => *', [
            style({
                position:'absolute', opacity: 0, transform: 'translateY(-100%)'
            }),
            animate(duration, style({
                opacity: 1, transform: 'translateY(0)'
            }))
        ]),
        transition('* => *', [
            style({
                position:'absolute', opacity: 0, transform: 'translateY(-100%)'
            }),
            animate(duration, style({
                opacity: 1, transform: 'translateY(0)'
            }))
        ]),
        transition('* => void', [
            style({
                position:'absolute',opacity: 1, transform: 'translateY(0%)'
            }),
            animate(duration, style({
                opacity: 0, transform: 'translateY(100%)'
            }))
        ])
    ]);
}

export function slideRight(duration:number=defaultDuration){
    return trigger('slideRight', [
        transition('void => *', [
            style({
                transform: 'translateX(100%)'
            }),
            animate(duration, style({
                transform: 'translateX(0%)'
            }))
        ]),
        transition('* => void', [
            style({
                transform: 'translateX(0%)'
            }),
            animate(duration, style({
                transform: 'translateX(100%)'
            }))
        ])
    ]);
}
