import { Component, signal, OnInit, inject } from '@angular/core';
import { Modul, ModulArt } from '../models/modul';
import { ModulApi } from '../services/modul-api';

@Component({
  selector: 'app-module-uebersicht',
  imports: [],
  templateUrl: './module-uebersicht.html',
})
export class ModuleUebersicht implements OnInit {
  private api = inject(ModulApi); 

  status = signal<'laden' | 'fehler' | 'ok'>('laden');
  module = signal<Modul[]>([]);

  readonly artLabel: Record<ModulArt, string> = {
    PFLICHT: 'Pflicht',
    WAHLPFLICHT: 'Wahlpflicht',
    AWE: 'AWE',
  };

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