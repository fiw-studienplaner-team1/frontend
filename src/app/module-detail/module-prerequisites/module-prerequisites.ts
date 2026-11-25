import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModulePrerequisitesApi } from '../../services/module-prerequisites-api';
import { PrerequisiteEdge } from '../../models/prerequisite';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-module-prerequisites',
  styleUrl: './module-prerequisites.css',
  templateUrl: './module-prerequisites.html',
  imports: [JsonPipe],
})
export class ModulePrerequisites implements OnInit {
  private prerequisitesApi = inject(ModulePrerequisitesApi);

  moduleId = input.required<number>();
  predecessorEdges = signal<PrerequisiteEdge[]>([]);
  successorEdges = signal<PrerequisiteEdge[]>([]);

  ngOnInit(): void {
    this.prerequisitesApi.getAllPrerequisitesOfAllModules().subscribe({
      next: (allModules) => {
        this.predecessorEdges.set(this.prerequisitesApi.getPredecessorEdges(allModules, this.moduleId()));
        this.successorEdges.set(this.prerequisitesApi.getSuccessorEdges(allModules, this.moduleId()));
      },
    });
  }
}