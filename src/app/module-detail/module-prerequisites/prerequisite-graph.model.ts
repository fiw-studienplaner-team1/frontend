import { Module } from '../../models/module';
import { PrerequisiteEdge } from '../../models/prerequisite';

// Masse der Grafik fuer Desktop und Handy. Gehoeren nur zu dieser Grafik, weil die Positionen
// im SVG in TypeScript berechnet werden und CSS-Media-Queries dort nicht greifen.
export interface LayoutConfig {
  viewWidth: number;
  maxDisplayWidth: number;
  minDisplayWidth: number;
  maxNodeWidth: number;
  nodeHeight: number;
  nodeGap: number;
  rowStep: number;
  padding: number;
  showNames: boolean;
}

export const DESKTOP: LayoutConfig = {
  viewWidth: 760,
  maxDisplayWidth: 760,
  minDisplayWidth: 480,
  maxNodeWidth: 150,
  nodeHeight: 54,
  nodeGap: 12,
  rowStep: 96,
  padding: 8,
  showNames: true,
};

export const MOBILE: LayoutConfig = {
  viewWidth: 340,
  maxDisplayWidth: 440,
  minDisplayWidth: 280,
  maxNodeWidth: 100,
  nodeHeight: 40,
  nodeGap: 8,
  rowStep: 84,
  padding: 8,
  showNames: false,
};

// Alles, was die Berechnung der Grafik aus der Komponente braucht
export interface GraphData {
  currentId: number;
  modules: Module[];
  predecessorEdges: PrerequisiteEdge[];
  successorEdges: PrerequisiteEdge[];
}

export interface NameLine {
  text: string;
  y: number;
  textLength: number | null;
}

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  centerX: number;
  label: string;
  labelY: number;
  nameLines: NameLine[];
  fullLabel: string;
  isCurrent: boolean;
}

export interface GraphEdge extends PrerequisiteEdge {
  key: string;
  path: string;
}

export interface GraphLayout {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  minDisplayWidth: number;
  maxDisplayWidth: number;
  nodeWidth: number;
  nodeHeight: number;
}