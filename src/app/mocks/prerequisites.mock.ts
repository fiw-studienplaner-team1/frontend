import { PrerequisiteMode } from '../models/prerequisite';

// Mock-Daten aus dem DB-Seed. Die ids entsprechen der Insert-Reihenfolge einer frisch befuellten DB.
// TODO: Datei entfernen, sobald der Prerequisite-PR gemerged ist und das echte BE genutzt wird

export interface MockModule {
  id: number;
  moduleNumber: string;
  name: string;
}

export interface MockPrerequisiteRow {
  successor: string;
  predecessor: string;
  mode: PrerequisiteMode;
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

// entspricht der Tabelle module_prerequisites
export const MOCK_PREREQUISITE_ROWS: MockPrerequisiteRow[] = [
  { successor: 'B21', predecessor: 'B11', mode: 'RECOMMENDED' },
  { successor: 'B21', predecessor: 'B13', mode: 'RECOMMENDED' },
  { successor: 'B22', predecessor: 'B15', mode: 'RECOMMENDED' },
  { successor: 'B23', predecessor: 'B11', mode: 'RECOMMENDED' },
  { successor: 'B23', predecessor: 'B13', mode: 'RECOMMENDED' },
  { successor: 'B24', predecessor: 'B11', mode: 'RECOMMENDED' },
  { successor: 'B25', predecessor: 'B14', mode: 'RECOMMENDED' },
  { successor: 'B26', predecessor: 'B16', mode: 'RECOMMENDED' },
  { successor: 'B31', predecessor: 'B13', mode: 'RECOMMENDED' },
  { successor: 'B31', predecessor: 'B22', mode: 'RECOMMENDED' },
  { successor: 'B32', predecessor: 'B23', mode: 'RECOMMENDED' },
  { successor: 'B33', predecessor: 'B24', mode: 'RECOMMENDED' },
  { successor: 'B34', predecessor: 'B11', mode: 'NECESSARY' },
  { successor: 'B34', predecessor: 'B21', mode: 'RECOMMENDED' },
  { successor: 'B34', predecessor: 'B24', mode: 'RECOMMENDED' },
  { successor: 'B35', predecessor: 'B23', mode: 'RECOMMENDED' },
  { successor: 'B51', predecessor: 'B32', mode: 'RECOMMENDED' },
  { successor: 'B52', predecessor: 'B24', mode: 'RECOMMENDED' },
  { successor: 'B52', predecessor: 'B31', mode: 'RECOMMENDED' },
  { successor: 'B53', predecessor: 'B12', mode: 'RECOMMENDED' },
  { successor: 'B53', predecessor: 'B31', mode: 'RECOMMENDED' },
  { successor: 'B55', predecessor: 'B42', mode: 'RECOMMENDED' },
  { successor: 'B56', predecessor: 'B34', mode: 'NECESSARY' },
  { successor: 'B56', predecessor: 'B21', mode: 'RECOMMENDED' },
  { successor: 'B61', predecessor: 'B33', mode: 'RECOMMENDED' },
  { successor: 'B61', predecessor: 'B51', mode: 'RECOMMENDED' },
  { successor: 'B62', predecessor: 'B14', mode: 'RECOMMENDED' },
  { successor: 'B62', predecessor: 'B25', mode: 'RECOMMENDED' },
  { successor: 'B66', predecessor: 'B11', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B12', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B13', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B14', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B15', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B16', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B21', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B22', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B23', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B24', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B25', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B26', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B31', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B32', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B33', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B34', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B34.1', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B34.2', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B35', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B35.1', mode: 'NECESSARY' },
  { successor: 'B66', predecessor: 'B35.2', mode: 'NECESSARY' },
  { successor: 'B65', predecessor: 'B66', mode: 'NECESSARY' },
];