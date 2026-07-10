const STORAGE_KEY = 'editor.user';
const COLORS = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231',
  '#911eb4', '#42d4f4', '#f032e6', '#bfef45',
];

// Build a random local user identity.
function createUser() {
  const id = Math.random().toString(36).slice(2, 10);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { id, name: `guest-${id.slice(0, 4)}`, color };
}

// Load the persisted local user or create and store a new one.
export function getLocalUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  const user = createUser();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

// Update the persisted local user's display name.
export function setLocalUserName(name) {
  const user = { ...getLocalUser(), name: name.slice(0, 32) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}
