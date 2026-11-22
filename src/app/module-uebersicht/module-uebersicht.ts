import { Component, signal, OnInit, inject } from '@angular/core';
import { Module, ModuleType, Cycle, ModuleForm } from '../models/module';
import { ModulApi } from '../services/modul-api';

@Component({
  selector: 'app-module-uebersicht',
  imports: [],
  templateUrl: './module-uebersicht.html',
})
export class ModuleUebersicht implements OnInit {
  private api = inject(ModulApi); 

  status = signal<'laden' | 'fehler' | 'ok'>('laden');
  module = signal<Module[]>([]);

  readonly typeLabel: Record<ModuleType, string> = {
    PFLICHT: 'Pflichtmodul',
    WAHLPFLICHT: 'Wahlpflichtmodul'
  };

  readonly cycleLabel: Record<Cycle, string> = {
  WISE: 'Wintersemester',
  SOSE: 'Sommersemester',
  SONST: 'Sonstiges',
};

  readonly formLabel: Record<ModuleForm, string> = {
    SL: 'Seminaristischer Lehrvortrag',
    PS: 'Projekt(-Seminar)',
    PÜ: 'Praktische Übung',
    PCÜ: 'PC-Übung'
  }

  ngOnInit() {
    this.api.getModule().subscribe({
      next: (daten) => {
        this.module.set(daten);
        this.status.set('ok');
      },
      error: () => this.status.set('fehler'),
    });
  }
}