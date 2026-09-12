import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { initDatabase } from './database/db.js';
import apiRouter from './routes/index.js';
import { reconcileCompletedTickets } from './services/automation/ticketService.js';
import { repairComponentStoreFromPredictions } from './services/ml/repairComponentStore.js';
import { startMlPoller } from './services/ml/mlPoller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use('/api', apiRouter);

// Serve static Dashboard assets in production if dist directory exists
const dashboardDist = path.resolve(__dirname, '../../Dashboard/dist');
if (fs.existsSync(dashboardDist)) {
  app.use(express.static(dashboardDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(dashboardDist, 'index.html'));
  });
}

initDatabase();
repairComponentStoreFromPredictions();
reconcileCompletedTickets();

app.listen(config.port, () => {
  console.log(`[SERVER] ANTARIS backend running on http://localhost:${config.port}`);
  startMlPoller();
});

