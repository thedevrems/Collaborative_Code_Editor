// Sandbox configuration per language.
//
// Each entry defines the Docker image, the file the submitted code is written
// to, and the command that runs it. Interpreted languages run the file
// directly; compiled languages use `sh -c` to compile into a writable location
// (only /sandbox is mounted read-only, the rest of the container is writable)
// and then run the artifact.
//
// Optional per-language overrides (cpus, memory, pids, timeoutMs) widen the
// global quotas for toolchains that need more room or time to compile. The
// keys below must match the Monaco language ids used by the client so that
// syntax highlighting and execution stay in sync.
const LANGUAGES = {
  javascript: {
    image: 'node:20-alpine',
    filename: 'main.js',
    command: ['node', 'main.js'],
  },
  typescript: {
    image: 'oven/bun:alpine',
    filename: 'main.ts',
    command: ['bun', 'run', 'main.ts'],
    timeoutMs: 15000,
  },
  python: {
    image: 'python:3.12-alpine',
    filename: 'main.py',
    command: ['python', 'main.py'],
  },
  lua: {
    image: 'nickblah/lua:5.4-alpine',
    filename: 'main.lua',
    command: ['lua', 'main.lua'],
    timeoutMs: 15000,
  },
  go: {
    image: 'golang:1.23-alpine',
    filename: 'main.go',
    command: [
      'sh',
      '-c',
      'cd /tmp && GOCACHE=/tmp/.cache GOPATH=/tmp/go HOME=/tmp go run /sandbox/main.go',
    ],
    cpus: 1.0,
    memory: '512m',
    pids: 128,
    timeoutMs: 30000,
  },
  cpp: {
    image: 'gcc:14',
    filename: 'main.cpp',
    command: [
      'sh',
      '-c',
      'g++ -O2 -std=gnu++20 /sandbox/main.cpp -o /tmp/app && /tmp/app',
    ],
    cpus: 1.0,
    memory: '512m',
    pids: 128,
    timeoutMs: 30000,
  },
  java: {
    // Java requires the file name to match the public class, so the entry
    // class must be named `Main`.
    image: 'eclipse-temurin:21-jdk-alpine',
    filename: 'Main.java',
    command: ['sh', '-c', 'javac -d /tmp /sandbox/Main.java && java -cp /tmp Main'],
    cpus: 1.0,
    memory: '512m',
    pids: 256,
    timeoutMs: 30000,
  },
  kotlin: {
    // Community image (JetBrains publishes no official one). `-include-runtime`
    // bundles the Kotlin stdlib so the jar runs on a plain JVM.
    image: 'zenika/kotlin:1.9-jdk17',
    filename: 'main.kt',
    command: [
      'sh',
      '-c',
      'kotlinc /sandbox/main.kt -include-runtime -d /tmp/app.jar 2>/dev/null && java -jar /tmp/app.jar',
    ],
    cpus: 1.5,
    memory: '1g',
    pids: 512,
    timeoutMs: 90000,
  },
  csharp: {
    // Builds a throwaway console project offline from the SDK's bundled
    // packages. Top-level statements are supported, so a bare Console.WriteLine
    // works. Cold builds are slow because every run is a fresh container.
    image: 'mcr.microsoft.com/dotnet/sdk:8.0',
    filename: 'Program.cs',
    command: [
      'sh',
      '-c',
      'export HOME=/tmp DOTNET_CLI_HOME=/tmp DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1 DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1; ' +
        'mkdir -p /tmp/app && cd /tmp/app && dotnet new console -o . >/dev/null 2>&1 && ' +
        'cp /sandbox/Program.cs Program.cs && dotnet run',
    ],
    cpus: 1.5,
    memory: '1g',
    pids: 512,
    timeoutMs: 120000,
  },
};

// Return the sandbox configuration for a language, or null if unsupported.
export function getLanguageConfig(language) {
  return LANGUAGES[language] ?? null;
}

// Return the list of language ids the sandbox can execute.
export function getSupportedLanguages() {
  return Object.keys(LANGUAGES);
}
