export type PrerequisiteMode = 'NECESSARY' | 'RECOMMENDED';

export interface Prerequisite {
  modulPrerequisiteId: number;
  mode: PrerequisiteMode;
}

