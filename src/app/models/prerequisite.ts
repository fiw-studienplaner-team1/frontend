export type PrerequisiteMode = 'NOTWENDIG' | 'EMPFOHLEN';

export interface Prerequisite {
  moduleId: number;
  moduleNumber: string;
  prerequisiteMode: PrerequisiteMode;
}

export interface PrerequisiteEdge {
  predecessorModuleId: number;
  successorModuleId: number;
  prerequisiteMode: PrerequisiteMode;
  id: number;
  predecessorModuleNumber: string;
  successorModuleNumber: string;
}
