import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ModuleWithPrerequisites, Prerequisite, PrerequisiteEdge, PrerequisiteNode } from '../models/prerequisite';
import { ModulApi } from './modul-api';
import { E } from '@angular/cdk/keycodes';
import { MOCK_MODULES, MOCK_PREREQUISITE_ROWS } from '../mocks/prerequisites.mock';

@Service()
export class ModulePrerequisitesApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';
  private modulApi = inject(ModulApi);

  getPredecessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/predecessor/${moduleNumber}`);
  }

  getSuccessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/successor/${moduleNumber}`);
  }

    // TODO: Mock ersetzen durch return this.http.get<ModuleWithPrerequisites[]>(`${this.url}/prerequisites`);, sobald es den Endpunkt gibt
  getAllPrerequisitesOfAllModules(): Observable<ModuleWithPrerequisites[]> {
    const allModules: ModuleWithPrerequisites[] = [];

    for (const module of MOCK_MODULES) {
      const predecessors: Prerequisite[] = [];
      const successors: Prerequisite[] = [];

      for (const row of MOCK_PREREQUISITE_ROWS) {
        if (row.successor === module.moduleNumber) {
          const predecessorModule = MOCK_MODULES.find((m) => m.moduleNumber === row.predecessor);
          if (predecessorModule) {
            predecessors.push({ modulPrerequisiteId: predecessorModule.id, mode: row.mode });
          }
        }

        if (row.predecessor === module.moduleNumber) {
          const successorModule = MOCK_MODULES.find((m) => m.moduleNumber === row.successor);
          if (successorModule) {
            successors.push({ modulPrerequisiteId: successorModule.id, mode: row.mode });
          }
        }
      }

      allModules.push({ moduleId: module.id, predecessors: predecessors, successors: successors });
    }

    return of(allModules);
  }

getPredecessorEdges(allModules: ModuleWithPrerequisites[], moduleId: number): PrerequisiteEdge[] {
    const prerequisiteEdges: PrerequisiteEdge[] = [];
    const modulesToCheck: number[] = [moduleId];

    while (modulesToCheck.length > 0) {
      const currentModuleId = modulesToCheck.shift()!;
      const currentModule = allModules.find((m) => m.moduleId === currentModuleId);

      if (!currentModule) continue;

      for (const predecessor of currentModule.predecessors) {
        const newPredecessorEdge: PrerequisiteEdge = {
          predecessorId: predecessor.modulPrerequisiteId,
          successorId: currentModuleId,
          mode: predecessor.mode,
        };

        if (!(prerequisiteEdges.some(e => e.predecessorId === newPredecessorEdge.predecessorId && e.successorId === newPredecessorEdge.successorId))) {
          prerequisiteEdges.push(newPredecessorEdge);
          modulesToCheck.push(predecessor.modulPrerequisiteId);
        }
      }
    }

    return prerequisiteEdges;
  }

  getSuccessorEdges(allModules: ModuleWithPrerequisites[], moduleId: number): PrerequisiteEdge[] {
    const prerequisiteEdges: PrerequisiteEdge[] = [];
    const modulesToCheck: number[] = [moduleId];

    while (modulesToCheck.length > 0) {
      const currentModuleId = modulesToCheck.shift()!;
      const currentModule = allModules.find((m) => m.moduleId === currentModuleId);

      if (!currentModule) continue;

      for (const successor of currentModule.successors) {
        const newSuccessorEdge: PrerequisiteEdge = {
          predecessorId: currentModuleId,
          successorId: successor.modulPrerequisiteId,
          mode: successor.mode,
        };

        if (!(prerequisiteEdges.some(e => e.predecessorId === newSuccessorEdge.predecessorId && e.successorId === newSuccessorEdge.successorId))) {
          prerequisiteEdges.push(newSuccessorEdge);
          modulesToCheck.push(successor.modulPrerequisiteId);
        }
      }
    }

    return prerequisiteEdges;
  }

  async getPredecessorTree(moduleNumber: string): Promise<PrerequisiteNode[]> {
    const predecessorsOfOneModule: Prerequisite[] = await firstValueFrom(this.getPredecessorsByModuleNumber(moduleNumber));
    const predecessorNodesOfOneModule: PrerequisiteNode[] = [];

    for (const predecessor of predecessorsOfOneModule) {
      const predecessorModule = await firstValueFrom(this.modulApi.getModuleById(predecessor.modulPrerequisiteId));
      const children = await this.getPredecessorTree(predecessorModule.moduleNumber);
      const node: PrerequisiteNode = {
        modulPrerequisiteId: predecessor.modulPrerequisiteId,
        mode: predecessor.mode,
        children: children,
      };
      predecessorNodesOfOneModule.push(node);
    }
    return predecessorNodesOfOneModule;
  }

  async getSuccessorTree(moduleNumber: string): Promise<PrerequisiteNode[]> {
    const successorsOfOneModule: Prerequisite[] = await firstValueFrom(this.getSuccessorsByModuleNumber(moduleNumber));
    const successorNodesOfOneModule: PrerequisiteNode[] = [];

    for (const successor of successorsOfOneModule) {
      const successorModule = await firstValueFrom(this.modulApi.getModuleById(successor.modulPrerequisiteId));
      const children = await this.getSuccessorTree(successorModule.moduleNumber);
      const node: PrerequisiteNode = {
        modulPrerequisiteId: successor.modulPrerequisiteId,
        mode: successor.mode,
        children: children,
      };
      successorNodesOfOneModule.push(node);
    }
    return successorNodesOfOneModule;
  }
}