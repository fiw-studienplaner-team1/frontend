import { Module } from '../../models/module';
import { GraphData, GraphEdge, GraphLayout, GraphNode, LayoutConfig, NameLine } from './prerequisite-graph.model';

const CHAR_WIDTH = 5.6;

export function buildLayout(data: GraphData, config: LayoutConfig): GraphLayout {
  const idsPerLevel = groupByLevel(data);

  const chainLevels = [...idsPerLevel.keys()];
  const firstLevel = Math.min(...chainLevels);
  const lastLevel = Math.max(...chainLevels);

  const left = config.padding;
  const areaWidth = config.viewWidth - left - config.padding;
  const maxPerRow = Math.max(...[...idsPerLevel.values()].map((ids) => ids.length));
  const nodeWidth = Math.min(
    config.maxNodeWidth,
    (areaWidth - (maxPerRow - 1) * config.nodeGap) / maxPerRow,
  );
  const rowWidth = (count: number) => count * nodeWidth + (count - 1) * config.nodeGap;
  const rowY = (level: number) => config.padding + (level - firstLevel) * config.rowStep;

  const nodes: GraphNode[] = [];
  for (const [level, ids] of idsPerLevel) {
    const startX = left + (areaWidth - rowWidth(ids.length)) / 2;
    const y = rowY(level);
    ids.forEach((id, i) => {
      const x = startX + i * (nodeWidth + config.nodeGap);
      nodes.push({
        id,
        x,
        y,
        centerX: x + nodeWidth / 2,
    // TODO: auf dem Handy Kuerzel statt Modulnummer anzeigen, sobald es das Feld im Modell gibt
        label: getModuleNumber(data.modules, id),
        labelY: config.showNames ? y + 18 : y + config.nodeHeight / 2 + 5,
        nameLines: config.showNames ? buildNameLines(getModuleName(data.modules, id), y, nodeWidth) : [],
        fullLabel: formatModuleLabel(data.modules, id),
        isCurrent: id === data.currentId,
      });
    });
  }

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edges: GraphEdge[] = [...data.predecessorEdges, ...data.successorEdges].map((edge) => {
    const from = nodeById.get(edge.predecessorModuleId)!;
    const to = nodeById.get(edge.successorModuleId)!;
    const x1 = from.centerX;
    const y1 = from.y + config.nodeHeight;
    const x2 = to.centerX;
    const y2 = to.y - 2;
    const bend = (y2 - y1) / 2;
    return {
      ...edge,
      key: String(edge.id),
      path: `M ${x1} ${y1} C ${x1} ${y1 + bend}, ${x2} ${y2 - bend}, ${x2} ${y2}`,
    };
  });

  return {
    nodes,
    edges,
    width: config.viewWidth,
    height: 2 * config.padding + (lastLevel - firstLevel) * config.rowStep + config.nodeHeight,
    minDisplayWidth: config.minDisplayWidth,
    maxDisplayWidth: config.maxDisplayWidth,
    nodeWidth,
    nodeHeight: config.nodeHeight,
  };
}

export function formatModuleLabel(modules: Module[], id: number): string {
  return getModuleNumber(modules, id) + ' ' + getModuleName(modules, id);
}

function groupByLevel(data: GraphData): Map<number, number[]> {
  const levels = computeLevels(data);

  const idsPerLevel = new Map<number, number[]>();
  for (const [id, level] of levels) {
    const ids = idsPerLevel.get(level) ?? [];
    ids.push(id);
    idsPerLevel.set(level, ids);
  }
  for (const ids of idsPerLevel.values()) {
    ids.sort((a, b) => getModuleNumber(data.modules, a).localeCompare(getModuleNumber(data.modules, b)));
  }

  return idsPerLevel;
}

function computeLevels(data: GraphData): Map<number, number> {
  const ids = new Set<number>([data.currentId]);
  for (const edge of [...data.predecessorEdges, ...data.successorEdges]) {
    ids.add(edge.predecessorModuleId);
    ids.add(edge.successorModuleId);
  }

  const semesters = new Map<number, number>();
  for (const m of data.modules) {
    if (m.recommendedSemester !== undefined && m.recommendedSemester !== null) {
      semesters.set(m.id, m.recommendedSemester);
    }
  }

  if ([...ids].every((id) => semesters.has(id))) {
    const levels = new Map<number, number>();
    for (const id of ids) levels.set(id, semesters.get(id)!);
    return levels;
  }

  const levels = new Map<number, number>([[data.currentId, 0]]);
  let changed = true;
  let rounds = 0;
  while (changed && rounds < 100) {
    changed = false;
    rounds++;

    for (const edge of data.predecessorEdges) {
      const successorLevel = levels.get(edge.successorModuleId);
      if (successorLevel === undefined) continue;
      const current = levels.get(edge.predecessorModuleId);
      if (current === undefined || current > successorLevel - 1) {
        levels.set(edge.predecessorModuleId, successorLevel - 1);
        changed = true;
      }
    }

    for (const edge of data.successorEdges) {
      const predecessorLevel = levels.get(edge.predecessorModuleId);
      if (predecessorLevel === undefined) continue;
      const current = levels.get(edge.successorModuleId);
      if (current === undefined || current < predecessorLevel + 1) {
        levels.set(edge.successorModuleId, predecessorLevel + 1);
        changed = true;
      }
    }
  }
  return levels;
}

function findModule(modules: Module[], id: number): Module | undefined {
  return modules.find((m) => m.id === id);
}

function getModuleNumber(modules: Module[], id: number): string {
  const module = findModule(modules, id);
  return module ? module.moduleNumber : '?';
}

function getModuleName(modules: Module[], id: number): string {
  const module = findModule(modules, id);
  return module ? module.name : 'Unbekanntes Modul';
}

function buildNameLines(name: string, nodeY: number, nodeWidth: number): NameLine[] {
  const textWidth = nodeWidth - 16;
  const maxChars = Math.floor(textWidth / CHAR_WIDTH);

  const lines: string[] = [];
  let line = '';
  for (const word of name.split(' ')) {
    if (line === '') {
      line = word;
    } else if ((line + ' ' + word).length <= maxChars) {
      line += ' ' + word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line !== '') lines.push(line);
  if (lines.length > 2) {
    lines.splice(2);
    lines[1] += ' …';
  }

  const yPositions = lines.length === 1 ? [nodeY + 38] : [nodeY + 33, nodeY + 46];
  return lines.map((text, i) => ({
    text,
    y: yPositions[i],
    textLength: text.length > maxChars ? textWidth : null,
  }));
}