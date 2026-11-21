import { Component, signal, OnInit, Inject, inject, computed} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import { SemesterplanApi } from '../services/semesterplan-api';
import { Semesterplan } from '../models/semesterplan';
import { Modul } from '../models/modul';



@Component({
  imports: [MatCardModule, MatButtonModule, MatListModule, MatInputModule, MatFormFieldModule],
  selector: 'app-modulplaner',
  styleUrl: './moduleplanner.css',
  templateUrl: './moduleplanner.html',
})
export class Moduleplanner implements OnInit{
private api = inject(SemesterplanApi);

modules = signal<Modul[]>([]);
semesterplan = signal<Semesterplan[]>([]);

status = signal<string>('laden');
catalogStatus = signal<string>('laden');

search = signal<string>('');

// Berechnet automatisch eine duplikatfreie Menge (Set) aller Modul-IDs,
// die bereits in irgendeinem Semesterplan eingeplant sind
plannedModuleIds = computed(() => new Set(this.semesterplan().flatMap(plan => plan.modules.map(m => m.moduleId))));

// Modulkatalog nach Kuerzel oder Name gefiltert
filteredModules = computed(() => {
const query = this.search().toLowerCase().trim();
return this.modules().filter(m =>
m.id.toLowerCase().includes(query) || m.name.toLowerCase().includes(query));
});

turnusLabel(turnus: Modul['turnus']): string {
if (turnus === 'WISE') return 'WiSe';
if (turnus === 'SOSE') return 'SoSe';
return 'kein fester Turnus';

}

getTotalEcts(plan:Semesterplan): number {
  return plan.modules.reduce((sum, module) => sum + module.ects, 0);
}

onSearch(event: Event): void {
  this.search.set((event.target as HTMLInputElement).value)
}

// Prueft, ob ein bestimmtes Modul bereits eingeplant ist (true/false),
// z. B. um im Modulkatalog das Badge "Eingeplant" anzuzeigen
isPlanned(moduleId: string): boolean {
  return this.plannedModuleIds().has(moduleId);
}

addModule(module: Modul, plan: Semesterplan): void {
  this.api.addEnrollModule(plan.planId, module.id).subscribe ({
    next: () => {
      this.loadPlans();
    },
    error: () => this.status.set('fehler')
  });
}

loadModules(): void {
  this.api.getModules().subscribe ({
    next: (data) => {
      this.modules.set(data);
      this.catalogStatus.set('ok');
    },
    error: ()=> this.catalogStatus.set('fehler')
  });
}

loadPlans(): void {
  this.api.getSemesterplan().subscribe ({
      next: (data) => {
        this.semesterplan.set(data);
        this.status.set('ok');
      },
      error: ()=> this.status.set('fehler')
    });
}

  ngOnInit(): void {
    this.loadModules();
    this.loadPlans();
  }
}