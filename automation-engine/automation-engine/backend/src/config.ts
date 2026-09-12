import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootEnv = path.resolve(__dirname, '../../.env');
const localEnv = path.resolve(__dirname, '../.env');
dotenv.config({ path: rootEnv });
dotenv.config({ path: localEnv });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  mlApiUrl: process.env.ML_API_URL || 'https://digital-twin-rul-api-qm5j.onrender.com/predictions',
  mlPollIntervalMs: parseInt(process.env.ML_POLL_INTERVAL_MS || '30000', 10),
  mlRequestTimeoutMs: parseInt(process.env.ML_REQUEST_TIMEOUT_MS || '60000', 10),
  greylistAutoPriority: (process.env.GREYLIST_AUTO_PRIORITY || 'HIGH').toUpperCase() as 'HIGH' | 'CRITICAL',
  databaseUrl: process.env.DATABASE_URL
    ? (process.env.DATABASE_URL.startsWith('.')
        ? path.resolve(__dirname, '../..', process.env.DATABASE_URL)
        : process.env.DATABASE_URL)
    : path.resolve(__dirname, '../data/antaris.json'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  configDir: path.resolve(__dirname, 'config'),
};
