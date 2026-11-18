import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ModuleDetail } from './module-detail';
import { Modul } from '../models/modul';

// URL, die getModuleById fuer die ID 'B11' aufruft – mit modul-api abgleichen
const URL = 'http://localhost:8080/modules/B11';

const testModul: Modul = {
  id: 'B11',
  name: 'Programmierung 1',
  semester: 1,
  ects: 6,
  sws: 6,
  art: 'PFLICHT',
  turnus: 'WISE',
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
        // simuliert die URL /module/B11
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'B11' }) } },
        },
      ],
    });
    fixture = TestBed.createComponent(ModuleDetail);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // loest ngOnInit und die Anfrage aus
  });

  afterEach(() => httpMock.verify());

  it('zeigt waehrend des Ladens einen Ladehinweis', () => {
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

  it('zeigt Fallbacks, wenn art und turnus null sind', () => {
    httpMock.expectOne(URL).flush({ ...testModul, art: null, turnus: null });
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
    // Netzwerkfehler ohne Antwort, Statuscode 0
    httpMock.expectOne(URL).error(new ProgressEvent('error'));
    fixture.detectChanges();

    expect(text()).toContain('konnte nicht geladen werden');
  });
});