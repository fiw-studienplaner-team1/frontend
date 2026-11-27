import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Prerequisite, PrerequisiteEdge } from '../models/prerequisite';
import { MOCK_PREREQUISITE_EDGES } from '../mocks/prerequisites.mock';

@Service()
export class ModulePrerequisitesApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';

  getPredecessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/predecessors/${moduleNumber}`);
  }

  getSuccessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/successors/${moduleNumber}`);
  }
  
  
  // TODO: Mock durch this.http.get<PrerequisiteEdge[]>(`${this.url}/prerequisites`) ersetzen, sobald das Backend GET /prerequisites liefert
  getAllPrerequisites(): Observable<PrerequisiteEdge[]> {
    return of(MOCK_PREREQUISITE_EDGES);
  }

  getPredecessorEdges(allEdges: PrerequisiteEdge[], moduleId: number): PrerequisiteEdge[] {
    const prerequisiteEdges: PrerequisiteEdge[] = [];
    const modulesToCheck: number[] = [moduleId];

    while (modulesToCheck.length > 0) {
      const currentModuleId = modulesToCheck.shift()!;

      for (const edge of allEdges) {
        if (edge.successorModuleId === currentModuleId && !prerequisiteEdges.some((e) => e.id === edge.id)) {
          prerequisiteEdges.push(edge);
          modulesToCheck.push(edge.predecessorModuleId);
        }
      }
    }

    return prerequisiteEdges;
  }

    getSuccessorEdges(allEdges: PrerequisiteEdge[], moduleId: number): PrerequisiteEdge[] {
    const prerequisiteEdges: PrerequisiteEdge[] = [];
    const modulesToCheck: number[] = [moduleId];

    while (modulesToCheck.length > 0) {
      const currentModuleId = modulesToCheck.shift()!;

      for (const edge of allEdges) {
        if (edge.predecessorModuleId === currentModuleId && !prerequisiteEdges.some((e) => e.id === edge.id)) {
          prerequisiteEdges.push(edge);
          modulesToCheck.push(edge.successorModuleId);
        }
      }
    }

    return prerequisiteEdges;
  }
}
