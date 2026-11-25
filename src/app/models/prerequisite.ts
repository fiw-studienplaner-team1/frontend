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

