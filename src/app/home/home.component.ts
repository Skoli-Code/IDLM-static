import { Component, OnInit } from '@angular/core';
import { DataLoaderService } from './sections/charts/data-loader.service';

@Component({
  selector: 'idlmHome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private initialized: boolean = false;
    constructor(private dataLoader:DataLoaderService){
    }

    ngOnInit(){
        this.dataLoader.loadAllData().subscribe((data)=>{
            this.initialized = true;
        });
    }
}
