import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { HomeComponent } from './home/home.component';
import { MethodologieComponent } from './methodologie/methodologie.component';
import { FirstPartComponent } from './home/first-part/first-part.component';
import { SecondPartComponent } from './home/second-part/second-part.component';
import { ThirdPartComponent } from './home/third-part/third-part.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MethodologieComponent,
    FirstPartComponent,
    SecondPartComponent,
    ThirdPartComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing
  ],
  providers: [ appRoutingProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
