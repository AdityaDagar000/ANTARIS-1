import { v4 as uuidv4 } from 'uuid';
import { getStore, insertAutomationEvent } from '../../database/db.js';
import type { AutomationEvent, AutomationEventType } from '../../types/index.js';

export function logAutomationEvent(
  type: AutomationEventType,
  message: string,
  opts?: {
    assetId?: string;
    componentId?: string;
    ticketId?: string;
    metadata?: Record<string, unknown>;
  }
): AutomationEvent {
  const event: AutomationEvent = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    type,
    message,
    assetId: opts?.assetId,
    componentId: opts?.componentId,
    ticketId: opts?.ticketId,
    metadata: opts?.metadata,
  };

  insertAutomationEvent({
    id: event.id,
    timestamp: event.timestamp,
    type: event.type,
    asset_id: event.assetId ?? null,
    component_id: event.componentId ?? null,
    ticket_id: event.ticketId ?? null,
    message: event.message,
    metadata_json: event.metadata ? JSON.stringify(event.metadata) : null,
  });

  console.log(`[AUTOMATION] ${type}: ${message}`);
  return event;
}

export function getAutomationEvents(limit = 100): AutomationEvent[] {
  const rows = getStore().automation_events.slice(0, limit);

  return rows.map((row) => ({
    id: row.id as string,
    timestamp: row.timestamp as string,
    type: row.type as AutomationEventType,
    assetId: (row.asset_id as string) ?? undefined,
    componentId: (row.component_id as string) ?? undefined,
    ticketId: (row.ticket_id as string) ?? undefined,
    message: row.message as string,
    metadata: row.metadata_json ? JSON.parse(row.metadata_json as string) : undefined,
  }));
}

export function countAutomationEventsByType(type: AutomationEventType): number {
  return getStore().automation_events.filter((e) => e.type === type).length;
}
