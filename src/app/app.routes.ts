import { Routes } from '@angular/router';
import { ModuleUebersicht } from './module-uebersicht/module-uebersicht';

export const routes: Routes = [
    { path: 'module', component: ModuleUebersicht },
    { path: '', redirectTo: 'module', pathMatch: 'full' },
];
