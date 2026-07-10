import { runContainer } from './docker-runner.js';
import { getLanguageConfig } from './languages.js';
import { getQuotas } from './quotas.js';

// Run code for a language through the shared sandbox runner.
async function execute(language, code) {
  const config = getLanguageConfig(language);
  if (!config) {
    return { error: 'unsupported_language', stdout: '', stderr: '' };
  }
  return runContainer(config, code, getQuotas().timeoutMs);
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
