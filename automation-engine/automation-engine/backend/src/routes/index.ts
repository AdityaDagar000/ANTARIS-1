import { Router } from 'express';
import { getStore, getSystemState } from '../database/db.js';
import { predictionToComponent, selectHeroComponents } from '../services/componentMapper.js';
import {
  getAlerts,
  getDashboardSummary,
  getHealthTrend,
  getLatestPredictions,
} from '../services/dashboardService.js';
import { getAutomationEvents } from '../services/automation/eventLog.js';
import { getAllPersonnel, getPersonnelById } from '../services/automation/personnelAssignmentService.js';
import { getAllProcedures, getProcedureById } from '../services/automation/procedureService.js';
import { getAllTickets, createManualTicket, getTicketById } from '../services/automation/ticketService.js';
import { getEnergyLoads, getLastOptimization, optimizeEnergy } from '../services/energy/energyOptimizer.js';
import fs from 'fs';
import path from 'path';
import { config } from '../config.js';
import type { Priority } from '../types/index.js';
import { topologyService } from '../services/digitalTwin/topologyService.js';

const router = Router();

router.get('/health', (_req, res) => {
  const mlStatus = getSystemState('ml_connection_status') || 'waiting';
  res.json({
    status: 'ok',
    mlConnection: mlStatus,
    timestamp: new Date().toISOString(),
  });
});

router.get('/dashboard/summary', (_req, res) => {
  res.json(getDashboardSummary());
});

router.get('/predictions', (_req, res) => {
  const predictions = getLatestPredictions();
  res.json(predictions);
});

router.get('/predictions/latest', (_req, res) => {
  const predictions = getLatestPredictions();
  res.json(predictions);
});

router.get('/components', (_req, res) => {
  const predictions = getLatestPredictions();
  const components = predictions.map(predictionToComponent);
  res.json(components);
});

router.get('/components/hero', (_req, res) => {
  const predictions = getLatestPredictions();
  const components = selectHeroComponents(predictions.map(predictionToComponent));
  res.json(components);
});

router.get('/components/:id', (req, res) => {
  const predictions = getLatestPredictions();
  const comp = predictions.find((p) => p.componentId === req.params.id);
  if (!comp) {
    res.status(404).json({ error: 'Component not found' });
    return;
  }
  res.json(predictionToComponent(comp));
});

router.get('/components/faulty', (_req, res) => {
  const predictions = getLatestPredictions();
  const faulty = predictions
    .filter((p) => p.healthStatus !== 'Healthy' && p.healthStatus !== 'Early Degradation')
    .map(predictionToComponent);
  res.json(faulty);
});

router.get('/tickets', (_req, res) => {
  res.json(getAllTickets());
});

router.get('/tickets/:id', (req, res) => {
  const ticket = getTicketById(req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.json(ticket);
});

router.post('/tickets', (req, res) => {
  const { componentId, componentName, priority, assignedTo, faultType, assetId } = req.body;
  if (!componentId) {
    res.status(400).json({ error: 'componentId is required' });
    return;
  }
  const comp = getStore().components.find((c) => c.component_id === componentId);
  const ticket = createManualTicket({
    componentId,
    componentName: componentName || (comp?.name as string) || componentId,
    assetId: assetId || (comp?.asset_id as string),
    priority: (priority as Priority) || 'Medium',
    assignedTo,
    faultType,
  });
  res.status(201).json(ticket);
});

router.get('/personnel', (_req, res) => {
  res.json(getAllPersonnel());
});

router.get('/personnel/:id', (req, res) => {
  const person = getPersonnelById(req.params.id);
  if (!person) {
    res.status(404).json({ error: 'Personnel not found' });
    return;
  }
  res.json(person);
});

router.get('/procedures', (_req, res) => {
  res.json(getAllProcedures());
});

router.get('/procedures/:id', (req, res) => {
  const proc = getProcedureById(req.params.id);
  if (!proc) {
    res.status(404).json({ error: 'Procedure not found' });
    return;
  }
  res.json(proc);
});

router.get('/policies', (_req, res) => {
  const filePath = path.join(config.configDir, 'policies.json');
  const policies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(policies);
});

router.get('/automation', (_req, res) => {
  const events = getAutomationEvents(100);
  res.json({
    events,
    metrics: {
      totalEvents: events.length,
      actuatorCommands: events.filter((e) => e.type === 'ACTUATOR_COMMAND').length,
      ticketsCreated: events.filter((e) => e.type === 'TICKET_CREATED').length,
      personnelAssigned: events.filter((e) => e.type === 'PERSONNEL_ASSIGNED').length,
      lastEvent: events[0]?.timestamp ?? null,
    },
  });
});

router.get('/automation/events', (_req, res) => {
  res.json(getAutomationEvents(100));
});

router.get('/alerts', (_req, res) => {
  res.json(getAlerts(10));
});

router.get('/health-trend', (_req, res) => {
  res.json(getHealthTrend());
});

router.get('/energy', (_req, res) => {
  const loads = getEnergyLoads();
  res.json({ loads, hasTelemetry: loads.length > 0 });
});

router.get('/energy/optimization', (req, res) => {
  const availableKw = req.query.availableKw ? parseFloat(req.query.availableKw as string) : undefined;
  if (availableKw !== undefined) {
    res.json(optimizeEnergy(availableKw));
    return;
  }
  const last = getLastOptimization();
  if (last) {
    res.json(last);
    return;
  }
  res.json(optimizeEnergy());
});

router.get('/digital-twin/topology', (_req, res) => {
  res.json(topologyService.getTopology());
});

router.get('/digital-twin/topology/component/:id', (req, res) => {
  const componentId = req.params.id;
  const node = topologyService.getNode(componentId);
  if (!node) {
    res.status(404).json({ error: `Topology node '${componentId}' not found` });
    return;
  }
  const related = topologyService.getRelatedComponents(componentId);
  res.json({ node, related });
});

export default router;
