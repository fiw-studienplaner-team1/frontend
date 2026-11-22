import { Component, signal, OnInit, inject } from '@angular/core';
import { Module, MODULE_TYPE_LABEL, CYCLE_LABEL, MODULE_FORM_LABEL } from '../models/module';
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
  module = signal<Module[]>([]);

  readonly typeLabel = MODULE_TYPE_LABEL;
  readonly cycleLabel = CYCLE_LABEL;
  readonly formLabel = MODULE_FORM_LABEL;

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