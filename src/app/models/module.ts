export type ModuleType = 'PFLICHT' | 'WAHLPFLICHT';
export type Cycle = 'WISE' | 'SOSE' | 'SONST';
export type ModuleForm = 'SL' | 'PCÜ' | 'PÜ' | 'PS'

export const MODULE_TYPE_LABEL: Record<ModuleType, string> = {
  PFLICHT: 'Pflichtmodul',
  WAHLPFLICHT: 'Wahlpflichtmodul',
};

export const CYCLE_LABEL: Record<Cycle, string> = {
  WISE: 'Wintersemester',
  SOSE: 'Sommersemester',
  SONST: 'Sonstiges',
};

export const MODULE_FORM_LABEL: Record<ModuleForm, string> = {
    SL: 'Seminaristischer Lehrvortrag',
    PS: 'Projekt(-Seminar)',
    PÜ: 'Praktische Übung',
    PCÜ: 'PC-Übung'
  }

export interface Module {
  id: number; 
  name: string;
  moduleNumber: string;  
  ects: number;
  weeklyHours: number;
  moduleType: ModuleType | null;
  cycle: Cycle | null;
  moduleForm: ModuleForm | null;
  recommendedSemester?: number;
}