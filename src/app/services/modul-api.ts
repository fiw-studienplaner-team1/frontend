import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Module } from '../models/module';

@Injectable({ providedIn: 'root' })
export class ModulApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/modules';

  getModule(): Observable<Module[]> {
    return this.http.get<Module[]>(this.url);
  }

  getModuleById(id: string): Observable<Module> {
  return this.http.get<Module>(`${this.url}/${id}`);
}
}