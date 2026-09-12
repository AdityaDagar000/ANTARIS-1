import fs from 'fs';
import path from 'path';
import { config } from '../config.js';

interface StoreData {
  predictions: Record<string, unknown>[];
  components: Record<string, unknown>[];
  tickets: Record<string, unknown>[];
  automation_events: Record<string, unknown>[];
  personnel_state: Record<string, unknown>[];
  system_state: Record<string, string>;
  health_history: Record<string, unknown>[];
}

const defaultData: StoreData = {
  predictions: [],
  components: [],
  tickets: [],
  automation_events: [],
  personnel_state: [],
  system_state: {},
  health_history: [],
};

let data: StoreData = { ...defaultData };
let storePath: string;

function getStorePath(): string {
  if (!storePath) {
    const dbPath = config.databaseUrl.endsWith('.json')
      ? config.databaseUrl
      : config.databaseUrl.replace(/\.db$/, '.json');
    storePath = dbPath;
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  return storePath;
}

export function loadStore(): void {
  const filePath = getStorePath();
  if (fs.existsSync(filePath)) {
    try {
      data = { ...defaultData, ...JSON.parse(fs.readFileSync(filePath, 'utf-8')) };
    } catch {
      data = { ...defaultData };
    }
  } else {
    data = { ...defaultData };
    saveStore();
  }
}

export function saveStore(): void {
  fs.writeFileSync(getStorePath(), JSON.stringify(data, null, 2), 'utf-8');
}

export function getStore(): StoreData {
  return data;
}

export function getSystemState(key: string): string | null {
  return data.system_state[key] ?? null;
}

export function setSystemState(key: string, value: string): void {
  data.system_state[key] = value;
  saveStore();
}
