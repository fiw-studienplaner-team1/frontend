import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ModulApi } from '../services/modul-api';
import { Modul, ModulArt, ModulTurnus } from '../models/modul';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.css'
})
export class ModuleDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private modulApi = inject(ModulApi);

  status = signal<'laden' | 'fehler' | 'nicht-gefunden' | 'ok'>('laden');
  modul = signal<Modul | null>(null);

  readonly artLabel: Record<ModulArt, string> = {
    PFLICHT: 'Pflichtmodul',
    WAHLPFLICHT: 'Wahlpflichtmodul'
  };

  readonly turnusLabel: Record<ModulTurnus, string> = {
    WISE: 'Wintersemester',
    SOSE: 'Sommersemester',
    SONST: 'Sonstiges',
  };

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.modulApi.getModuleById(id).subscribe({
      next: (modul) => {
        this.modul.set(modul);
        this.status.set('ok');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.status.set('nicht-gefunden');
        } else {
          this.status.set('fehler');
        }
      },
    });
  }
}