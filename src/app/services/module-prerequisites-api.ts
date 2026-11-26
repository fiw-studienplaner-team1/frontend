import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ModuleWithPrerequisites, Prerequisite, PrerequisiteEdge } from '../models/prerequisite';
import { MOCK_MODULES, MOCK_PREREQUISITE_ROWS } from '../mocks/prerequisites.mock';

@Service()
export class ModulePrerequisitesApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';

  getPredecessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/predecessor/${moduleNumber}`);
  }

  getSuccessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/successor/${moduleNumber}`);
  }
  
  
  // TODO: Mock durch this.http.get<ModuleWithPrerequisites[]>(`${this.url}/prerequisites`) ersetzen, sobald das Backend GET /prerequisites liefert
  getAllPrerequisites(): Observable<ModuleWithPrerequisites[]> {
    const modulesWithPrerequisites: ModuleWithPrerequisites[] = [];

    for (const module of MOCK_MODULES) {
      const predecessors: Prerequisite[] = [];
      const successors: Prerequisite[] = [];

      for (const row of MOCK_PREREQUISITE_ROWS) {
        if (row.successor === module.moduleNumber) {
          const predecessorModule = MOCK_MODULES.find((m) => m.moduleNumber === row.predecessor);
          if (predecessorModule) {
            predecessors.push({ moduleId: predecessorModule.id, mode: row.mode });
          }
        }

        if (row.predecessor === module.moduleNumber) {
          const successorModule = MOCK_MODULES.find((m) => m.moduleNumber === row.successor);
          if (successorModule) {
            successors.push({ moduleId: successorModule.id, mode: row.mode });
          }
        }
      }

      modulesWithPrerequisites.push({ moduleId: module.id, predecessors: predecessors, successors: successors });
    }

    return of(modulesWithPrerequisites);
  }

  getPredecessorEdges(modulesWithPrerequisites: ModuleWithPrerequisites[], moduleId: number): PrerequisiteEdge[] {
    const prerequisiteEdges: PrerequisiteEdge[] = [];
    const modulesToCheck: number[] = [moduleId];

    while (modulesToCheck.length > 0) {
      const currentModuleId = modulesToCheck.shift()!;
      const currentModule = modulesWithPrerequisites.find((m) => m.moduleId === currentModuleId);

      if (!currentModule) continue;

      for (const predecessor of currentModule.predecessors) {
        const newPredecessorEdge: PrerequisiteEdge = {
          predecessorId: predecessor.moduleId,
          successorId: currentModuleId,
          mode: predecessor.mode,
        };

        if (!(prerequisiteEdges.some(e => e.predecessorId === newPredecessorEdge.predecessorId && e.successorId === newPredecessorEdge.successorId))) {
          prerequisiteEdges.push(newPredecessorEdge);
          modulesToCheck.push(predecessor.moduleId);
        }
      }
    }

    return prerequisiteEdges;
  }

  getSuccessorEdges(modulesWithPrerequisites: ModuleWithPrerequisites[], moduleId: number): PrerequisiteEdge[] {
    const prerequisiteEdges: PrerequisiteEdge[] = [];
    const modulesToCheck: number[] = [moduleId];

    while (modulesToCheck.length > 0) {
      const currentModuleId = modulesToCheck.shift()!;
      const currentModule = modulesWithPrerequisites.find((m) => m.moduleId === currentModuleId);

      if (!currentModule) continue;

      for (const successor of currentModule.successors) {
        const newSuccessorEdge: PrerequisiteEdge = {
          predecessorId: currentModuleId,
          successorId: successor.moduleId,
          mode: successor.mode,
        };

        if (!(prerequisiteEdges.some(e => e.predecessorId === newSuccessorEdge.predecessorId && e.successorId === newSuccessorEdge.successorId))) {
          prerequisiteEdges.push(newSuccessorEdge);
          modulesToCheck.push(successor.moduleId);
        }
      }
    }

    return prerequisiteEdges;
  }
}
