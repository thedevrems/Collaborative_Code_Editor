const LANGUAGES = {
  javascript: {
    image: 'node:20-alpine',
    filename: 'main.js',
    command: ['node', 'main.js'],
  },
  python: {
    image: 'python:3.12-alpine',
    filename: 'main.py',
    command: ['python', 'main.py'],
  },
};

// Return the sandbox configuration for a language, or null if unsupported.
export function getLanguageConfig(language) {
  return LANGUAGES[language] ?? null;
}
