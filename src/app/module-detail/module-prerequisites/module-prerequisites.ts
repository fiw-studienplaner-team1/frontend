import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ModulePrerequisitesApi } from '../../services/module-prerequisites-api';
import { ModulApi } from '../../services/modul-api';
import { PrerequisiteEdge } from '../../models/prerequisite';
import { Module } from '../../models/module';
import { buildLayout, formatModuleLabel } from './prerequisite-graph-layout';
import { DESKTOP, GraphEdge, GraphLayout, MOBILE } from './prerequisite-graph.model';

// TODO: durch zentrale Mobile-Erkennung ersetzen (MOBILE_QUERY, BreakpointObserver und isMobile), sobald wir eine festgelegt haben
const MOBILE_QUERY = '(max-width: 599.98px)';

@Component({
  selector: 'app-module-prerequisites',
  styleUrl: './module-prerequisites.css',
  templateUrl: './module-prerequisites.html',
})
export class ModulePrerequisites implements OnInit {
  private prerequisitesApi = inject(ModulePrerequisitesApi);
  private moduleApi = inject(ModulApi);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  moduleId = input.required<number>();
  modules = signal<Module[]>([]);
  allPrerequisites = signal<PrerequisiteEdge[]>([]);
  isLoaded = signal(false);
  hasLoadError = signal(false);
  hoveredId = signal<number | null>(null);
  selectedId = signal<number | null>(null);

  isMobile = toSignal(
    this.breakpointObserver.observe(MOBILE_QUERY).pipe(map((result) => result.matches)),
    { initialValue: this.breakpointObserver.isMatched(MOBILE_QUERY) },
  );

  activeId = computed(() => this.selectedId() ?? this.hoveredId());

  predecessorEdges = computed<PrerequisiteEdge[]>(() => {
    if (this.allPrerequisites().length === 0) return [];
    return this.prerequisitesApi.getPredecessorEdges(this.allPrerequisites(), this.moduleId());
  });

  successorEdges = computed<PrerequisiteEdge[]>(() => {
    if (this.allPrerequisites().length === 0) return [];
    return this.prerequisitesApi.getSuccessorEdges(this.allPrerequisites(), this.moduleId());
  });

  isLoading = computed(() => !this.isLoaded() && !this.hasLoadError());
  hasEdges = computed(() => this.predecessorEdges().length + this.successorEdges().length > 0);

  layout = computed<GraphLayout>(() =>
    buildLayout(
      {
        currentId: this.moduleId(),
        modules: this.modules(),
        predecessorEdges: this.predecessorEdges(),
        successorEdges: this.successorEdges(),
      },
      this.isMobile() ? MOBILE : DESKTOP,
    ),
  );

  ngOnInit(): void {
    this.moduleApi.getModule().subscribe({
      next: (loadedModules) => this.modules.set(loadedModules),
    });

    this.prerequisitesApi.getAllPrerequisites().subscribe({
      next: (loaded) => {
        this.allPrerequisites.set(loaded);
        this.isLoaded.set(true);
      },
      error: () => this.hasLoadError.set(true),
    });
  }

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

  isEdgeActive(edge: GraphEdge): boolean {
    const active = this.activeId();
    return active === null || edge.predecessorModuleId === active || edge.successorModuleId === active;
  }

  isNodeDimmed(id: number): boolean {
    const active = this.activeId();
    if (active === null || id === active) return false;
    const isNeighbour = this.layout().edges.some(
      (e) =>
        (e.predecessorModuleId === active && e.successorModuleId === id) ||
        (e.successorModuleId === active && e.predecessorModuleId === id),
    );
    return !isNeighbour;
  }

  getModuleLabel(id: number): string {
    return formatModuleLabel(this.modules(), id);
  }

  isCurrentModule(id: number): boolean {
    return id === this.moduleId();
  }
}