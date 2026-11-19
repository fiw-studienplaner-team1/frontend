import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ModulApi } from '../services/modul-api';
import { HttpErrorResponse } from '@angular/common/http';
import { Modul, MODUL_ART_LABEL, MODUL_TURNUS_LABEL } from '../models/modul';


@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.css'
})
export class ModuleDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private modulApi = inject(ModulApi);

  status = signal<'loading' | 'error' | 'not-found' | 'ok'>('loading');
  modul = signal<Modul | null>(null);

  readonly artLabel = MODUL_ART_LABEL;
  readonly turnusLabel = MODUL_TURNUS_LABEL;

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

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