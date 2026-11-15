import { Routes } from '@angular/router';
import { ModuleUebersicht } from './module-uebersicht/module-uebersicht';
import { Modulplaner } from './modulplaner/modulplaner';

export const routes: Routes = [
    { path: 'modulplaner', component: Modulplaner},
    { path: 'module', component: ModuleUebersicht },
    { path: '', redirectTo: 'module', pathMatch: 'full' },
];
