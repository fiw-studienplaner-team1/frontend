import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ModulePrerequisitesApi } from './module-prerequisites-api';
import { PrerequisiteEdge } from '../models/prerequisite';
import { MOCK_PREREQUISITE_EDGES } from '../mocks/prerequisites.mock';

/*
 * Testdaten (eine Kante pro Zeile in module_prerequisites):
 *
 *   1 (B11) ──empfohlen──> 2 (B21)
 *   1 (B11) ──notwendig──> 3 (B34)
 *   2 (B21) ──empfohlen──> 3 (B34)
 *   3 (B34) ──notwendig──> 4 (B56)
 *
 * 1 -> 3 gibt es auf zwei Wegen (direkt und über 2). Daran sieht man, ob doppelte Kanten entstehen.
 */
const B11_TO_B21: PrerequisiteEdge = { id: 1, predecessorModuleId: 1, predecessorModuleNumber: 'B11', successorModuleId: 2, successorModuleNumber: 'B21', prerequisiteMode: 'EMPFOHLEN' };
const B11_TO_B34: PrerequisiteEdge = { id: 2, predecessorModuleId: 1, predecessorModuleNumber: 'B11', successorModuleId: 3, successorModuleNumber: 'B34', prerequisiteMode: 'NOTWENDIG' };
const B21_TO_B34: PrerequisiteEdge = { id: 3, predecessorModuleId: 2, predecessorModuleNumber: 'B21', successorModuleId: 3, successorModuleNumber: 'B34', prerequisiteMode: 'EMPFOHLEN' };
const B34_TO_B56: PrerequisiteEdge = { id: 4, predecessorModuleId: 3, predecessorModuleNumber: 'B34', successorModuleId: 4, successorModuleNumber: 'B56', prerequisiteMode: 'NOTWENDIG' };

const ALL_PREREQUISITES: PrerequisiteEdge[] = [B11_TO_B21, B11_TO_B34, B21_TO_B34, B34_TO_B56];

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

      expect(edges).toEqual(expect.arrayContaining([B34_TO_B56, B11_TO_B34, B21_TO_B34, B11_TO_B21]));
      expect(edges.length).toBe(4);
    });

    it('enthält jede Kante nur einmal, auch wenn sie über mehrere Wege erreichbar ist', () => {
      const edges = service.getPredecessorEdges(ALL_PREREQUISITES, 3);
      const ids = edges.map((e) => e.id);

      expect(new Set(ids).size).toBe(ids.length);
    });

    it('übernimmt den Modus (notwendig / empfohlen) der Voraussetzung', () => {
      const edges = service.getPredecessorEdges(ALL_PREREQUISITES, 3);

      expect(edges.find((e) => e.predecessorModuleId === 1 && e.successorModuleId === 3)?.prerequisiteMode).toBe('NOTWENDIG');
      expect(edges.find((e) => e.predecessorModuleId === 2 && e.successorModuleId === 3)?.prerequisiteMode).toBe('EMPFOHLEN');
    });

    it('liefert keine Nachfolger-Kanten', () => {
      const edges = service.getPredecessorEdges(ALL_PREREQUISITES, 3);

      expect(edges.some((e) => e.predecessorModuleId === 3)).toBe(false);
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

      expect(edges).toEqual(expect.arrayContaining([B11_TO_B21, B11_TO_B34, B21_TO_B34, B34_TO_B56]));
      expect(edges.length).toBe(4);
    });

    it('enthält jede Kante nur einmal, auch wenn sie über mehrere Wege erreichbar ist', () => {
      const edges = service.getSuccessorEdges(ALL_PREREQUISITES, 1);
      const ids = edges.map((e) => e.id);

      expect(new Set(ids).size).toBe(ids.length);
    });

    it('liefert keine Vorgänger-Kanten', () => {
      const edges = service.getSuccessorEdges(ALL_PREREQUISITES, 3);

      expect(edges).toEqual([B34_TO_B56]);
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
    it('liefert die Kanten aus den Mockdaten', () => {
      let result: PrerequisiteEdge[] = [];
      service.getAllPrerequisites().subscribe((data) => (result = data));

      expect(result).toEqual(MOCK_PREREQUISITE_EDGES);
    });
  });

  describe('HTTP-Aufrufe', () => {
    it('getPredecessorsByModuleNumber ruft /predecessors/{moduleNumber} auf', () => {
      service.getPredecessorsByModuleNumber('B34').subscribe();

      const request = httpTesting.expectOne('http://localhost:8080/predecessors/B34');
      expect(request.request.method).toBe('GET');
      request.flush([]);
    });

    it('getSuccessorsByModuleNumber ruft /successors/{moduleNumber} auf', () => {
      service.getSuccessorsByModuleNumber('B11').subscribe();

      const request = httpTesting.expectOne('http://localhost:8080/successors/B11');
      expect(request.request.method).toBe('GET');
      request.flush([]);
    });
  });
});