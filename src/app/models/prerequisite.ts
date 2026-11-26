export type PrerequisiteMode = 'NECESSARY' | 'RECOMMENDED';

export interface Prerequisite {
  moduleId: number;
  mode: PrerequisiteMode;
}

export interface ModuleWithPrerequisites {
  moduleId: number;
  predecessors: Prerequisite[];
  successors: Prerequisite[];
}

export interface PrerequisiteEdge {
  predecessorId: number;
  successorId: number;
  mode: PrerequisiteMode;
}
