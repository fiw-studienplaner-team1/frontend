import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModulApi } from '../services/modul-api';
import { HttpErrorResponse } from '@angular/common/http';
import { Module, MODULE_TYPE_LABEL, CYCLE_LABEL, MODULE_FORM_LABEL } from '../models/module';
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
  private moduleApi = inject(ModulApi);

  status = signal<'loading' | 'error' | 'not-found' | 'ok'>('loading');
  module = signal<Module | null>(null);

  readonly typeLabel = MODULE_TYPE_LABEL;
  readonly cycleLabel = CYCLE_LABEL;
  readonly formLabel = MODULE_FORM_LABEL;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.loadModule(Number(params.get('id')));
    });
  }

  private loadModule(id: number): void {
    this.status.set('loading');
    this.moduleApi.getModuleById(id).subscribe({
      next: (loadedModule) => {
        this.module.set(loadedModule);
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

  getWorkloadPerSemester(ects: number): number {
    return this.moduleApi.getWorkloadPerSemester(ects);
  }

  getWorkloadPerWeek(ects: number): number {
    return this.moduleApi.getWorkloadPerWeek(ects);
  }
}
