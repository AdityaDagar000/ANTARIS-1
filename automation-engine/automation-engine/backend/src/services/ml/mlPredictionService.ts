import { config } from '../../config.js';
import { setSystemState } from '../../database/db.js';
import type { Prediction } from '../../types/index.js';
import { normalizePrediction, validateMlResponse } from './predictionNormalizer.js';

export class MlPredictionService {
  async fetchPredictions(): Promise<Prediction[]> {
    console.log('[ML] Fetching predictions...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.mlRequestTimeoutMs);

    try {
      const response = await fetch(config.mlApiUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`ML API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const rawItems = validateMlResponse(data);
      const predictions: Prediction[] = [];

      for (const raw of rawItems) {
        const normalized = normalizePrediction(raw);
        if (normalized) {
          predictions.push(normalized);
        }
      }

      console.log(`[ML] Received ${predictions.length} predictions`);
      setSystemState('ml_connection_status', 'connected');
      setSystemState('ml_last_fetch', new Date().toISOString());
      setSystemState('ml_last_count', String(predictions.length));

      return predictions;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[ML] Fetch failed: ${message}`);
      setSystemState('ml_connection_status', 'unavailable');
      setSystemState('ml_last_error', message);
      setSystemState('ml_last_error_time', new Date().toISOString());
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const mlPredictionService = new MlPredictionService();
