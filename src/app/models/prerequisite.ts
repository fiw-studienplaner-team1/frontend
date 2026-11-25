export type PrerequisiteMode = 'NECESSARY' | 'RECOMMENDED';

export interface Prerequisite {
  modulPrerequisiteId: number;
  mode: PrerequisiteMode;
}

export interface PrerequisiteNode {
  modulPrerequisiteId: number;
  mode: PrerequisiteMode;
  children: PrerequisiteNode[];
}

export interface ModuleWithPrerequisites {
  moduleId: number;
  predecessors: Prerequisite[];
  successors: Prerequisite[]
}

export interface PrerequisiteEdge {
  predecessorId: number;
  successorId: number;
  mode: PrerequisiteMode;
}
