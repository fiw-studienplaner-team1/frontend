import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ModuleUebersicht } from './module-uebersicht';
import { Module } from '../models/module';

const URL = 'http://localhost:8080/modules';

const testDaten: Module[] = [
  { id: 1, name: 'Programmierung 1', moduleNumber: 'B11', recommendedSemester: 1, ects: 6, weeklyHours: 6, moduleForm: 'SL', moduleType: 'PFLICHT', cycle: 'WISE' },
  { id: 2, name: 'AWE-Modul 1', moduleNumber: 'B63', recommendedSemester: 6, ects: 2, weeklyHours: 2, moduleForm: null, moduleType: 'WAHLPFLICHT', cycle: null },
  { id: 3, name: 'Softwareentwicklungsprojekt', moduleNumber: 'B34.1', recommendedSemester: 3, ects: 0, weeklyHours: 4, moduleForm: 'PS', moduleType: null, cycle: 'WISE' },
];

describe('ModuleUebersicht', () => {
  let fixture: ComponentFixture<ModuleUebersicht>;
  let httpMock: HttpTestingController;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModuleUebersicht],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(ModuleUebersicht);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('zeigt während des Ladens einen Ladehinweis', () => {
    expect(text()).toContain('Module werden geladen');
    httpMock.expectOne(URL);
  });

  it('zeigt alle Module nach erfolgreichem Laden', () => {
    httpMock.expectOne(URL).flush(testDaten);
    fixture.detectChanges();

    expect(el().querySelectorAll('li').length).toBe(3);
    expect(text()).not.toContain('Module werden geladen');
  });

  it('zeigt Name, ECTS, SWS, Form, Art und Turnus als Text', () => {
    httpMock.expectOne(URL).flush(testDaten);
    fixture.detectChanges();

    const erster = el().querySelector('li')!.textContent!;
    expect(erster).toContain('Programmierung 1');
    expect(erster).toContain('6 ECTS');
    expect(erster).toContain('6 SWS');
    expect(erster).toContain('Seminaristischer Lehrvortrag');
    expect(erster).toContain('Pflichtmodul');
    expect(erster).toContain('Wintersemester');
  });

  it('zeigt Fallbacks, wenn moduleForm, moduleType oder cycle null sind', () => {
    httpMock.expectOne(URL).flush(testDaten);
    fixture.detectChanges();

    const eintraege = el().querySelectorAll('li');
    expect(eintraege[1].textContent).toContain('k.A');   // moduleForm null
    expect(eintraege[1].textContent).toContain('k. A.'); // cycle null
    expect(eintraege[2].textContent).toContain('k. A.'); // moduleType null
  });

  it('zeigt eine Fehlermeldung, wenn das Backend einen Fehler liefert', () => {
    httpMock.expectOne(URL).flush('Fehler', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(text()).toContain('konnten nicht geladen werden');
    expect(el().querySelectorAll('li').length).toBe(0);
  });
});