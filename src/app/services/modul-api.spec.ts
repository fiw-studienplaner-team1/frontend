import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ModulApi } from './modul-api';
import { Module } from '../models/module';

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
    const testDaten: Module[] = [
      { id: 1, name: 'Programmierung 1', moduleNumber: 'B11', recommendedSemester: 1, ects: 6, weeklyHours: 6, moduleForm: 'SL', moduleType: 'PFLICHT', cycle: 'WISE' },
    ];
    let ergebnis: Module[] = [];

    api.getModule().subscribe((m) => (ergebnis = m));

    const req = httpMock.expectOne('http://localhost:8080/modules');
    expect(req.request.method).toBe('GET');
    req.flush(testDaten);

    expect(ergebnis).toEqual(testDaten);
  });
});