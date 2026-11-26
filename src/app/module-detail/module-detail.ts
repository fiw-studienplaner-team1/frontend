import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ModulApi } from '../services/modul-api';
import { HttpErrorResponse } from '@angular/common/http';
import { Module, MODULE_TYPE_LABEL, CYCLE_LABEL } from '../models/module';
import { ModulePrerequisites } from './module-prerequisites/module-prerequisites';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardSubtitle } from '@angular/material/card';


@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.css',
  imports: [ModulePrerequisites, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardSubtitle]
})
export class ModuleDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private modulApi = inject(ModulApi);

  status = signal<'loading' | 'error' | 'not-found' | 'ok'>('loading');
  modul = signal<Module | null>(null);

  readonly typeLabel = MODULE_TYPE_LABEL;
  readonly cycleLabel = CYCLE_LABEL;

  ngOnInit(): void {
  // feuert beim ersten Laden UND jedes Mal, wenn sich die id in der URL ändert
  this.route.paramMap.subscribe((params) => {
    this.loadModule(Number(params.get('id')));
  });
}

private loadModule(id: number): void {
  this.status.set('loading');
  this.modulApi.getModuleById(id).subscribe({
    next: (loadedModule) => {
      this.modul.set(loadedModule);
      this.status.set('ok');
    },
    error: (err: HttpErrorResponse) => {
      if (err.status === 404) {
        this.status.set('not-found');
      } else {
        this.status.set('error');
      }
    },
  });
}
}