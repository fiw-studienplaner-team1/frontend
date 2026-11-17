import { Routes } from '@angular/router';
import { ModuleUebersicht } from './module-uebersicht/module-uebersicht';
import { Moduleplanner } from './moduleplanner/moduleplanner';
import { ModuleDetail } from './module-detail/module-detail';

export const routes: Routes = [
  { path: 'module', component: ModuleUebersicht },
  { path: 'moduleplanner', component: Moduleplanner },
  { path: '', redirectTo: 'module', pathMatch: 'full' },
    { path: 'module/:id', component: ModuleDetail }

];
