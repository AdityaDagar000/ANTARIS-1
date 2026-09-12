import { v4 as uuidv4 } from 'uuid';
import type { ActuatorCommand, ActuatorResult } from '../../types/index.js';
import { logAutomationEvent } from './eventLog.js';

export interface ActuatorService {
  execute(command: ActuatorCommand): Promise<ActuatorResult>;
}

export class SimulationActuatorService implements ActuatorService {
  async execute(command: ActuatorCommand): Promise<ActuatorResult> {
    const result: ActuatorResult = {
      success: true,
      simulated: true,
      message: `[SIMULATED] Actuator command "${command.action}" issued for ${command.componentId}`,
      timestamp: new Date().toISOString(),
    };

    console.log(`[ACTUATOR] Simulation command executed: ${command.action} on ${command.componentId}`);
    logAutomationEvent('ACTUATOR_COMMAND', result.message, {
      assetId: command.assetId,
      componentId: command.componentId,
      ticketId: command.ticketId,
      metadata: { action: command.action, simulated: true, reason: command.reason },
    });

    return result;
  }
}

export const actuatorService: ActuatorService = new SimulationActuatorService();
