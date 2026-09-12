import { config } from '../../config.js';
import { automationEngine } from '../automation/automationEngine.js';
import { logAutomationEvent } from '../automation/eventLog.js';
import { mlPredictionService } from './mlPredictionService.js';

let pollTimer: ReturnType<typeof setInterval> | null = null;
let isPolling = false;

export async function pollMlPredictions(): Promise<void> {
  if (isPolling) return;
  isPolling = true;
  try {
    const predictions = await mlPredictionService.fetchPredictions();
    await automationEngine.processPredictions(predictions);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown polling error';
    console.error(`[ML] Poll cycle failed: ${message}`);
    logAutomationEvent('ML_POLL_ERROR', `ML polling failed: ${message}`);
  } finally {
    isPolling = false;
  }
}

export function startMlPoller(): void {
  console.log(`[ML] Starting poller (interval: ${config.mlPollIntervalMs}ms)`);
  pollMlPredictions();
  pollTimer = setInterval(pollMlPredictions, config.mlPollIntervalMs);
}

export function stopMlPoller(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
