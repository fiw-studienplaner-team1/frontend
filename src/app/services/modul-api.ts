import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Module } from '../models/module';

@Injectable({ providedIn: 'root' })
export class ModulApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/modules';

  //TODO: im Semester-Service mit reinnehemen, sobald die BE-Anbindung fuer Semester da ist
  HOURS_PER_ECTS: number = 30;
  LECTURE_WEEKS_PER_SEMESTER: number = 15;

  getModule(): Observable<Module[]> {
    return this.http.get<Module[]>(this.url);
  }

  getModuleById(id: number): Observable<Module> {
  return this.http.get<Module>(`${this.url}/${id}`);
  }

  getWorkloadPerSemester(ects: number): number {
    return (ects * this.HOURS_PER_ECTS);
  }

  getWorkloadPerWeek(ects: number): number {
    return (ects * this.HOURS_PER_ECTS) / this.LECTURE_WEEKS_PER_SEMESTER;
  }
}