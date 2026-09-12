import fs from 'fs';
import path from 'path';
import { config } from '../../config.js';
import { getStore, upsertPersonnelState } from '../../database/db.js';
import type { Personnel, StandardProcedure } from '../../types/index.js';

let personnelConfig: Personnel[] | null = null;

function loadPersonnelConfig(): Personnel[] {
  if (!personnelConfig) {
    const filePath = path.join(config.configDir, 'personnel.json');
    personnelConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Personnel[];
  }
  return personnelConfig;
}

function getPersonnelState(personnelId: string): { availability: string; currentWorkload: number; activeAssignments: number } {
  const row = getStore().personnel_state.find((p) => p.personnel_id === personnelId);
  if (row) {
    return {
      availability: row.availability as string,
      currentWorkload: row.current_workload as number,
      activeAssignments: row.active_assignments as number,
    };
  }
  return { availability: 'Available', currentWorkload: 0, activeAssignments: 0 };
}

export function getAllPersonnel(): Personnel[] {
  return loadPersonnelConfig().map((p) => {
    const state = getPersonnelState(p.id);
    return {
      ...p,
      availability: state.availability as Personnel['availability'],
      currentWorkload: state.currentWorkload,
      activeAssignments: state.activeAssignments,
    };
  });
}

export function getPersonnelById(id: string): Personnel | undefined {
  return getAllPersonnel().find((p) => p.id === id);
}

export interface AssignmentResult {
  personnel: Personnel | null;
  escalated: boolean;
  reason: string;
}

function countSkillMatches(person: Personnel, requiredSkills: string[]): number {
  const personSkills = person.skills.map((s) => s.toLowerCase());
  return requiredSkills.filter((skill) =>
    personSkills.some((ps) => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
  ).length;
}

export function assignPersonnel(procedure: StandardProcedure): AssignmentResult {
  const requiredSkills = procedure.requiredSkills || [];
  const allPersonnel = getAllPersonnel();

  const qualified = allPersonnel
    .map((p) => ({ person: p, matchCount: countSkillMatches(p, requiredSkills) }))
    .filter((x) => x.matchCount > 0)
    .sort((a, b) => {
      const availRank = (p: Personnel) => {
        if (p.availability === 'Available') return 0;
        if (p.availability === 'On Assignment') return 1;
        return 2;
      };
      const availDiff = availRank(a.person) - availRank(b.person);
      if (availDiff !== 0) return availDiff;
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return a.person.currentWorkload - b.person.currentWorkload;
    });

  if (qualified.length === 0) {
    return {
      personnel: null,
      escalated: true,
      reason: 'No personnel with required skills — ESCALATED',
    };
  }

  const available = qualified.filter((q) => q.person.availability === 'Available');
  const selected = available.length > 0 ? available[0].person : qualified[0].person;

  const reason =
    available.length > 0
      ? `Assigned ${selected.name} — best available match with ${countSkillMatches(selected, requiredSkills)} skill(s)`
      : `No currently available specialist. Assigned ${selected.name} (qualified, lowest workload).`;

  return { personnel: selected, escalated: false, reason };
}

export function updatePersonnelAssignment(personnelId: string, increment: boolean, reason?: string): void {
  const existing = getStore().personnel_state.find((p) => p.personnel_id === personnelId);
  const workload = ((existing?.current_workload as number) ?? 0) + (increment ? 1 : -1);
  const assignments = Math.max(0, ((existing?.active_assignments as number) ?? 0) + (increment ? 1 : -1));

  upsertPersonnelState({
    personnel_id: personnelId,
    availability: assignments > 0 ? 'On Assignment' : 'Available',
    current_workload: Math.max(0, workload),
    active_assignments: assignments,
    last_assignment_reason: reason ?? null,
  });
}
