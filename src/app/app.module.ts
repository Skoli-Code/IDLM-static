import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { HomeComponent } from './home/home.component';
import { MethodologieComponent } from './methodologie/methodologie.component';
import { FirstPartComponent } from './home/sections/first-part/first-part.component';
import { SecondPartComponent } from './home/sections/second-part/second-part.component';
import { ThirdPartComponent } from './home/sections/third-part/third-part.component';
import { StepNavigationComponent } from './home/step-navigation/step-navigation.component';
import { ScrollWatcherDirective } from './shared/scroll-watcher.directive';
import { DateSlideIndicatorComponent } from './home/date-slide-indicator/date-slide-indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MethodologieComponent,
    FirstPartComponent,
    SecondPartComponent,
    ThirdPartComponent,
    StepNavigationComponent,
    ScrollWatcherDirective,
    DateSlideIndicatorComponent,
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
