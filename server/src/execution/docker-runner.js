import { spawn } from 'child_process';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { nanoid } from 'nanoid';

const MAX_OUTPUT = 100000;

// Build the docker run arguments that enforce isolation for one execution.
function buildArgs(name, dir, langConfig) {
  return [
    'run', '--rm', '--name', name,
    '--network', 'none',
    '--pids-limit', '64',
    '--cap-drop', 'ALL',
    '--security-opt', 'no-new-privileges',
    '-v', `${dir}:/sandbox:ro`, '-w', '/sandbox',
    langConfig.image, ...langConfig.command,
  ];
}

// Write the submitted code into a fresh temporary workspace directory.
async function prepareWorkspace(code, filename) {
  const dir = await mkdtemp(join(tmpdir(), 'sandbox-'));
  await writeFile(join(dir, filename), code);
  return dir;
}

// Force-remove a container that may still run after a timeout.
function forceRemove(name) {
  spawn('docker', ['rm', '-f', name]).on('error', () => {});
}

// Append captured output while keeping it under the maximum size.
function append(buffer, chunk) {
  return buffer.length < MAX_OUTPUT ? buffer + chunk : buffer;
}

// Spawn a docker process, capturing output and enforcing a hard timeout.
function spawnContainer(args, name, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn('docker', args);
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
      forceRemove(name);
    }, timeoutMs);
    child.stdout.on('data', (d) => { stdout = append(stdout, d.toString()); });
    child.stderr.on('data', (d) => { stderr = append(stderr, d.toString()); });
    child.on('error', (e) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: e.message, exitCode: 1, timedOut });
    });
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode, timedOut });
    });
  });
}

// Run submitted code inside an ephemeral, network-isolated container.
export async function runContainer(langConfig, code, timeoutMs) {
  const name = `exec-${nanoid(8)}`;
  const dir = await prepareWorkspace(code, langConfig.filename);
  try {
    return await spawnContainer(buildArgs(name, dir, langConfig), name, timeoutMs);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
