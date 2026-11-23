import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ModuleDetail } from './module-detail';
import { Module } from '../models/module';

// URL, die getModuleById für die ID '1' aufruft – mit modul-api abgleichen
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

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModuleDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // simuliert die URL /module/1
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
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
    expect(text()).toContain('6 ECTS');
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
});