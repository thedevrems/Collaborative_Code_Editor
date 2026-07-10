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

// Select the rule set that applies to a given language.
function rulesFor(language) {
  const perLanguage = language === 'python' ? PYTHON_RULES : JS_RULES;
  return [...COMMON_RULES, ...perLanguage];
}

// Return the names of every forbidden pattern found in the code.
export function detectThreats(language, code) {
  return rulesFor(language)
    .filter((rule) => rule.pattern.test(code))
    .map((rule) => rule.name);
}
