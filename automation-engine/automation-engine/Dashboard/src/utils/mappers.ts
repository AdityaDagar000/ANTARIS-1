import type { PersonnelItem, ProcedureItem, TicketItem } from '../types';

function resolveAssignedTo(t: Record<string, unknown>): string {
  const name = t.assignedPersonnelName as string;
  if (name) return name;

  const automationAction = t.automationAction as string;
  if (automationAction) return 'Antaris';

  const status = t.status as string;
  if (status === 'Escalated') return 'Escalated';
  if (status === 'Automated' || status === 'Automation Pending') return 'Antaris';

  const timeline = t.timeline as Array<{ type: string }> | undefined;
  if (timeline?.some((event) => event.type === 'ACTUATOR_COMMAND')) return 'Antaris';
  if (timeline?.some((event) => event.type === 'ESCALATED')) return 'Escalated';

  return 'Unassigned';
}

export function mapTicketFromApi(t: Record<string, unknown>): TicketItem {
  return {
    id: t.id as string,
    componentId: t.componentId as string,
    componentName: t.componentName as string,
    priority: t.priority as TicketItem['priority'],
    status: mapTicketStatus(t.status as string),
    assignedTo: resolveAssignedTo(t),
    created: formatDate(t.createdAt as string),
    faultType: t.faultType as string,
    policyClass: t.policyClass as string,
    timeline: t.timeline as TicketItem['timeline'],
  };
}

function mapTicketStatus(status: string): string {
  const map: Record<string, string> = {
    Open: 'Open',
    'Automation Pending': 'In Progress',
    Automated: 'In Progress',
    Assigned: 'In Progress',
    'In Progress': 'In Progress',
    Escalated: 'In Progress',
    Resolved: 'Resolved',
    Closed: 'Resolved',
  };
  return map[status] || status;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString();
}

export function mapPersonnelFromApi(p: Record<string, unknown>): PersonnelItem {
  return {
    id: p.id as string,
    name: p.name as string,
    role: p.role as string,
    skills: p.skills as string[],
    availability: p.availability as PersonnelItem['availability'],
    assignment:
      (p.activeAssignments as number) > 0
        ? `${p.activeAssignments as number} active assignment(s)`
        : 'No active assignments',
    shift: (p.shift as string) || '—',
    lastActivity: '—',
    contactStatus: p.availability === 'Available' ? 'Online' : 'Busy',
  };
}

export function mapProcedureFromApi(p: Record<string, unknown>): ProcedureItem {
  const steps = p.steps as Array<{ order: number; description: string }> | string[];
  return {
    id: p.id as string,
    name: p.name as string,
    category: p.category as string,
    version: p.version as string,
    lastUpdated: '—',
    status: p.status as ProcedureItem['status'],
    purpose: p.purpose as string,
    prerequisites: p.prerequisites as string[],
    steps: Array.isArray(steps)
      ? steps.map((s) => (typeof s === 'string' ? s : s.description))
      : [],
    warnings: p.warnings as string[],
    owner: p.owner as string,
    automationPolicy: p.automationPolicy as string,
  };
}
