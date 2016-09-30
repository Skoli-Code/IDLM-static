// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

interface JQuery {
    fixTo: any;
}

interface LocationChangeEvent {
    newURL: string;
}

declare var require: any;

declare module "showdown" {
    export class Converter {
        makeHtml(content:string):string;
    }
}
