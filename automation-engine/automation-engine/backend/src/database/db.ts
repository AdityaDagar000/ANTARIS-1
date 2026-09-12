import { getStore, loadStore, saveStore, getSystemState, setSystemState } from './store.js';

export { getStore, getSystemState, setSystemState, saveStore };

export function getDb(): { store: ReturnType<typeof getStore>; save: typeof saveStore } {
  return { store: getStore(), save: saveStore };
}

export function initDatabase(): void {
  loadStore();
}

// Compatibility helpers mimicking better-sqlite3 prepare API patterns
export function upsertComponent(component: Record<string, unknown>): void {
  const store = getStore();
  const idx = store.components.findIndex((c) => c.component_id === component.component_id);
  if (idx >= 0) {
    store.components[idx] = component;
  } else {
    store.components.push(component);
  }
  saveStore();
}

export function insertPrediction(prediction: Record<string, unknown>): void {
  const store = getStore();
  const withIngested = {
    ...prediction,
    ingested_at: prediction.ingested_at || new Date().toISOString(),
  };
  store.predictions.push(withIngested);
  if (store.predictions.length > 5000) {
    store.predictions = store.predictions.slice(-5000);
  }
  saveStore();
}

export function upsertTicket(ticket: Record<string, unknown>): void {
  const store = getStore();
  const idx = store.tickets.findIndex((t) => t.id === ticket.id);
  if (idx >= 0) {
    store.tickets[idx] = ticket;
  } else {
    store.tickets.push(ticket);
  }
  saveStore();
}

export function insertAutomationEvent(event: Record<string, unknown>): void {
  const store = getStore();
  store.automation_events.unshift(event);
  if (store.automation_events.length > 2000) {
    store.automation_events = store.automation_events.slice(0, 2000);
  }
  saveStore();
}

export function upsertPersonnelState(state: Record<string, unknown>): void {
  const store = getStore();
  const idx = store.personnel_state.findIndex((p) => p.personnel_id === state.personnel_id);
  if (idx >= 0) {
    store.personnel_state[idx] = state;
  } else {
    store.personnel_state.push(state);
  }
  saveStore();
}

export function insertHealthHistory(entry: Record<string, unknown>): void {
  const store = getStore();
  store.health_history.push(entry);
  if (store.health_history.length > 500) {
    store.health_history = store.health_history.slice(-500);
  }
  saveStore();
}
