export type ModulArt = 'PFLICHT' | 'WAHLPFLICHT' | 'AWE';

export interface Modul {
  id: string; //TODO klaeren ob wir string z.b. B23 oder number als id haben wollen 
  name: string;
  semester: number;
  ects: number;
  sws: number;
  art: ModulArt;
  turnus: string;
}