import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ModulApi } from '../services/modul-api';
import { Modul } from '../models/modul';

@Component({
  selector: 'app-module-detail',
  imports: [JsonPipe],
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.css'
})
export class ModuleDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private modulApi = inject(ModulApi);

  modul = signal<Modul | null>(null);

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.modulApi.getModuleById(id).subscribe(modul => {
      this.modul.set(modul);
    });
  }
}