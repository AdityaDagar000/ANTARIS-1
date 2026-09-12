import { v4 as uuidv4 } from 'uuid';
import { insertHealthHistory, insertPrediction, upsertComponent } from '../../database/db.js';
import type { Prediction } from '../../types/index.js';
import { actuatorService } from './actuatorService.js';
import { logAutomationEvent } from './eventLog.js';
import { evaluatePolicy } from './policyEngine.js';
import { assignPersonnel, updatePersonnelAssignment } from './personnelAssignmentService.js';
import { findProcedureForComponent } from './procedureService.js';
import {
  closeTicketForRecovery,
  createTicket,
  findOpenTicketForComponent,
  resolveTicketAfterAutomation,
  resolveTicketForImprovement,
  updateTicket,
} from './ticketService.js';
import { topologyService } from '../digitalTwin/topologyService.js';

function persistPrediction(pred: Prediction): void {
  insertPrediction({
    prediction_id: pred.predictionId,
    asset_id: pred.assetId,
    component_id: pred.componentId,
    component_name: pred.componentName,
    component_type: pred.componentType,
    machine_id: pred.machineId,
    machine_name: pred.machineName,
    room_id: pred.roomId,
    health_status: pred.healthStatus,
    health_score: pred.healthScore ?? null,
    rul: pred.rul ?? null,
    priority: pred.priority ?? null,
    timestamp: pred.timestamp,
    status_message: pred.statusMessage ?? null,
    sensor_status: pred.sensorStatus ?? null,
    active_sensor: pred.activeSensor ?? null,
    anomaly_count: pred.anomalyCount ?? null,
    ml_current_state: pred.mlCurrentState ?? null,
    maintenance_required: pred.maintenanceRequired ? 1 : 0,
    raw_json: JSON.stringify(pred.rawPrediction),
    ingested_at: new Date().toISOString(),
  });

  const ingestedAt = new Date().toISOString();
  upsertComponent({
    component_id: pred.componentId,
    asset_id: pred.assetId,
    name: pred.componentName,
    module: pred.machineName,
    type: pred.componentType,
    machine_id: pred.machineId,
    machine_name: pred.machineName,
    room_id: pred.roomId,
    health_status: pred.healthStatus,
    health_score: pred.healthScore ?? null,
    rul: pred.rul ?? null,
    priority: pred.priority ?? null,
    last_update: pred.timestamp,
    ingested_at: ingestedAt,
    status_message: pred.statusMessage ?? null,
    sensor_status: pred.sensorStatus ?? null,
    active_sensor: pred.activeSensor ?? null,
    anomaly_count: pred.anomalyCount ?? null,
    ml_current_state: pred.mlCurrentState ?? null,
    maintenance_required: pred.maintenanceRequired ? 1 : 0,
    prediction_id: pred.predictionId,
  });
}

function recordHealthHistory(predictions: Prediction[]): void {
  if (predictions.length === 0) return;
  const scores = predictions.filter((p) => p.healthScore !== undefined).map((p) => p.healthScore!);
  if (scores.length === 0) return;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  insertHealthHistory({
    timestamp: new Date().toISOString(),
    avg_health_score: avg,
    component_count: predictions.length,
  });
}

function requiresMaintenance(healthStatus: Prediction['healthStatus']): boolean {
  return healthStatus === 'Degradation to Failure' || healthStatus === 'Fault';
}

export class AutomationEngine {
  async processPredictions(predictions: Prediction[]): Promise<void> {
    if (predictions.length === 0) return;

    recordHealthHistory(predictions);

    for (const pred of predictions) {
      await this.processPrediction(pred);
    }
  }

  async processPrediction(pred: Prediction): Promise<void> {
    persistPrediction(pred);

    logAutomationEvent('PREDICTION_RECEIVED', `Prediction for ${pred.componentName}: ${pred.healthStatus}`, {
      assetId: pred.assetId,
      componentId: pred.componentId,
      metadata: { healthStatus: pred.healthStatus, rul: pred.rul, priority: pred.priority },
    });

    const openTicket = findOpenTicketForComponent(pred.componentId);

    if (pred.healthStatus === 'Healthy') {
      if (openTicket) {
        closeTicketForRecovery(openTicket);
      }
      return;
    }

    if (pred.healthStatus === 'Early Degradation') {
      if (openTicket) {
        resolveTicketForImprovement(openTicket);
      }
      return;
    }

    if (!requiresMaintenance(pred.healthStatus)) return;

    if (openTicket) {
      return;
    }

    console.log(`[AUTOMATION] Processing prediction for ${pred.componentId}...`);

    // Retrieve internal Digital Twin topology context for this component
    const relatedTopology = topologyService.getRelatedComponents(pred.componentId);
    const relatedSummary = relatedTopology.map(
      (r) => `${r.relationship} ${r.node.componentName} (${r.node.componentId})`
    );

    logAutomationEvent('FAULT_DETECTED', `${pred.healthStatus} detected on ${pred.componentName}`, {
      assetId: pred.assetId,
      componentId: pred.componentId,
      metadata: {
        healthStatus: pred.healthStatus,
        topologyRelationships: relatedSummary,
      },
    });

    const ticket = createTicket({
      assetId: pred.assetId,
      componentId: pred.componentId,
      componentName: pred.componentName,
      predictionId: pred.predictionId,
      faultType: pred.healthStatus,
      priority: pred.priority || 'Medium',
    });

    if (relatedSummary.length > 0) {
      ticket.timeline.push({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: 'TOPOLOGY_CONTEXT_EVALUATED',
        message: `Topology structural context: ${relatedSummary.join(', ')}`,
      });
      updateTicket(ticket);
    }

    const procedure = findProcedureForComponent(pred.componentType);
    if (!procedure) {
      ticket.status = 'Escalated';
      ticket.assignedPersonnelName = 'Escalated';
      ticket.timeline.push({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: 'ESCALATED',
        message: 'No matching SOP found — escalated for manual review',
      });
      updateTicket(ticket);
      logAutomationEvent('ESCALATED', `No SOP for component type ${pred.componentType}`, {
        componentId: pred.componentId,
        ticketId: ticket.id,
      });
      return;
    }

    ticket.procedureId = procedure.id;
    ticket.timeline.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'PROCEDURE_SELECTED',
      message: `SOP identified: ${procedure.name}`,
    });
    console.log(`[SOP] Procedure selected: ${procedure.name}`);
    logAutomationEvent('PROCEDURE_SELECTED', `SOP ${procedure.id} selected: ${procedure.name}`, {
      componentId: pred.componentId,
      ticketId: ticket.id,
      metadata: { procedureId: procedure.id },
    });

    ticket.policyClass = procedure.automationPolicy;
    const decision = evaluatePolicy(procedure.automationPolicy, pred.priority || 'Medium');
    ticket.timeline.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'POLICY_EVALUATED',
      message: decision.reason,
    });
    console.log(`[POLICY] ${procedure.automationPolicy} — ${decision.reason}`);
    logAutomationEvent('POLICY_EVALUATED', decision.reason, {
      componentId: pred.componentId,
      ticketId: ticket.id,
      metadata: { policyClass: procedure.automationPolicy, allowAutomation: decision.allowAutomation },
    });

    if (decision.allowAutomation && procedure.allowedActions?.length) {
      ticket.status = 'Automation Pending';
      ticket.assignedPersonnelName = 'Antaris';
      updateTicket(ticket);

      const action = procedure.allowedActions[0];
      ticket.status = 'Automated';
      ticket.assignedPersonnelName = 'Antaris';
      ticket.automationAction = action;
      ticket.timeline.push({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: 'ACTUATOR_COMMAND',
        message: `Automated action authorized: ${action}`,
      });
      console.log('[AUTOMATION] Action authorized');
      updateTicket(ticket);

      const actuatorResult = await actuatorService.execute({
        assetId: pred.assetId,
        componentId: pred.componentId,
        action,
        reason: decision.reason,
        ticketId: ticket.id,
      });

      if (actuatorResult.success) {
        resolveTicketAfterAutomation(ticket, action);
      }
    } else {
      const assignment = assignPersonnel(procedure);
      if (assignment.escalated || !assignment.personnel) {
        ticket.status = 'Escalated';
        ticket.assignedPersonnelName = 'Escalated';
        ticket.timeline.push({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          type: 'ESCALATED',
          message: assignment.reason,
        });
        logAutomationEvent('ESCALATED', assignment.reason, {
          componentId: pred.componentId,
          ticketId: ticket.id,
        });
      } else {
        ticket.status = 'Assigned';
        ticket.assignedPersonnelId = assignment.personnel.id;
        ticket.assignedPersonnelName = assignment.personnel.name;
        ticket.timeline.push({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          type: 'PERSONNEL_ASSIGNED',
          message: assignment.reason,
        });
        updatePersonnelAssignment(assignment.personnel.id, true, assignment.reason);
        logAutomationEvent('PERSONNEL_ASSIGNED', assignment.reason, {
          componentId: pred.componentId,
          ticketId: ticket.id,
          metadata: { personnelId: assignment.personnel.id, personnelName: assignment.personnel.name },
        });
      }
      updateTicket(ticket);
    }
  }
}

export const automationEngine = new AutomationEngine();
