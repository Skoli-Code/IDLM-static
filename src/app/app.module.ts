import { BrowserModule } from '@angular/platform-browser';
import { enableProdMode, NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { HomeComponent } from './home/home.component';
import { MethodologieComponent } from './methodologie/methodologie.component';
/** main components  */
import { GenericSectionComponent } from './home/sections/generic-section/generic-section.component';
import { StepNavigationComponent } from './home/step-navigation/step-navigation.component';
import { ProgressBarComponent } from './home/progress-bar/progress-bar.component';
/** Services */
import { DataLoaderService } from './home/sections/charts/data-loader.service';
/** Shared components  */
import { ScrollWatcherDirective } from './shared/scroll-watcher.directive';
import { MarkdownPipe } from './shared/markdown.pipe';
import { CapitalizePipe } from './shared/capitalize.pipe';
/** Charts */
import { Chart_1_1Component } from './home/sections/charts/chart-1-1/chart-1-1.component';
import { Chart_1_2Component } from './home/sections/charts/chart-1-2/chart-1-2.component';
import { Chart_2_2Component } from './home/sections/charts/chart-2-2/chart-2-2.component';
import { Chart_3_2Component } from './home/sections/charts/chart-3-2/chart-3-2.component';

import { WordCloudComponent } from './home/sections/charts/word-cloud/word-cloud.component';

import { NavbarComponent }    from './navbar/navbar.component';
import { AboutComponent }     from './about/about.component';
import { LinkDirective } from './shared/link.directive';
import { RefComponent } from './shared/ref/ref.component';
import { RepartitionComponent } from './home/sections/charts/repartition/repartition.component';
import { TooltipModule } from 'ng2-tooltip';
import { OpenModalDirective } from './shared/open-modal.directive';
import { MobileWarningComponent } from './mobile-warning/mobile-warning.component';

enableProdMode();
@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MethodologieComponent,
        StepNavigationComponent,
        ScrollWatcherDirective,
        MarkdownPipe,
        CapitalizePipe,
        ProgressBarComponent,
        Chart_1_1Component,
        Chart_1_2Component,
        Chart_2_2Component,
        Chart_3_2Component,
        NavbarComponent,
        AboutComponent,
        WordCloudComponent,
        GenericSectionComponent,
        LinkDirective,
        RefComponent,
        RepartitionComponent,
        OpenModalDirective,
        MobileWarningComponent,
    ],
    imports: [
        TooltipModule,
        BrowserModule,
        HttpModule,
        routing
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        appRoutingProviders, DataLoaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
