import fs from 'fs';
import path from 'path';
import { config } from '../../config.js';
import type { StandardProcedure } from '../../types/index.js';

let procedures: StandardProcedure[] | null = null;

function loadProcedures(): StandardProcedure[] {
  if (!procedures) {
    const filePath = path.join(config.configDir, 'sops.json');
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as StandardProcedure[];
    procedures = raw;
  }
  return procedures;
}

export function getAllProcedures(): StandardProcedure[] {
  return loadProcedures().filter((p) => p.status === 'Active');
}

export function getProcedureById(id: string): StandardProcedure | undefined {
  return loadProcedures().find((p) => p.id === id);
}

export function findProcedureForComponent(componentType: string): StandardProcedure | undefined {
  const active = getAllProcedures();
  const exact = active.find(
    (p) => p.componentType?.toLowerCase() === componentType.toLowerCase()
  );
  if (exact) return exact;

  return active.find((p) =>
    componentType.toLowerCase().includes(p.componentType?.toLowerCase() || '')
  );
}
