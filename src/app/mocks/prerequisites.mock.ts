import { PrerequisiteEdge } from '../models/prerequisite';

// Mock-Daten aus dem DB-Seed. Die ids entsprechen der Insert-Reihenfolge einer frisch befuellten DB.
// TODO: Datei entfernen, sobald der Prerequisite-PR gemerged ist und das echte BE genutzt wird

export interface MockModule {
  id: number;
  moduleNumber: string;
  name: string;
}

export const MOCK_MODULES: MockModule[] = [
  { id: 1, moduleNumber: 'B11', name: 'Programmierung 1' },
  { id: 2, moduleNumber: 'B12', name: 'Rechnerarchitektur/Betriebssysteme' },
  { id: 3, moduleNumber: 'B13', name: 'Grundlegende Konzepte der Informatik' },
  { id: 4, moduleNumber: 'B14', name: 'BWL 1: Grundlagen der BWL' },
  { id: 5, moduleNumber: 'B15', name: 'Mathematik 1' },
  { id: 6, moduleNumber: 'B16', name: '1. Fremdsprache 1' },
  { id: 7, moduleNumber: 'B21', name: 'Programmierung 2' },
  { id: 8, moduleNumber: 'B22', name: 'Mathematik 2' },
  { id: 9, moduleNumber: 'B23', name: 'Software-Engineering 1' },
  { id: 10, moduleNumber: 'B24', name: 'Webtechnologien' },
  { id: 11, moduleNumber: 'B25', name: 'BWL 2: Rechnungswesen' },
  { id: 12, moduleNumber: 'B26', name: '1. Fremdsprache 2' },
  { id: 13, moduleNumber: 'B31', name: 'Data-Science' },
  { id: 14, moduleNumber: 'B32', name: 'Software-Engineering 2' },
  { id: 15, moduleNumber: 'B33', name: 'Datenbanksysteme' },
  { id: 16, moduleNumber: 'B34', name: 'Softwareentwicklungsprojekt' },
  { id: 17, moduleNumber: 'B34.1', name: 'Softwareentwicklungsprojekt' },
  { id: 18, moduleNumber: 'B34.2', name: 'Arbeitswelt IT' },
  { id: 19, moduleNumber: 'B35', name: 'Projektmanagement' },
  { id: 20, moduleNumber: 'B35.1', name: 'Agiles Projektmanagement' },
  { id: 21, moduleNumber: 'B35.2', name: 'Konfliktmanagement und Mediation' },
  { id: 22, moduleNumber: 'B41', name: 'Wahlpflichtmodul (Wirtschafts-)Informatik 1' },
  { id: 23, moduleNumber: 'B42', name: 'Wissenschaftliches Schreiben' },
  { id: 24, moduleNumber: 'B43', name: 'Fachpraktikum' },
  { id: 25, moduleNumber: 'B51', name: 'Human Computer Interaction' },
  { id: 26, moduleNumber: 'B52', name: 'Verteilte Systeme' },
  { id: 27, moduleNumber: 'B53', name: 'Datenschutz und Datensicherheit' },
  { id: 28, moduleNumber: 'B54', name: 'Wahlpflichtmodul (Wirtschafts-)Informatik 2' },
  { id: 29, moduleNumber: 'B55', name: 'Informatik und Gesellschaft' },
  { id: 30, moduleNumber: 'B56', name: 'Projekte in der Wirtschaft' },
  { id: 31, moduleNumber: 'B61', name: 'Modellierung von Informationssystemen' },
  { id: 32, moduleNumber: 'B62', name: 'BWL 3: Berufspraxis IT-Wirtschaft' },
  { id: 33, moduleNumber: 'B63', name: 'AWE-Modul 1' },
  { id: 34, moduleNumber: 'B64', name: 'AWE-Modul 2' },
  { id: 35, moduleNumber: 'B65', name: 'Bachelorseminar und Abschlusskolloquium' },
  { id: 36, moduleNumber: 'B65.1', name: 'Bachelorseminar' },
  { id: 37, moduleNumber: 'B66', name: 'Bachelorarbeit' },
];

// entspricht der Antwort von GET /prerequisites (ohne B66)
export const MOCK_PREREQUISITE_EDGES: PrerequisiteEdge[] = [
  { id: 1,  predecessorModuleId: 1,  predecessorModuleNumber: 'B11', successorModuleId: 7,  successorModuleNumber: 'B21', prerequisiteMode: 'EMPFOHLEN' },
  { id: 2,  predecessorModuleId: 3,  predecessorModuleNumber: 'B13', successorModuleId: 7,  successorModuleNumber: 'B21', prerequisiteMode: 'EMPFOHLEN' },
  { id: 3,  predecessorModuleId: 5,  predecessorModuleNumber: 'B15', successorModuleId: 8,  successorModuleNumber: 'B22', prerequisiteMode: 'EMPFOHLEN' },
  { id: 4,  predecessorModuleId: 1,  predecessorModuleNumber: 'B11', successorModuleId: 9,  successorModuleNumber: 'B23', prerequisiteMode: 'EMPFOHLEN' },
  { id: 5,  predecessorModuleId: 3,  predecessorModuleNumber: 'B13', successorModuleId: 9,  successorModuleNumber: 'B23', prerequisiteMode: 'EMPFOHLEN' },
  { id: 6,  predecessorModuleId: 1,  predecessorModuleNumber: 'B11', successorModuleId: 10, successorModuleNumber: 'B24', prerequisiteMode: 'EMPFOHLEN' },
  { id: 7,  predecessorModuleId: 4,  predecessorModuleNumber: 'B14', successorModuleId: 11, successorModuleNumber: 'B25', prerequisiteMode: 'EMPFOHLEN' },
  { id: 8,  predecessorModuleId: 6,  predecessorModuleNumber: 'B16', successorModuleId: 12, successorModuleNumber: 'B26', prerequisiteMode: 'EMPFOHLEN' },
  { id: 9,  predecessorModuleId: 3,  predecessorModuleNumber: 'B13', successorModuleId: 13, successorModuleNumber: 'B31', prerequisiteMode: 'EMPFOHLEN' },
  { id: 10, predecessorModuleId: 8,  predecessorModuleNumber: 'B22', successorModuleId: 13, successorModuleNumber: 'B31', prerequisiteMode: 'EMPFOHLEN' },
  { id: 11, predecessorModuleId: 9,  predecessorModuleNumber: 'B23', successorModuleId: 14, successorModuleNumber: 'B32', prerequisiteMode: 'EMPFOHLEN' },
  { id: 12, predecessorModuleId: 10, predecessorModuleNumber: 'B24', successorModuleId: 15, successorModuleNumber: 'B33', prerequisiteMode: 'EMPFOHLEN' },
  { id: 13, predecessorModuleId: 1,  predecessorModuleNumber: 'B11', successorModuleId: 16, successorModuleNumber: 'B34', prerequisiteMode: 'NOTWENDIG' },
  { id: 14, predecessorModuleId: 7,  predecessorModuleNumber: 'B21', successorModuleId: 16, successorModuleNumber: 'B34', prerequisiteMode: 'EMPFOHLEN' },
  { id: 15, predecessorModuleId: 10, predecessorModuleNumber: 'B24', successorModuleId: 16, successorModuleNumber: 'B34', prerequisiteMode: 'EMPFOHLEN' },
  { id: 16, predecessorModuleId: 9,  predecessorModuleNumber: 'B23', successorModuleId: 19, successorModuleNumber: 'B35', prerequisiteMode: 'EMPFOHLEN' },
  { id: 17, predecessorModuleId: 14, predecessorModuleNumber: 'B32', successorModuleId: 25, successorModuleNumber: 'B51', prerequisiteMode: 'EMPFOHLEN' },
  { id: 18, predecessorModuleId: 10, predecessorModuleNumber: 'B24', successorModuleId: 26, successorModuleNumber: 'B52', prerequisiteMode: 'EMPFOHLEN' },
  { id: 19, predecessorModuleId: 13, predecessorModuleNumber: 'B31', successorModuleId: 26, successorModuleNumber: 'B52', prerequisiteMode: 'EMPFOHLEN' },
  { id: 20, predecessorModuleId: 2,  predecessorModuleNumber: 'B12', successorModuleId: 27, successorModuleNumber: 'B53', prerequisiteMode: 'EMPFOHLEN' },
  { id: 21, predecessorModuleId: 13, predecessorModuleNumber: 'B31', successorModuleId: 27, successorModuleNumber: 'B53', prerequisiteMode: 'EMPFOHLEN' },
  { id: 22, predecessorModuleId: 23, predecessorModuleNumber: 'B42', successorModuleId: 29, successorModuleNumber: 'B55', prerequisiteMode: 'EMPFOHLEN' },
  { id: 23, predecessorModuleId: 16, predecessorModuleNumber: 'B34', successorModuleId: 30, successorModuleNumber: 'B56', prerequisiteMode: 'NOTWENDIG' },
  { id: 24, predecessorModuleId: 7,  predecessorModuleNumber: 'B21', successorModuleId: 30, successorModuleNumber: 'B56', prerequisiteMode: 'EMPFOHLEN' },
  { id: 25, predecessorModuleId: 15, predecessorModuleNumber: 'B33', successorModuleId: 31, successorModuleNumber: 'B61', prerequisiteMode: 'EMPFOHLEN' },
  { id: 26, predecessorModuleId: 25, predecessorModuleNumber: 'B51', successorModuleId: 31, successorModuleNumber: 'B61', prerequisiteMode: 'EMPFOHLEN' },
  { id: 27, predecessorModuleId: 4,  predecessorModuleNumber: 'B14', successorModuleId: 32, successorModuleNumber: 'B62', prerequisiteMode: 'EMPFOHLEN' },
  { id: 28, predecessorModuleId: 11, predecessorModuleNumber: 'B25', successorModuleId: 32, successorModuleNumber: 'B62', prerequisiteMode: 'EMPFOHLEN' },
];