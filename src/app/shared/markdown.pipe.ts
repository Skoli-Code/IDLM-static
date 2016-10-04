/**
 * Code took from https://github.com/dimpu/angular2-markdown/
 */
import { Pipe, PipeTransform } from '@angular/core';
import * as Showdown from 'showdown';

@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
    transform(raw:string){
        return this.process(this.prepare(raw));

    }
    prepare(raw: string) {
        return raw.split('\n').map((line) => line.trim()).join('\n')
    }
    process(markdown: string) {
        let converter = new Showdown.Converter();
        let html = converter.makeHtml(markdown);
        return html;
    }

}
