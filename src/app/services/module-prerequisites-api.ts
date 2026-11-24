import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Prerequisite } from '../models/prerequisite';

@Service()
export class ModulePrerequisitesApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';

  // TODO: Mock ersetzen durch return this.http.get<Prerequisite[]>(`${this.url}/predecessor/${moduleNumber}`);, sobald der Prerequisite-PR gemerged ist
  getPredecessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return of([
      { modulPrerequisiteId: 5, mode: 'NECESSARY' },
      { modulPrerequisiteId: 8, mode: 'RECOMMENDED' },
    ]);
    
    // return this.http.get<Prerequisite[]>(`${this.url}/predecessor/${moduleNumber}`);
  }

  // TODO: Mock ersetzen durch return this.http.get<Prerequisite[]>(`${this.url}/successor/${moduleNumber}`);, sobald der Prerequisite-PR gemerged ist
  getSuccessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
   return of([
      { modulPrerequisiteId: 12, mode: 'NECESSARY' },
    ]);
    
    // return this.http.get<Prerequisite[]>(`${this.url}/successor/${moduleNumber}`);
  }
}