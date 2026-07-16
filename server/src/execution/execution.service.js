import { runContainer } from './docker-runner.js';
import { getLanguageConfig } from './languages.js';
import { getQuotas } from './quotas.js';
import { detectThreats } from './malicious-detection.js';

// Build the result returned when code is blocked before execution.
function blocked(threats) {
  return {
    error: 'blocked_malicious_code',
    threats,
    stdout: '',
    stderr: `Blocked before execution: ${threats.join(', ')}`,
  };
}

// Merge the global quotas with any per-language overrides.
function resolveLimits(config) {
  const quotas = getQuotas();
  return {
    cpus: config.cpus ?? quotas.cpus,
    memory: config.memory ?? quotas.memory,
    pids: config.pids ?? quotas.pids,
    timeoutMs: config.timeoutMs ?? quotas.timeoutMs,
  };
}

// Run code for a language through the shared sandbox runner.
async function execute(language, code) {
  const config = getLanguageConfig(language);
  if (!config) {
    return { error: 'unsupported_language', stdout: '', stderr: '' };
  }
  const threats = detectThreats(language, code);
  if (threats.length > 0) {
    return blocked(threats);
  }
  return runContainer(config, code, resolveLimits(config));
}

// Execute JavaScript source code in the sandbox.
export function executeJavaScript(code) {
  return execute('javascript', code);
}

// Execute Python source code in the sandbox.
export function executePython(code) {
  return execute('python', code);
}

// Execute code for any supported language in the sandbox.
export function executeCode(language, code) {
  return execute(language, code);
}
