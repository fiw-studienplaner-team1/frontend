export type ModulArt = 'PFLICHT' | 'WAHLPFLICHT';
export type ModulTurnus = 'WISE' | 'SOSE' | 'SONST';

export const MODUL_ART_LABEL: Record<ModulArt, string> = {
  PFLICHT: 'Pflichtmodul',
  WAHLPFLICHT: 'Wahlpflichtmodul',
};

export const MODUL_TURNUS_LABEL: Record<ModulTurnus, string> = {
  WISE: 'Wintersemester',
  SOSE: 'Sommersemester',
  SONST: 'Sonstiges',
};

export interface Modul {
  id: string; //TODO klaeren ob wir string z.b. B23 oder number als id haben wollen 
  name: string;
  semester: number;
  ects: number;
  sws: number;
  art: ModulArt | null;
  turnus: ModulTurnus | null;
}