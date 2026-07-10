import { config } from '../config/env.js';

// Return the resource quotas applied to every execution container.
export function getQuotas() {
  return {
    cpus: config.execCpus,
    memory: config.execMemory,
    pids: config.execPids,
    timeoutMs: config.execTimeoutMs,
  };
}
