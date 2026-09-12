import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { initDatabase } from './database/db.js';
import apiRouter from './routes/index.js';
import { reconcileCompletedTickets } from './services/automation/ticketService.js';
import { repairComponentStoreFromPredictions } from './services/ml/repairComponentStore.js';
import { startMlPoller } from './services/ml/mlPoller.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use('/api', apiRouter);

initDatabase();
repairComponentStoreFromPredictions();
reconcileCompletedTickets();

app.listen(config.port, () => {
  console.log(`[SERVER] ANTARIS backend running on http://localhost:${config.port}`);
  startMlPoller();
});
