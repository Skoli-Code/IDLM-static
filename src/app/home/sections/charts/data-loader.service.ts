import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
// RXJS operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export type DataType = Object|Array<any>;

@Injectable()
export class DataLoaderService {
    private catalog: {[key:string]: DataType} = {};
    private keys: Array<string> = ['1.1', '1.2','2.1', '2.2', /* '3.1', */ '3.2',];

    constructor(private http: Http){}

    get(key){ return this.catalog[key]; }

    loadAllData():Observable<Array<DataType>>{
        return Observable.forkJoin(
            this.keys.map((key:string)=>{
                return this.load(key).map((data:DataType)=>{
                    this.catalog[key] = data;
                    return this.catalog[key];
                });
            }));
    }

    load(key):Observable<DataType>{
        return this.http.get(`assets/data/${key}.json`)
            .map((response:Response)=>{ return response.json() });
    }

}
