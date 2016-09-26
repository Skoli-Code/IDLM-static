import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MethodologieComponent } from './methodologie/methodologie.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'méthodologie', component: MethodologieComponent },
  { path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
