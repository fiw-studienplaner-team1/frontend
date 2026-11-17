import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Modul } from '../models/modul';

@Injectable({ providedIn: 'root' })
export class ModulApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/modules';

  getModule(): Observable<Modul[]> {
    return this.http.get<Modul[]>(this.url);
  }
}