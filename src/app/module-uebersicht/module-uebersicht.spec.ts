import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ModuleUebersicht } from './module-uebersicht';
import { Modul } from '../models/modul';

const URL = 'http://localhost:8080/modules';

const testDaten: Modul[] = [
  { id: 'B11', name: 'Programmierung 1', semester: 1, ects: 6, sws: 6, art: 'PFLICHT', turnus: 'WISE' },
  { id: 'B63', name: 'AWE-Modul 1', semester: 6, ects: 2, sws: 2, art: 'WAHLPFLICHT', turnus: null },
  { id: 'B34.1', name: 'Softwareentwicklungsprojekt', semester: 3, ects: 0, sws: 4, art: null, turnus: 'WISE' },
];

describe('ModuleUebersicht', () => {
  let fixture: ComponentFixture<ModuleUebersicht>;
  let httpMock: HttpTestingController;

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModuleUebersicht],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(ModuleUebersicht);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // löst ngOnInit und die Anfrage aus
  });

  afterEach(() => httpMock.verify());

  it('zeigt während des Ladens einen Ladehinweis', () => {
    expect(text()).toContain('Module werden geladen');
    httpMock.expectOne(URL);
  });

  it('zeigt alle Module nach erfolgreichem Laden', () => {
    httpMock.expectOne(URL).flush(testDaten);
    fixture.detectChanges();

    const eintraege = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(eintraege.length).toBe(3);
    expect(text()).not.toContain('Module werden geladen');
  });

  it('zeigt Name, ECTS, SWS und Art als Text', () => {
    httpMock.expectOne(URL).flush(testDaten);
    fixture.detectChanges();

    const erster = (fixture.nativeElement as HTMLElement).querySelector('li')!.textContent!;
    expect(erster).toContain('Programmierung 1');
    expect(erster).toContain('6 ECTS');
    expect(erster).toContain('6 SWS');
    expect(erster).toContain('Pflicht');
  });

  it('zeigt Fallbacks, wenn art oder turnus null sind', () => {
    httpMock.expectOne(URL).flush(testDaten);
    fixture.detectChanges();

    const eintraege = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(eintraege[1].textContent).toContain('k. A.'); // turnus null
    expect(eintraege[2].textContent).toContain('k. A.'); // art null
  });

  it('zeigt eine Fehlermeldung, wenn das Backend einen Fehler liefert', () => {
    httpMock.expectOne(URL).flush('Fehler', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(text()).toContain('konnten nicht geladen werden');
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('li').length).toBe(0);
  });
});