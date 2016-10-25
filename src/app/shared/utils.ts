export function isInViewPort(el:Element, topRatio:number=0.5, bottomRatio:number=0.66){
    let rect = el.getBoundingClientRect();
    let wh = window.innerHeight;
    return (rect.top <= wh*topRatio) && (rect.top + rect.height) > (rect.height * bottomRatio);
}
