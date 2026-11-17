import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ModulApi } from './modul-api';
import { Modul } from '../models/modul';

describe('ModulApi', () => {
  let api: ModulApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ModulApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('ruft GET /modules auf und liefert die Module', () => {
    const testDaten: Modul[] = [
      { id: 'B11', name: 'Programmierung 1', semester: 1, ects: 6, sws: 6, art: 'PFLICHT', turnus: 'WISE' },
    ];
    let ergebnis: Modul[] = [];

    api.getModule().subscribe((m) => (ergebnis = m));

    const req = httpMock.expectOne('http://localhost:8080/modules');
    expect(req.request.method).toBe('GET');
    req.flush(testDaten);

    expect(ergebnis).toEqual(testDaten);
  });
});