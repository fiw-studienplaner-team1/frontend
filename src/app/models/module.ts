export type ModuleType = 'PFLICHT' | 'WAHLPFLICHT';
export type Cycle = 'WISE' | 'SOSE' | 'SONST';
export type ModuleForm = 'SL' | 'PCÜ' | 'PÜ' | 'PS'

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