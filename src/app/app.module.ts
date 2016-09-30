import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { HomeComponent } from './home/home.component';
import { MethodologieComponent } from './methodologie/methodologie.component';
/** The different main sections */
import { FirstPartComponent } from './home/sections/first-part/first-part.component';
import { SecondPartComponent } from './home/sections/second-part/second-part.component';
import { ThirdPartComponent } from './home/sections/third-part/third-part.component';
/** main components  */
import { StepNavigationComponent } from './home/step-navigation/step-navigation.component';
import { ProgressBarComponent } from './home/progress-bar/progress-bar.component';
/** Services */
import { DataLoaderService } from './home/sections/charts/data-loader.service';
/** Shared components  */
import { ScrollWatcherDirective } from './shared/scroll-watcher.directive';
import { MarkdownPipe } from './shared/markdown.pipe';
import { Chart_1_1Component } from './home/sections/first-part/chart-1-1/chart-1-1.component';
import { Chart_2_2Component } from './home/sections/second-part/chart-2-2/chart-2-2.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { Chart_1_2Component } from './home/sections/first-part/chart-1-2/chart-1-2.component';

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
    MarkdownPipe,
    ProgressBarComponent,
    Chart_1_1Component,
    Chart_2_2Component,
    NavbarComponent,
    AboutComponent,
    Chart_1_2Component,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing
  ],
  providers: [ appRoutingProviders, DataLoaderService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
