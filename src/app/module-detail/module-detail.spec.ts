import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ModuleDetail } from './module-detail';
import { ModulePrerequisites } from './module-prerequisites/module-prerequisites';
import { Module } from '../models/module';

const URL = 'http://localhost:8080/modules/1';

const testModul: Module = {
  id: 1,
  name: 'Programmierung 1',
  moduleNumber: 'B11',
  recommendedSemester: 1,
  ects: 6,
  weeklyHours: 6,
  moduleType: 'PFLICHT',
  cycle: 'WISE',
  moduleForm: 'SL',
};

describe('ModuleDetail', () => {
  let fixture: ComponentFixture<ModuleDetail>;
  let httpMock: HttpTestingController;
  let paramMap: BehaviorSubject<ParamMap>;

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(() => {
    paramMap = new BehaviorSubject(convertToParamMap({ id: '1' }));

    TestBed.configureTestingModule({
      imports: [ModuleDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { paramMap },
        },
      ],
    })
      .overrideComponent(ModuleDetail, {
        remove: { imports: [ModulePrerequisites] },
        add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      });
    fixture = TestBed.createComponent(ModuleDetail);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('zeigt während des Ladens einen Ladehinweis', () => {
    expect(text()).toContain('Modul wird geladen');
    httpMock.expectOne(URL);
  });

  it('fragt das Modul mit der ID aus der URL ab', () => {
    const anfrage = httpMock.expectOne(URL);
    expect(anfrage.request.method).toBe('GET');
  });

  it('zeigt Name, ECTS, SWS, Art und Turnus nach erfolgreichem Laden', () => {
    httpMock.expectOne(URL).flush(testModul);
    fixture.detectChanges();

    expect(text()).toContain('Programmierung 1');
    expect(text()).toMatch(/ECTS-Punkte\s*6/);
    expect(text()).toContain('6 SWS');
    expect(text()).toContain('Pflichtmodul');
    expect(text()).toContain('Wintersemester');
    expect(text()).not.toContain('Modul wird geladen');
  });

  it('zeigt Fallbacks, wenn moduleType und cycle null sind', () => {
    httpMock.expectOne(URL).flush({ ...testModul, moduleType: null, cycle: null });
    fixture.detectChanges();

    const anzahlFallbacks = text().split('k. A.').length - 1;
    expect(anzahlFallbacks).toBe(2);
  });

  it('zeigt "nicht gefunden", wenn das Backend 404 liefert', () => {
    httpMock.expectOne(URL).flush('Not Found', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(text()).toContain('konnte nicht gefunden werden');
    expect(text()).not.toContain('konnte nicht geladen werden');
    expect(text()).not.toContain('Programmierung 1');
  });

  it('zeigt eine Fehlermeldung, wenn das Backend einen Serverfehler liefert', () => {
    httpMock.expectOne(URL).flush('Fehler', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(text()).toContain('konnte nicht geladen werden');
    expect(text()).not.toContain('konnte nicht gefunden werden');
  });

  it('zeigt eine Fehlermeldung, wenn das Backend nicht erreichbar ist', () => {
    httpMock.expectOne(URL).error(new ProgressEvent('error'));
    fixture.detectChanges();

    expect(text()).toContain('konnte nicht geladen werden');
  });

  it('lädt neu, wenn sich die ID in der URL ändert', () => {
    httpMock.expectOne(URL).flush(testModul);
    fixture.detectChanges();

    paramMap.next(convertToParamMap({ id: '2' }));
    httpMock
      .expectOne('http://localhost:8080/modules/2')
      .flush({ ...testModul, id: 2, name: 'Programmierung 2', moduleNumber: 'B21' });
    fixture.detectChanges();

    expect(text()).toContain('Programmierung 2');
    expect(text()).not.toContain('Programmierung 1');
  });
});