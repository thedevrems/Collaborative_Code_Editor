// Patterns applied to every language before a container is started.
const COMMON_RULES = [
  { name: 'infinite_loop', pattern: /while\s*\(\s*true\s*\)|for\s*\(\s*;;\s*\)/ },
  { name: 'fork_bomb', pattern: /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:/ },
  { name: 'dynamic_eval', pattern: /\beval\s*\(/ },
];

const JS_RULES = [
  { name: 'child_process', pattern: /child_process/ },
  { name: 'filesystem_access', pattern: /require\(\s*['"]fs['"]\s*\)|from\s+['"]fs['"]/ },
  { name: 'process_control', pattern: /process\.(exit|kill|binding)/ },
  { name: 'network_module', pattern: /require\(\s*['"](net|http|https|dgram)['"]\s*\)/ },
];

const PYTHON_RULES = [
  { name: 'os_system', pattern: /os\.system|os\.popen/ },
  { name: 'subprocess', pattern: /import\s+subprocess|subprocess\./ },
  { name: 'socket_module', pattern: /import\s+socket|socket\./ },
  { name: 'dynamic_import', pattern: /__import__\s*\(/ },
];

const LUA_RULES = [
  { name: 'os_execute', pattern: /os\.(execute|exit)|io\.popen/ },
  { name: 'dynamic_load', pattern: /\b(loadstring|load)\s*\(/ },
  { name: 'require_io', pattern: /require\s*\(?\s*['"](socket|os|io)['"]/ },
];

const GO_RULES = [
  { name: 'os_exec', pattern: /os\/exec/ },
  { name: 'network_package', pattern: /["']net["']|["']net\/http["']/ },
  { name: 'syscall', pattern: /["']syscall["']|["']unsafe["']/ },
  { name: 'process_control', pattern: /os\.Exit|syscall\./ },
];

const CPP_RULES = [
  { name: 'system_call', pattern: /\bsystem\s*\(/ },
  { name: 'process_spawn', pattern: /\b(fork|execv?e?|popen)\s*\(/ },
  { name: 'network_header', pattern: /#include\s*<\s*(sys\/socket|netinet|arpa)/ },
];

// Java and Kotlin share the JVM attack surface.
const JVM_RULES = [
  { name: 'runtime_exec', pattern: /Runtime\.getRuntime|ProcessBuilder/ },
  { name: 'process_control', pattern: /System\.exit/ },
  { name: 'network_api', pattern: /java\.net|import\s+java\.net/ },
  { name: 'reflection', pattern: /Class\.forName|\.loadClass\s*\(/ },
];

const CSHARP_RULES = [
  { name: 'process_start', pattern: /System\.Diagnostics\.Process|Process\.Start/ },
  { name: 'process_control', pattern: /Environment\.Exit/ },
  { name: 'network_api', pattern: /System\.Net|WebClient|HttpClient/ },
  { name: 'unmanaged_code', pattern: /\bunsafe\b|DllImport/ },
];

const RULES_BY_LANGUAGE = {
  javascript: JS_RULES,
  typescript: JS_RULES,
  python: PYTHON_RULES,
  lua: LUA_RULES,
  go: GO_RULES,
  cpp: CPP_RULES,
  java: JVM_RULES,
  kotlin: JVM_RULES,
  csharp: CSHARP_RULES,
};

// Select the rule set that applies to a given language.
function rulesFor(language) {
  return [...COMMON_RULES, ...(RULES_BY_LANGUAGE[language] ?? [])];
}

// Return the names of every forbidden pattern found in the code.
export function detectThreats(language, code) {
  return rulesFor(language)
    .filter((rule) => rule.pattern.test(code))
    .map((rule) => rule.name);
}
