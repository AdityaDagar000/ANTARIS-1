import { v4 as uuidv4 } from 'uuid';
import { getStore, upsertTicket } from '../../database/db.js';
import type { MaintenanceTicket, Priority, TicketEvent, TicketStatus } from '../../types/index.js';
import { logAutomationEvent } from './eventLog.js';
import { updatePersonnelAssignment } from './personnelAssignmentService.js';

let ticketCounter = 0;

function initTicketCounter(): void {
  ticketCounter = getStore().tickets.length;
}

function generateTicketId(): string {
  if (ticketCounter === 0) initTicketCounter();
  ticketCounter += 1;
  return `MT-${String(ticketCounter).padStart(3, '0')}`;
}

function resolveAssignedDisplayName(row: Record<string, unknown>): string | undefined {
  const assignedPersonnelName = row.assigned_personnel_name as string | undefined;
  if (assignedPersonnelName) return assignedPersonnelName;

  const automationAction = row.automation_action as string | undefined;
  if (automationAction) return 'Antaris';

  const status = row.status as TicketStatus;
  if (status === 'Escalated') return 'Escalated';
  if (status === 'Automated' || status === 'Automation Pending') return 'Antaris';

  const timeline = JSON.parse((row.timeline_json as string) || '[]') as TicketEvent[];
  if (timeline.some((event) => event.type === 'ACTUATOR_COMMAND')) return 'Antaris';
  if (timeline.some((event) => event.type === 'ESCALATED')) return 'Escalated';

  return undefined;
}

function rowToTicket(row: Record<string, unknown>): MaintenanceTicket {
  const status = row.status as TicketStatus;
  const assignedPersonnelName = resolveAssignedDisplayName(row);

  return {
    id: row.id as string,
    assetId: row.asset_id as string,
    componentId: row.component_id as string,
    componentName: row.component_name as string,
    predictionId: row.prediction_id as string | undefined,
    faultType: row.fault_type as string,
    priority: row.priority as Priority,
    status,
    procedureId: row.procedure_id as string | undefined,
    policyClass: row.policy_class as MaintenanceTicket['policyClass'],
    assignedPersonnelId: row.assigned_personnel_id as string | undefined,
    assignedPersonnelName,
    automationAction: row.automation_action as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    resolvedAt: row.resolved_at as string | undefined,
    closedAt: row.closed_at as string | undefined,
    timeline: JSON.parse((row.timeline_json as string) || '[]') as TicketEvent[],
  };
}

function ticketToRow(ticket: MaintenanceTicket): Record<string, unknown> {
  return {
    id: ticket.id,
    asset_id: ticket.assetId,
    component_id: ticket.componentId,
    component_name: ticket.componentName,
    prediction_id: ticket.predictionId ?? null,
    fault_type: ticket.faultType,
    priority: ticket.priority,
    status: ticket.status,
    procedure_id: ticket.procedureId ?? null,
    policy_class: ticket.policyClass ?? null,
    assigned_personnel_id: ticket.assignedPersonnelId ?? null,
    assigned_personnel_name: ticket.assignedPersonnelName ?? null,
    automation_action: ticket.automationAction ?? null,
    created_at: ticket.createdAt,
    updated_at: ticket.updatedAt,
    resolved_at: ticket.resolvedAt ?? null,
    closed_at: ticket.closedAt ?? null,
    timeline_json: JSON.stringify(ticket.timeline),
  };
}

function addTimelineEvent(ticket: MaintenanceTicket, type: string, message: string): TicketEvent {
  const event: TicketEvent = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    type,
    message,
  };
  ticket.timeline.push(event);
  return event;
}

export function findOpenTicketForComponent(componentId: string): MaintenanceTicket | undefined {
  const row = getStore().tickets
    .filter((t) => t.component_id === componentId && !['Resolved', 'Closed'].includes(t.status as string))
    .sort((a, b) => (b.created_at as string).localeCompare(a.created_at as string))[0];
  return row ? rowToTicket(row) : undefined;
}

export function createTicket(params: {
  assetId: string;
  componentId: string;
  componentName: string;
  predictionId?: string;
  faultType: string;
  priority: Priority;
}): MaintenanceTicket {
  const now = new Date().toISOString();
  const ticket: MaintenanceTicket = {
    id: generateTicketId(),
    assetId: params.assetId,
    componentId: params.componentId,
    componentName: params.componentName,
    predictionId: params.predictionId,
    faultType: params.faultType,
    priority: params.priority,
    status: 'Open',
    createdAt: now,
    updatedAt: now,
    timeline: [],
  };

  addTimelineEvent(ticket, 'PREDICTION_RECEIVED', 'Prediction received from ML model');
  addTimelineEvent(ticket, 'FAULT_DETECTED', `Fault detected: ${params.faultType}`);
  addTimelineEvent(ticket, 'TICKET_CREATED', `Ticket ${ticket.id} created`);

  upsertTicket(ticketToRow(ticket));

  console.log(`[TICKET] Created ${ticket.id}`);
  logAutomationEvent('TICKET_CREATED', `Maintenance ticket ${ticket.id} created for ${params.componentName}`, {
    assetId: params.assetId,
    componentId: params.componentId,
    ticketId: ticket.id,
  });

  return ticket;
}

export function updateTicket(ticket: MaintenanceTicket): void {
  ticket.updatedAt = new Date().toISOString();
  upsertTicket(ticketToRow(ticket));
}

function releaseAssignedPersonnel(ticket: MaintenanceTicket): void {
  if (ticket.assignedPersonnelId) {
    updatePersonnelAssignment(ticket.assignedPersonnelId, false);
  }
}

function finalizeTicket(
  ticket: MaintenanceTicket,
  status: 'Resolved' | 'Closed',
  resolutionEvent: { type: string; message: string },
  automationEvent?: { type: string; message: string }
): void {
  const now = new Date().toISOString();
  addTimelineEvent(ticket, resolutionEvent.type, resolutionEvent.message);
  addTimelineEvent(ticket, 'TICKET_CLOSED', `Ticket ${ticket.id} resolved`);
  ticket.status = status;
  ticket.resolvedAt = now;
  if (status === 'Closed') {
    ticket.closedAt = now;
  }
  updateTicket(ticket);
  releaseAssignedPersonnel(ticket);

  if (automationEvent) {
    logAutomationEvent(automationEvent.type as Parameters<typeof logAutomationEvent>[0], automationEvent.message, {
      componentId: ticket.componentId,
      ticketId: ticket.id,
    });
  }
  logAutomationEvent('TICKET_CLOSED', `Ticket ${ticket.id} resolved`, {
    componentId: ticket.componentId,
    ticketId: ticket.id,
  });
}

export function closeTicketForRecovery(ticket: MaintenanceTicket): void {
  finalizeTicket(
    ticket,
    'Closed',
    {
      type: 'RECOVERY_DETECTED',
      message: 'Component health recovered per ML prediction',
    },
    {
      type: 'RECOVERY_DETECTED',
      message: `Component ${ticket.componentId} recovered`,
    }
  );
  console.log(`[TICKET] ${ticket.id} automatically closed`);
}

export function resolveTicketAfterAutomation(ticket: MaintenanceTicket, action: string): void {
  finalizeTicket(ticket, 'Resolved', {
    type: 'AUTOMATION_COMPLETED',
    message: `Automated action completed: ${action}`,
  });
  console.log(`[TICKET] ${ticket.id} resolved after automation`);
}

export function resolveTicketForImprovement(ticket: MaintenanceTicket): void {
  finalizeTicket(
    ticket,
    'Resolved',
    {
      type: 'CONDITION_IMPROVED',
      message: 'Component condition improved to early degradation — ticket resolved',
    },
    {
      type: 'RECOVERY_DETECTED',
      message: `Component ${ticket.componentId} condition improved`,
    }
  );
  console.log(`[TICKET] ${ticket.id} resolved after condition improvement`);
}

export function reconcileCompletedTickets(): void {
  const rows = getStore().tickets.filter((row) =>
    ['Automated', 'Automation Pending'].includes(row.status as string)
  );

  for (const row of rows) {
    const timeline = JSON.parse((row.timeline_json as string) || '[]') as TicketEvent[];
    if (!timeline.some((event) => event.type === 'ACTUATOR_COMMAND')) continue;

    const ticket = rowToTicket(row);
    resolveTicketAfterAutomation(ticket, (row.automation_action as string) || 'automation');
  }
}

export function getAllTickets(): MaintenanceTicket[] {
  return getStore()
    .tickets.sort((a, b) => (b.created_at as string).localeCompare(a.created_at as string))
    .map(rowToTicket);
}

export function getTicketById(id: string): MaintenanceTicket | undefined {
  const row = getStore().tickets.find((t) => t.id === id);
  return row ? rowToTicket(row) : undefined;
}

export function createManualTicket(params: {
  componentId: string;
  componentName: string;
  assetId?: string;
  priority: Priority;
  assignedTo?: string;
  faultType?: string;
}): MaintenanceTicket {
  const ticket = createTicket({
    assetId: params.assetId || 'MANUAL',
    componentId: params.componentId,
    componentName: params.componentName,
    faultType: params.faultType || 'Manual maintenance request',
    priority: params.priority,
  });

  if (params.assignedTo) {
    ticket.assignedPersonnelName = params.assignedTo;
    ticket.status = 'Assigned';
    addTimelineEvent(ticket, 'PERSONNEL_ASSIGNED', `Manually assigned to ${params.assignedTo}`);
    updateTicket(ticket);
  }

  return ticket;
}
