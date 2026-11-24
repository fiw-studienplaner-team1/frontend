import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ModulApi } from '../services/modul-api';
import { HttpErrorResponse } from '@angular/common/http';
import { Module, MODULE_TYPE_LABEL, CYCLE_LABEL } from '../models/module';


@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.css'
})
export class ModuleDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private modulApi = inject(ModulApi);

  status = signal<'loading' | 'error' | 'not-found' | 'ok'>('loading');
  modul = signal<Module | null>(null);

  readonly typeLabel = MODULE_TYPE_LABEL;
  readonly cycleLabel = CYCLE_LABEL;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

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