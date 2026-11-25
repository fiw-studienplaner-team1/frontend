import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Prerequisite, PrerequisiteNode } from '../models/prerequisite';
import { ModulApi } from './modul-api';
import { MOCK_MODULES, MOCK_PREREQUISITE_ROWS } from '../mocks/prerequisites.mock';

@Service()
export class ModulePrerequisitesApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080';
  private modulApi = inject(ModulApi);

  // TODO: Mock ersetzen durch return this.http.get<Prerequisite[]>(`${this.url}/predecessor/${moduleNumber}`);, sobald der Prerequisite-PR gemerged ist
  getPredecessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    const predecessors: Prerequisite[] = [];

    for (const row of MOCK_PREREQUISITE_ROWS) {
      if (row.successor === moduleNumber) {
        const predecessorModule = MOCK_MODULES.find((m) => m.moduleNumber === row.predecessor);
        if (predecessorModule) {
          predecessors.push({ modulPrerequisiteId: predecessorModule.id, mode: row.mode });
        }
      }
    }

    return of(predecessors);
  }
  /*getPredecessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/predecessor/${moduleNumber}`);
  }*/

  // TODO: Mock ersetzen durch return this.http.get<Prerequisite[]>(`${this.url}/successor/${moduleNumber}`);, sobald der Prerequisite-PR gemerged ist
  getSuccessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    const successors: Prerequisite[] = [];

    for (const row of MOCK_PREREQUISITE_ROWS) {
      if (row.predecessor === moduleNumber) {
        const successorModule = MOCK_MODULES.find((m) => m.moduleNumber === row.successor);
        if (successorModule) {
          successors.push({ modulPrerequisiteId: successorModule.id, mode: row.mode });
        }
      }
    }

    return of(successors);
  }
  /*getSuccessorsByModuleNumber(moduleNumber: string): Observable<Prerequisite[]> {
    return this.http.get<Prerequisite[]>(`${this.url}/successor/${moduleNumber}`);
  }*/

  // TODO: Mock-Version ersetzen durch die auskommentierte Version, sobald der Prerequisite-PR gemerged ist
  async getPredecessorTree(moduleNumber: string): Promise<PrerequisiteNode[]> {
    const predecessorsOfOneModule: Prerequisite[] = await firstValueFrom(this.getPredecessorsByModuleNumber(moduleNumber));
    const predecessorNodesOfOneModule: PrerequisiteNode[] = [];

    for (const predecessor of predecessorsOfOneModule) {
      const predecessorModule = MOCK_MODULES.find((m) => m.id === predecessor.modulPrerequisiteId);
      if (predecessorModule) {
        const children = await this.getPredecessorTree(predecessorModule.moduleNumber);
        const node: PrerequisiteNode = {
          modulPrerequisiteId: predecessor.modulPrerequisiteId,
          mode: predecessor.mode,
          children: children,
        };
        predecessorNodesOfOneModule.push(node);
      }
    }
    return predecessorNodesOfOneModule;
  }
  /*async getPredecessorTree(moduleNumber: string): Promise<PrerequisiteNode[]> {
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
  }*/

  // TODO: Mock-Version ersetzen durch die auskommentierte Version, sobald der Prerequisite-PR gemerged ist
  async getSuccessorTree(moduleNumber: string): Promise<PrerequisiteNode[]> {
    const successorsOfOneModule: Prerequisite[] = await firstValueFrom(this.getSuccessorsByModuleNumber(moduleNumber));
    const successorNodesOfOneModule: PrerequisiteNode[] = [];

    for (const successor of successorsOfOneModule) {
      const successorModule = MOCK_MODULES.find((m) => m.id === successor.modulPrerequisiteId);
      if (successorModule) {
        const children = await this.getSuccessorTree(successorModule.moduleNumber);
        const node: PrerequisiteNode = {
          modulPrerequisiteId: successor.modulPrerequisiteId,
          mode: successor.mode,
          children: children,
        };
        successorNodesOfOneModule.push(node);
      }
    }
    return successorNodesOfOneModule;
  }
  /*async getSuccessorTree(moduleNumber: string): Promise<PrerequisiteNode[]> {
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
  }*/
}