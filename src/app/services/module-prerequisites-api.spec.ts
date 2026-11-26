import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ModulePrerequisitesApi } from './module-prerequisites-api';
import { ModuleWithPrerequisites } from '../models/prerequisite';

/*
 * Testdaten (ids statt Modulnummern, wie im echten Code):
 *
 *   1 (B11) ──empfohlen──> 2 (B21)
 *   1 (B11) ──notwendig──> 3 (B34)
 *   2 (B21) ──empfohlen──> 3 (B34)
 *   3 (B34) ──notwendig──> 4 (B56)
 *   5 (B16) hat keine Voraussetzungen und ist keine
 *
 * 1 -> 3 gibt es auf zwei Wegen (direkt und über 2). Daran sieht man, ob doppelte Kanten entstehen.
 */
const ALL_PREREQUISITES: ModuleWithPrerequisites[] = [
  {
    moduleId: 1,
    predecessors: [],
    successors: [
      { moduleId: 2, mode: 'RECOMMENDED' },
      { moduleId: 3, mode: 'NECESSARY' },
    ],
  },
  {
    moduleId: 2,
    predecessors: [{ moduleId: 1, mode: 'RECOMMENDED' }],
    successors: [{ moduleId: 3, mode: 'RECOMMENDED' }],
  },
  {
    moduleId: 3,
    predecessors: [
      { moduleId: 1, mode: 'NECESSARY' },
      { moduleId: 2, mode: 'RECOMMENDED' },
    ],
    successors: [{ moduleId: 4, mode: 'NECESSARY' }],
  },
  {
    moduleId: 4,
    predecessors: [{ moduleId: 3, mode: 'NECESSARY' }],
    successors: [],
  },
  { moduleId: 5, predecessors: [], successors: [] },
];

describe('ModulePrerequisitesApi', () => {
  let service: ModulePrerequisitesApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ModulePrerequisitesApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getPredecessorEdges', () => {
    it('liefert direkte und indirekte Vorgänger', () => {
      const edges = service.getPredecessorEdges(ALL_PREREQUISITES, 4);

      expect(edges).toEqual(
        expect.arrayContaining([
          { predecessorId: 3, successorId: 4, mode: 'NECESSARY' },
          { predecessorId: 1, successorId: 3, mode: 'NECESSARY' },
          { predecessorId: 2, successorId: 3, mode: 'RECOMMENDED' },
          { predecessorId: 1, successorId: 2, mode: 'RECOMMENDED' },
        ]),
      );
      expect(edges.length).toBe(4);
    });

    it('enthält jede Kante nur einmal, auch wenn sie über mehrere Wege erreichbar ist', () => {
      const edges = service.getPredecessorEdges(ALL_PREREQUISITES, 3);
      const keys = edges.map((e) => e.predecessorId + '-' + e.successorId);

      expect(new Set(keys).size).toBe(keys.length);
    });

    it('übernimmt den Modus (notwendig / empfohlen) der Voraussetzung', () => {
      const edges = service.getPredecessorEdges(ALL_PREREQUISITES, 3);

      expect(edges.find((e) => e.predecessorId === 1 && e.successorId === 3)?.mode).toBe('NECESSARY');
      expect(edges.find((e) => e.predecessorId === 2 && e.successorId === 3)?.mode).toBe('RECOMMENDED');
    });

    it('liefert keine Nachfolger-Kanten', () => {
      const edges = service.getPredecessorEdges(ALL_PREREQUISITES, 3);

      expect(edges.some((e) => e.predecessorId === 3)).toBe(false);
    });

    it('liefert eine leere Liste für ein Modul ohne Vorgänger', () => {
      expect(service.getPredecessorEdges(ALL_PREREQUISITES, 1)).toEqual([]);
    });

    it('liefert eine leere Liste für eine unbekannte id', () => {
      expect(service.getPredecessorEdges(ALL_PREREQUISITES, 999)).toEqual([]);
    });
  });

  describe('getSuccessorEdges', () => {
    it('liefert direkte und indirekte Nachfolger', () => {
      const edges = service.getSuccessorEdges(ALL_PREREQUISITES, 1);

      expect(edges).toEqual(
        expect.arrayContaining([
          { predecessorId: 1, successorId: 2, mode: 'RECOMMENDED' },
          { predecessorId: 1, successorId: 3, mode: 'NECESSARY' },
          { predecessorId: 2, successorId: 3, mode: 'RECOMMENDED' },
          { predecessorId: 3, successorId: 4, mode: 'NECESSARY' },
        ]),
      );
      expect(edges.length).toBe(4);
    });

    it('enthält jede Kante nur einmal, auch wenn sie über mehrere Wege erreichbar ist', () => {
      const edges = service.getSuccessorEdges(ALL_PREREQUISITES, 1);
      const keys = edges.map((e) => e.predecessorId + '-' + e.successorId);

      expect(new Set(keys).size).toBe(keys.length);
    });

    it('liefert keine Vorgänger-Kanten', () => {
      const edges = service.getSuccessorEdges(ALL_PREREQUISITES, 3);

      expect(edges).toEqual([{ predecessorId: 3, successorId: 4, mode: 'NECESSARY' }]);
    });

    it('liefert eine leere Liste für ein Modul ohne Nachfolger', () => {
      expect(service.getSuccessorEdges(ALL_PREREQUISITES, 4)).toEqual([]);
    });

    it('liefert eine leere Liste für eine unbekannte id', () => {
      expect(service.getSuccessorEdges(ALL_PREREQUISITES, 999)).toEqual([]);
    });
  });

  describe('getAllPrerequisites', () => {
    // TODO: anpassen, sobald der Mock durch GET /prerequisites ersetzt ist (dann mit httpTesting.expectOne prüfen)
    it('liefert zu jedem Vorgänger auch den passenden Nachfolger-Eintrag', () => {
      let result: ModuleWithPrerequisites[] = [];
      service.getAllPrerequisites().subscribe((data) => (result = data));

      for (const module of result) {
        for (const predecessor of module.predecessors) {
          const predecessorModule = result.find((m) => m.moduleId === predecessor.moduleId);
          expect(predecessorModule?.successors).toContainEqual({ moduleId: module.moduleId, mode: predecessor.mode });
        }
      }
    });
  });

  describe('HTTP-Aufrufe', () => {
    it('getPredecessorsByModuleNumber ruft /predecessor/{moduleNumber} auf', () => {
      service.getPredecessorsByModuleNumber('B34').subscribe();

      const request = httpTesting.expectOne('http://localhost:8080/predecessor/B34');
      expect(request.request.method).toBe('GET');
      request.flush([]);
    });

    it('getSuccessorsByModuleNumber ruft /successor/{moduleNumber} auf', () => {
      service.getSuccessorsByModuleNumber('B11').subscribe();

      const request = httpTesting.expectOne('http://localhost:8080/successor/B11');
      expect(request.request.method).toBe('GET');
      request.flush([]);
    });
  });
});