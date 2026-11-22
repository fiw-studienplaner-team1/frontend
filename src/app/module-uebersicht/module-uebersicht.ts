import { Component, signal, OnInit, inject } from '@angular/core';
import { Modul, MODUL_ART_LABEL, MODUL_TURNUS_LABEL } from '../models/modul';
import { ModulApi } from '../services/modul-api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-module-uebersicht',
  imports: [RouterLink],
  templateUrl: './module-uebersicht.html',
})
export class ModuleUebersicht implements OnInit {
  private api = inject(ModulApi); 

  status = signal<'loading' | 'error' | 'ok'>('loading');
  module = signal<Modul[]>([]);

  readonly artLabel = MODUL_ART_LABEL;
  readonly turnusLabel = MODUL_TURNUS_LABEL;


  ngOnInit() {
    this.api.getModule().subscribe({
      next: (daten) => {
        this.module.set(daten);
        this.status.set('ok');
      },
      error: () => this.status.set('error'),
    });
  }
}