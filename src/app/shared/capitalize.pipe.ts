import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
    transform(raw:string){
        return raw[0].toUpperCase() + raw.slice(1);
    }

}
