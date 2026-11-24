import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ModulePrerequisitesApi } from '../../services/module-prerequisites-api';
import { Prerequisite } from '../../models/prerequisite';

@Component({
  selector: 'app-module-prerequisites',
  styleUrl: './module-prerequisites.css',
  templateUrl: './module-prerequisites.html',
})
export class ModulePrerequisites implements OnInit {
  private prerequisitesApi = inject(ModulePrerequisitesApi);

  moduleNumber = input.required<string>();
  predecessors = signal<Prerequisite[]>([]);
  successors = signal<Prerequisite[]>([]);

  ngOnInit(): void {
    this.prerequisitesApi.getPredecessorsByModuleNumber(this.moduleNumber()).subscribe({
      next: (loadedPredecessors) => {
        this.predecessors.set(loadedPredecessors);
      },
    });

    this.prerequisitesApi.getSuccessorsByModuleNumber(this.moduleNumber()).subscribe({
      next: (loadedSuccessors) => {
        this.successors.set(loadedSuccessors);
      },
    });
  }
}