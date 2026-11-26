import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { ModulePrerequisites } from './module-prerequisites';
import { ModulePrerequisitesApi } from '../../services/module-prerequisites-api';
import { ModulApi } from '../../services/modul-api';
import { Module } from '../../models/module';
import { ModuleWithPrerequisites } from '../../models/prerequisite';

function createModule(id: number, moduleNumber: string, name: string, recommendedSemester: number): Module {
  return {
    id,
    moduleNumber,
    name,
    recommendedSemester,
    ects: 5,
    weeklyHours: 4,
    moduleType: 'PFLICHT',
    cycle: 'WISE',
    moduleForm: null,
  };
}

const MODULES: Module[] = [
  createModule(1, 'B11', 'Programmierung 1', 1),
  createModule(2, 'B21', 'Programmierung 2', 2),
  createModule(3, 'B34', 'Softwareentwicklungsprojekt', 3),
  createModule(4, 'B56', 'Projekte in der Wirtschaft', 5),
  createModule(5, 'B16', 'Fremdsprache 1', 1),
];

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
  { moduleId: 4, predecessors: [{ moduleId: 3, mode: 'NECESSARY' }], successors: [] },
  { moduleId: 5, predecessors: [], successors: [] },
];

describe('ModulePrerequisites', () => {
  let fixture: ComponentFixture<ModulePrerequisites>;
  let component: ModulePrerequisites;
  let element: HTMLElement;
  let router: { navigate: ReturnType<typeof vi.fn> };

  async function setUp(
    moduleId: number,
    options: { mobile?: boolean; prerequisites?: Observable<ModuleWithPrerequisites[]> } = {},
  ) {
    const mobile = options.mobile ?? false;
    const prerequisites = options.prerequisites ?? of(ALL_PREREQUISITES);
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ModulePrerequisites],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: ModulApi, useValue: { getModule: () => of(MODULES) } },
        {
          provide: BreakpointObserver,
          useValue: {
            observe: () => of({ matches: mobile, breakpoints: {} }),
            isMatched: () => mobile,
          },
        },
      ],
    }).compileComponents();

    const prerequisitesApi = TestBed.inject(ModulePrerequisitesApi);
    vi.spyOn(prerequisitesApi, 'getAllPrerequisites').mockReturnValue(prerequisites);

    fixture = TestBed.createComponent(ModulePrerequisites);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.componentRef.setInput('moduleId', moduleId);
    fixture.detectChanges();
  }

  function nodeElements(): SVGGElement[] {
    return Array.from(element.querySelectorAll<SVGGElement>('g.node'));
  }

  function nodeByNumber(moduleNumber: string): SVGGElement {
    const node = nodeElements().find((g) => g.querySelector('.number')?.textContent?.trim() === moduleNumber);
    if (!node) throw new Error(`Kasten ${moduleNumber} nicht gefunden`);
    return node;
  }

  function click(target: Element) {
    target.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
  }

  describe('Zustände', () => {
    it('zeigt einen Ladehinweis, solange die Voraussetzungen nicht geladen sind', async () => {
      await setUp(3, { prerequisites: NEVER });

      expect(element.textContent).toContain('Voraussetzungen werden geladen');
      expect(element.querySelector('svg')).toBeNull();
    });

    it('zeigt keinen Ladehinweis mehr, wenn das Backend eine leere Liste liefert', async () => {
      await setUp(3, { prerequisites: of([]) });

      expect(element.textContent).not.toContain('werden geladen');
      expect(element.textContent).toContain('keine Vorgänger oder Nachfolger');
    });

    it('zeigt eine Fehlermeldung, wenn die Voraussetzungen nicht geladen werden können', async () => {
      await setUp(3, { prerequisites: throwError(() => new Error('Backend nicht erreichbar')) });

      expect(element.textContent).not.toContain('werden geladen');
      expect(element.textContent).toContain('konnten nicht geladen werden');
    });

    it('zeigt einen Hinweis, wenn das Modul keine Vorgänger oder Nachfolger hat', async () => {
      await setUp(5);

      expect(element.textContent).toContain('keine Vorgänger oder Nachfolger');
      expect(element.querySelector('svg')).toBeNull();
    });
  });

  describe('Grafik', () => {
    it('zeigt jedes Modul der Kette genau einmal', async () => {
      await setUp(3);

      const numbers = nodeElements().map((g) => g.querySelector('.number')?.textContent?.trim());
      expect(numbers.sort()).toEqual(['B11', 'B21', 'B34', 'B56']);
    });

    it('zeigt keine Module, die nicht zur Kette gehören', async () => {
      await setUp(3);

      expect(element.textContent).not.toContain('B16');
    });

    it('hebt das aktuelle Modul hervor', async () => {
      await setUp(3);

      expect(nodeByNumber('B34').classList).toContain('current');
      expect(nodeByNumber('B11').classList).not.toContain('current');
    });

    it('zeichnet notwendige und empfohlene Voraussetzungen unterschiedlich', async () => {
      await setUp(3);

      expect(element.querySelectorAll('path.edge.necessary').length).toBe(2);
      expect(element.querySelectorAll('path.edge.recommended').length).toBe(2);
    });

    it('ordnet die Module nach empfohlenem Semester von oben nach unten', async () => {
      await setUp(3);

      const y = (id: number) => component.layout().nodes.find((n) => n.id === id)!.y;
      expect(y(1)).toBeLessThan(y(2));
      expect(y(2)).toBeLessThan(y(3));
      expect(y(3)).toBeLessThan(y(4));
    });

    it('zeigt am Desktop Nummer und Name im Kasten', async () => {
      await setUp(3);

      expect(nodeByNumber('B11').textContent).toContain('Programmierung 1');
    });

    it('baut die Kette neu, wenn sich das Modul ändert', async () => {
      await setUp(3);

      fixture.componentRef.setInput('moduleId', 2);
      fixture.detectChanges();

      expect(nodeByNumber('B21').classList).toContain('current');
      expect(nodeByNumber('B34').classList).not.toContain('current');
    });
  });

  describe('Hervorheben', () => {
    it('macht beim Hovern alle Module blass, die nicht direkt verbunden sind', async () => {
      await setUp(3);

      nodeByNumber('B56').dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(nodeByNumber('B34').classList).not.toContain('dimmed');
      expect(nodeByNumber('B11').classList).toContain('dimmed');
      expect(nodeByNumber('B56').classList).not.toContain('dimmed');
    });

    it('hebt die Hervorhebung beim Verlassen wieder auf', async () => {
      await setUp(3);

      nodeByNumber('B56').dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      nodeByNumber('B56').dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();

      expect(element.querySelectorAll('g.node.dimmed').length).toBe(0);
    });
  });

  describe('Klick am Desktop', () => {
    it('öffnet die Detailseite des angeklickten Moduls', async () => {
      await setUp(3);

      click(nodeByNumber('B11'));

      expect(router.navigate).toHaveBeenCalledWith(['/module', 1]);
    });

    it('macht nichts beim Klick auf das aktuelle Modul', async () => {
      await setUp(3);

      click(nodeByNumber('B34'));

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Handy', () => {
    it('zeigt im Kasten nur die Nummer', async () => {
      await setUp(3, { mobile: true });

      expect(nodeByNumber('B11').querySelectorAll('.name').length).toBe(0);
      expect(element.textContent).toContain('Tippe auf ein Modul');
    });

    it('zeigt beim Antippen den Namen, ohne die Seite zu wechseln', async () => {
      await setUp(3, { mobile: true });

      click(nodeByNumber('B11'));

      expect(element.querySelector('.selection-name')?.textContent).toContain('B11 Programmierung 1');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('öffnet das Modul über „Zum Modul“', async () => {
      await setUp(3, { mobile: true });

      click(nodeByNumber('B11'));
      click(element.querySelector('.selection-link')!);

      expect(router.navigate).toHaveBeenCalledWith(['/module', 1]);
    });

    it('hebt die Auswahl beim zweiten Antippen wieder auf', async () => {
      await setUp(3, { mobile: true });

      click(nodeByNumber('B11'));
      click(nodeByNumber('B11'));

      expect(element.querySelector('.selection')).toBeNull();
    });

    it('zeigt beim aktuellen Modul keinen Link „Zum Modul“', async () => {
      await setUp(3, { mobile: true });

      click(nodeByNumber('B34'));

      expect(element.querySelector('.selection-name')?.textContent).toContain('B34');
      expect(element.querySelector('.selection-link')).toBeNull();
    });
  });
});