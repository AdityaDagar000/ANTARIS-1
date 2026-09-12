import { config } from '../../config.js';
import type { PolicyClass, Priority } from '../../types/index.js';

const PRIORITY_RANK: Record<Priority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

export interface PolicyDecision {
  policyClass: PolicyClass;
  allowAutomation: boolean;
  reason: string;
}

export function evaluatePolicy(
  policyClass: PolicyClass,
  priority: Priority
): PolicyDecision {
  const threshold = config.greylistAutoPriority === 'CRITICAL' ? 4 : 3;

  switch (policyClass) {
    case 'WHITELIST':
      return {
        policyClass,
        allowAutomation: true,
        reason: 'WHITELIST procedure — safe for automated execution',
      };
    case 'GREYLIST':
      const allow = PRIORITY_RANK[priority] >= threshold;
      return {
        policyClass,
        allowAutomation: allow,
        reason: allow
          ? `GREYLIST with ${priority} priority — automated action authorized`
          : `GREYLIST with ${priority} priority — routing to personnel`,
      };
    case 'BLACKLIST':
      return {
        policyClass,
        allowAutomation: false,
        reason: 'BLACKLIST procedure — personnel assignment required',
      };
    default:
      return {
        policyClass: 'BLACKLIST',
        allowAutomation: false,
        reason: 'Unknown policy — defaulting to personnel assignment',
      };
  }
}
