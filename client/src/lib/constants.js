export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000';

// `id` must be a valid Monaco language id (for highlighting) and match a key
// in the server's execution config (for running). Keep the two in sync.
export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript (Node.js)' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'lua', label: 'Lua' },
  { id: 'go', label: 'Go' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'csharp', label: 'C#' },
];

export const DEFAULT_LANGUAGE = 'javascript';
