import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ModulePrerequisitesApi } from '../../services/module-prerequisites-api';
import { ModulApi } from '../../services/modul-api';
import { ModuleWithPrerequisites, PrerequisiteEdge } from '../../models/prerequisite';
import { Module } from '../../models/module';

// Unter dieser Breite gilt die Handy-Variante (passt zum 600px-Breakpoint im CSS)
const MOBILE_QUERY = '(max-width: 599.98px)';

// Maße der Grafik. Alle Werte in SVG-Einheiten; die Zeichenfläche (viewWidth)
// wird auf die Breite der Card skaliert, höchstens bis maxDisplayWidth.
interface LayoutConfig {
  viewWidth: number;
  maxDisplayWidth: number;
  minDisplayWidth: number; // darunter wird gescrollt statt weiter geschrumpft
  maxNodeWidth: number; // Kästen werden so breit wie möglich, aber höchstens so breit
  nodeHeight: number;
  nodeGap: number; // Abstand zwischen Kästen in einer Zeile
  rowStep: number; // Abstand Zeilenanfang zu Zeilenanfang (Platz für die Kurven)
  padding: number;
  showNames: boolean; // Modulname im Kasten oder nur die Nummer
}

const DESKTOP: LayoutConfig = {
  viewWidth: 760,
  maxDisplayWidth: 760,
  minDisplayWidth: 480,
  maxNodeWidth: 150,
  nodeHeight: 54,
  nodeGap: 12,
  rowStep: 96,
  padding: 8,
  showNames: true,
};

const MOBILE: LayoutConfig = {
  viewWidth: 340,
  maxDisplayWidth: 440,
  minDisplayWidth: 280,
  maxNodeWidth: 100,
  nodeHeight: 40,
  nodeGap: 8,
  rowStep: 84,
  padding: 8,
  showNames: false,
};

const CHAR_WIDTH = 5.6; // ungefähre Breite eines Zeichens bei 10.5px Schrift

// "interface" beschreibt hier nur die Form der Daten, wie ein Record in Java
interface NameLine {
  text: string;
  y: number;
  textLength: number | null; // gesetzt, wenn die Zeile zu lang ist -> Schrift wird zusammengeschoben
}

interface GraphNode {
  id: number;
  x: number;
  y: number;
  centerX: number;
  label: string; // fett gedruckte Zeile im Kasten
  labelY: number;
  nameLines: NameLine[]; // auf dem Handy leer
  fullLabel: string;
  isCurrent: boolean;
}

interface GraphEdge extends PrerequisiteEdge {
  key: string;
  path: string;
}

interface GraphLayout {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  minDisplayWidth: number;
  maxDisplayWidth: number;
  nodeWidth: number;
  nodeHeight: number;
}

@Component({
  selector: 'app-module-prerequisites',
  styleUrl: './module-prerequisites.css',
  templateUrl: './module-prerequisites.html',
})
export class ModulePrerequisites implements OnInit {
  private prerequisitesApi = inject(ModulePrerequisitesApi);
  private modulApi = inject(ModulApi);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  moduleId = input.required<number>();
  modules = signal<Module[]>([]);
  allPrerequisites = signal<ModuleWithPrerequisites[]>([]);
  hoveredId = signal<number | null>(null); // "number | null": entweder eine Zahl oder null
  selectedId = signal<number | null>(null); // Handy: angetipptes Modul

  // true, solange der Bildschirm schmaler als 600px ist.
  // observe() liefert bei jeder Änderung ein Ergebnis, map() holt daraus nur das true/false,
  // toSignal() macht aus dem Observable ein Signal.
  isMobile = toSignal(
    this.breakpointObserver.observe(MOBILE_QUERY).pipe(map((result) => result.matches)),
    { initialValue: this.breakpointObserver.isMatched(MOBILE_QUERY) },
  );

  // Welches Modul gerade hervorgehoben ist: angetippt hat Vorrang vor gehovert
  activeId = computed(() => this.selectedId() ?? this.hoveredId());

  predecessorEdges = computed<PrerequisiteEdge[]>(() => {
    if (this.allPrerequisites().length === 0) return [];
    return this.prerequisitesApi.getPredecessorEdges(this.allPrerequisites(), this.moduleId());
  });

  successorEdges = computed<PrerequisiteEdge[]>(() => {
    if (this.allPrerequisites().length === 0) return [];
    return this.prerequisitesApi.getSuccessorEdges(this.allPrerequisites(), this.moduleId());
  });

  isLoading = computed(() => this.allPrerequisites().length === 0);
  hasEdges = computed(() => this.predecessorEdges().length + this.successorEdges().length > 0);

  layout = computed<GraphLayout>(() => this.buildLayout(this.isMobile() ? MOBILE : DESKTOP));

  ngOnInit(): void {
    this.modulApi.getModule().subscribe({
      next: (loadedModules) => this.modules.set(loadedModules),
    });

    this.prerequisitesApi.getAllPrerequisitesOfAllModules().subscribe({
      next: (loaded) => this.allPrerequisites.set(loaded),
    });
  }

  // Desktop: Klick öffnet direkt. Handy: Tipp zeigt erst den Namen unter der Grafik.
  onNodeClick(id: number): void {
    if (this.isMobile()) {
      this.selectedId.set(this.selectedId() === id ? null : id);
    } else {
      this.openModule(id);
    }
  }

  openModule(id: number): void {
    if (id === this.moduleId()) return;
    this.hoveredId.set(null);
    this.selectedId.set(null);
    this.router.navigate(['/module', id]);
  }

  // Nur Kanten am hervorgehobenen Modul bleiben kräftig
  isEdgeActive(edge: GraphEdge): boolean {
    const active = this.activeId();
    return active === null || edge.predecessorId === active || edge.successorId === active;
  }

  // Alle Module, die nicht direkt mit dem hervorgehobenen verbunden sind, werden blass
  isNodeDimmed(id: number): boolean {
    const active = this.activeId();
    if (active === null || id === active) return false;
    const isNeighbour = this.layout().edges.some(
      (e) =>
        (e.predecessorId === active && e.successorId === id) ||
        (e.successorId === active && e.predecessorId === id),
    );
    return !isNeighbour;
  }

  getModuleLabel(id: number): string {
    return this.getModuleNumber(id) + ' ' + this.getModuleName(id);
  }

  isCurrentModule(id: number): boolean {
    return id === this.moduleId();
  }

  // ---------- Layout ----------

  /**
   * Semester als Zeilen, Pfeile von oben nach unten.
   * Gezeigt wird nur der Bereich vom ersten bis zum letzten Semester der Kette.
   */
  private buildLayout(config: LayoutConfig): GraphLayout {
    const currentId = this.moduleId();
    const idsPerLevel = this.groupByLevel(currentId);

    const chainLevels = [...idsPerLevel.keys()];
    const firstLevel = Math.min(...chainLevels);
    const lastLevel = Math.max(...chainLevels);

    // Kastenbreite so wählen, dass die vollste Zeile die Fläche ausfüllt
    const left = config.padding;
    const areaWidth = config.viewWidth - left - config.padding;
    const maxPerRow = Math.max(...[...idsPerLevel.values()].map((ids) => ids.length));
    const nodeWidth = Math.min(
      config.maxNodeWidth,
      (areaWidth - (maxPerRow - 1) * config.nodeGap) / maxPerRow,
    );
    const rowWidth = (count: number) => count * nodeWidth + (count - 1) * config.nodeGap;
    const rowY = (level: number) => config.padding + (level - firstLevel) * config.rowStep;

    const nodes: GraphNode[] = [];
    for (const [level, ids] of idsPerLevel) {
      const startX = left + (areaWidth - rowWidth(ids.length)) / 2; // Zeile zentrieren
      const y = rowY(level);
      ids.forEach((id, i) => {
        const x = startX + i * (nodeWidth + config.nodeGap);
        nodes.push({
          id,
          x,
          y,
          centerX: x + nodeWidth / 2,
          // TODO: auf dem Handy Kürzel statt Modulnummer anzeigen, sobald es das Feld im Modell gibt
          label: this.getModuleNumber(id),
          labelY: config.showNames ? y + 18 : y + config.nodeHeight / 2 + 5,
          nameLines: config.showNames ? this.buildNameLines(this.getModuleName(id), y, nodeWidth) : [],
          fullLabel: this.getModuleLabel(id),
          isCurrent: id === currentId,
        });
      });
    }

    // Kanten: von der Unterkante des Vorgängers zur Oberkante des Nachfolgers, als S-Kurve
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const edges: GraphEdge[] = [...this.predecessorEdges(), ...this.successorEdges()].map((edge) => {
      const from = nodeById.get(edge.predecessorId)!; // ! = "ist sicher nicht undefined"
      const to = nodeById.get(edge.successorId)!;
      const x1 = from.centerX;
      const y1 = from.y + config.nodeHeight;
      const x2 = to.centerX;
      const y2 = to.y - 2;
      const bend = (y2 - y1) / 2;
      return {
        ...edge, // übernimmt predecessorId, successorId, mode
        key: edge.predecessorId + '-' + edge.successorId,
        // `...${}` ist ein Template-String, ähnlich String.format in Java
        path: `M ${x1} ${y1} C ${x1} ${y1 + bend}, ${x2} ${y2 - bend}, ${x2} ${y2}`,
      };
    });

    return {
      nodes,
      edges,
      width: config.viewWidth,
      height: 2 * config.padding + (lastLevel - firstLevel) * config.rowStep + config.nodeHeight,
      minDisplayWidth: config.minDisplayWidth,
      maxDisplayWidth: config.maxDisplayWidth,
      nodeWidth,
      nodeHeight: config.nodeHeight,
    };
  }

  /** Teilt die Module in Semester (bzw. Stufen) auf, innerhalb davon nach Modulnummer sortiert. */
  private groupByLevel(currentId: number) {
    const levels = this.computeLevels(currentId);

    const idsPerLevel = new Map<number, number[]>();
    for (const [id, level] of levels) {
      const ids = idsPerLevel.get(level) ?? []; // ?? = "falls undefined, nimm []"
      ids.push(id);
      idsPerLevel.set(level, ids);
    }
    for (const ids of idsPerLevel.values()) {
      ids.sort((a, b) => this.getModuleNumber(a).localeCompare(this.getModuleNumber(b)));
    }

    return idsPerLevel;
  }

  /**
   * Ordnet jeder Modul-id ein Semester (bzw. eine Stufe) zu.
   * Haben alle beteiligten Module ein recommendedSemester, wird das genommen.
   * Sonst: aktuelles Modul = 0, Vorgänger davor (negativ), Nachfolger danach.
   */
  private computeLevels(currentId: number): Map<number, number> {
    const ids = new Set<number>([currentId]);
    for (const edge of [...this.predecessorEdges(), ...this.successorEdges()]) {
      ids.add(edge.predecessorId);
      ids.add(edge.successorId);
    }

    const semesters = new Map<number, number>();
    for (const m of this.modules()) {
      if (m.recommendedSemester !== undefined && m.recommendedSemester !== null) {
        semesters.set(m.id, m.recommendedSemester);
      }
    }

    if ([...ids].every((id) => semesters.has(id))) {
      const levels = new Map<number, number>();
      for (const id of ids) levels.set(id, semesters.get(id)!);
      return levels;
    }

    // Fallback: Stufen ausrechnen. Ein Vorgänger steht immer mindestens eine Stufe
    // vor seinem Nachfolger. Wiederholen, bis sich nichts mehr ändert.
    const levels = new Map<number, number>([[currentId, 0]]);
    let changed = true;
    let rounds = 0;
    while (changed && rounds < 100) { // rounds: Schutz gegen Endlosschleife bei Zyklen in den Daten
      changed = false;
      rounds++;

      for (const edge of this.predecessorEdges()) {
        const successorLevel = levels.get(edge.successorId);
        if (successorLevel === undefined) continue;
        const current = levels.get(edge.predecessorId);
        if (current === undefined || current > successorLevel - 1) {
          levels.set(edge.predecessorId, successorLevel - 1);
          changed = true;
        }
      }

      for (const edge of this.successorEdges()) {
        const predecessorLevel = levels.get(edge.predecessorId);
        if (predecessorLevel === undefined) continue;
        const current = levels.get(edge.successorId);
        if (current === undefined || current < predecessorLevel + 1) {
          levels.set(edge.successorId, predecessorLevel + 1);
          changed = true;
        }
      }
    }
    return levels;
  }

  // ---------- Hilfsmethoden ----------

  private findModule(id: number): Module | undefined {
    return this.modules().find((m) => m.id === id);
  }

  private getModuleNumber(id: number): string {
    const module = this.findModule(id);
    return module ? module.moduleNumber : '?';
  }

  private getModuleName(id: number): string {
    const module = this.findModule(id);
    return module ? module.name : 'Unbekanntes Modul';
  }

  /** Bricht den Namen an Leerzeichen um, höchstens 2 Zeilen, passend zur Kastenbreite. */
  private buildNameLines(name: string, nodeY: number, nodeWidth: number): NameLine[] {
    const textWidth = nodeWidth - 16;
    const maxChars = Math.floor(textWidth / CHAR_WIDTH);

    const lines: string[] = [];
    let line = '';
    for (const word of name.split(' ')) {
      if (line === '') {
        line = word;
      } else if ((line + ' ' + word).length <= maxChars) {
        line += ' ' + word;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line !== '') lines.push(line);
    if (lines.length > 2) {
      lines.splice(2); // alles ab der 3. Zeile weg
      lines[1] += ' …';
    }

    // y-Positionen: eine Zeile mittig unter der Nummer, zwei Zeilen untereinander
    const yPositions = lines.length === 1 ? [nodeY + 38] : [nodeY + 33, nodeY + 46];
    return lines.map((text, i) => ({
      text,
      y: yPositions[i],
      textLength: text.length > maxChars ? textWidth : null,
    }));
  }
}