import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { Moduleplanner } from './moduleplanner';
import { SemesterplanApi } from '../services/semesterplan-api';
import { Semesterplan } from '../models/semesterplan';
import { Module } from '../models/module';

const katalog: Module[] = [
  { id: 1, name: 'Programmierung 1', moduleNumber: 'B11', ects: 6, weeklyHours: 6, moduleType: 'PFLICHT', cycle: 'WISE', moduleForm: 'SL' },
  { id: 2, name: 'Datenbanken', moduleNumber: 'B63', ects: 5, weeklyHours: 4, moduleType: 'PFLICHT', cycle: 'SOSE', moduleForm: 'PÜ' },
  { id: 3, name: 'AWE-Modul', moduleNumber: 'B99', ects: 2, weeklyHours: 2, moduleType: null, cycle: null, moduleForm: null },
];

const plaene = [
  {
    id: 100,
    semesterLabel: 'Semester 1',
    modules: [{ id: 10, moduleId: 1, moduleName: 'Programmierung 1', ects: 6, weeklyHours: 6 }],
  },
  { id: 200, semesterLabel: 'Semester 2', modules: [] },
] as unknown as Semesterplan[];

class FakeApi {
  modules$: Observable<Module[]> = of(katalog);
  plans$: Observable<Semesterplan[]> = of(plaene);
  enroll$: Observable<unknown> = of({});
  enrollCalls: [number, number][] = [];
  planLoads = 0;

  getModules() { return this.modules$; }
  getSemesterplan() { this.planLoads++; return this.plans$; }
  addEnrollModule(planId: number, moduleId: number) {
    this.enrollCalls.push([planId, moduleId]);
    return this.enroll$;
  }
}

class FakeSnackBar {
  messages: string[] = [];
  open(message: string) { this.messages.push(message); }
}

describe('Moduleplanner', () => {
  let api: FakeApi;
  let snack: FakeSnackBar;

  function setup(prepare?: (a: FakeApi) => void) {
    api = new FakeApi();
    snack = new FakeSnackBar();
    prepare?.(api);
    TestBed.configureTestingModule({
      imports: [Moduleplanner],
      providers: [
        { provide: SemesterplanApi, useValue: api },
        { provide: MatSnackBar, useValue: snack },
      ],
    });
    const fixture = TestBed.createComponent(Moduleplanner);
    fixture.detectChanges(); // ngOnInit
    return { fixture, component: fixture.componentInstance };
  }

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('Laden', () => {
    it('setzt beide Status auf "ok" nach erfolgreichem Laden', () => {
      const { component } = setup();
      expect(component.status()).toBe('ok');
      expect(component.catalogStatus()).toBe('ok');
      expect(component.modules().length).toBe(3);
      expect(component.semesterplan().length).toBe(2);
    });

    it('zeigt Ladehinweise, solange nichts geladen ist', () => {
      const { fixture } = setup((a) => { a.modules$ = NEVER; a.plans$ = NEVER; });
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Semesterpläne werden geladen');
      expect(text).toContain('Modulkatalog wird geladen');
    });

    it('setzt Status auf "fehler", wenn die Anfragen scheitern', () => {
      const { component, fixture } = setup((a) => {
        a.modules$ = throwError(() => new Error('x'));
        a.plans$ = throwError(() => new Error('x'));
      });
      fixture.detectChanges();
      expect(component.status()).toBe('fehler');
      expect(component.catalogStatus()).toBe('fehler');
      expect(fixture.nativeElement.textContent).toContain('konnten nicht geladen werden');
    });
  });

  describe('Anzeige', () => {
    it('zeigt Semesterlabels und ECTS-Summe', () => {
      const { fixture } = setup();
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Semester 1');
      expect(text).toContain('6/30 ECTS');
      expect(text).toContain('0/30 ECTS');
    });

    it('zeigt Drop-Hinweis bei leerem Semester', () => {
      const { fixture } = setup();
      expect(fixture.nativeElement.textContent).toContain('Ziehe ein Modul hierher');
    });

    it('zeigt "eingeplant" nur bei bereits eingeplanten Modulen', () => {
      const { fixture } = setup();
      const labels = fixture.nativeElement.querySelectorAll('.planned-label');
      expect(labels.length).toBe(1);
    });
  });

  describe('Hilfsmethoden', () => {
    it('cycleLabel liefert passende Texte', () => {
      const { component } = setup();
      expect(component.cycleLabel('WISE')).toBe('WiSe');
      expect(component.cycleLabel('SOSE')).toBe('SoSe');
      expect(component.cycleLabel('SONST')).toBe('kein fester Turnus');
      expect(component.cycleLabel(null)).toBe('kein fester Turnus');
    });

    it('getTotalEcts summiert die ECTS eines Plans', () => {
      const { component } = setup();
      expect(component.getTotalEcts(plaene[0])).toBe(6);
      expect(component.getTotalEcts(plaene[1])).toBe(0);
    });

    it('isPlanned erkennt eingeplante Module', () => {
      const { component } = setup();
      expect(component.isPlanned(1)).toBe(true);
      expect(component.isPlanned(2)).toBe(false);
    });
  });

  describe('Suche', () => {
    it('zeigt ohne Suchbegriff alle Module', () => {
      const { component } = setup();
      expect(component.filteredModules().length).toBe(3);
    });

    it('filtert nach Name (ohne Groß-/Kleinschreibung)', () => {
      const { component } = setup();
      component.search.set('  DATEN ');
      expect(component.filteredModules().map((m) => m.id)).toEqual([2]);
    });

    it('filtert nach Modulnummer', () => {
      const { component } = setup();
      component.search.set('b11');
      expect(component.filteredModules().map((m) => m.id)).toEqual([1]);
    });

    it('onSearch übernimmt den Eingabewert', () => {
      const { component } = setup();
      component.onSearch({ target: { value: 'abc' } } as unknown as Event);
      expect(component.search()).toBe('abc');
    });

    it('zeigt Hinweis, wenn nichts gefunden wird', () => {
      const { component, fixture } = setup();
      component.search.set('gibtesnicht');
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Keine Module gefunden');
    });
  });

  describe('Einplanen', () => {
    it('addModule ruft die API auf, zeigt Snackbar und lädt Pläne neu', () => {
      const { component } = setup();
      const vorher = api.planLoads;
      component.addModule(katalog[1], plaene[1]);

      expect(api.enrollCalls).toEqual([[200, 2]]);
      expect(snack.messages.length).toBe(1);
      expect(snack.messages[0]).toContain('Semester 2');
      expect(api.planLoads).toBe(vorher + 1);
    });

    it('addModule zeigt Backend-Fehlermeldung', () => {
      const { component } = setup((a) => {
        a.enroll$ = throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Schon eingeplant' } }));
      });
      component.addModule(katalog[0], plaene[1]);
      expect(snack.messages).toEqual(['Schon eingeplant']);
    });

    it('addModule nutzt Fallback-Meldung ohne Backend-Text', () => {
      const { component } = setup((a) => {
        a.enroll$ = throwError(() => new HttpErrorResponse({ status: 500 }));
      });
      component.addModule(katalog[0], plaene[1]);
      expect(snack.messages).toEqual(['Modul konnte nicht eingeplant werden.']);
    });
  });

  describe('Drag & Drop', () => {
    it('ignoriert Drop im selben Container', () => {
      const { component } = setup();
      const container = {};
      component.drop({ previousContainer: container, container, item: { data: katalog[0] } } as any, plaene[0]);
      expect(api.enrollCalls.length).toBe(0);
    });

    it('plant das Modul bei Drop in anderen Container ein', () => {
      const { component } = setup();
      component.drop({ previousContainer: {}, container: {}, item: { data: katalog[1] } } as any, plaene[1]);
      expect(api.enrollCalls).toEqual([[200, 2]]);
    });

    it('ignoriert Drop ohne Moduldaten', () => {
      const { component } = setup();
      component.drop({ previousContainer: {}, container: {}, item: { data: undefined } } as any, plaene[1]);
      expect(api.enrollCalls.length).toBe(0);
    });
  });
});
