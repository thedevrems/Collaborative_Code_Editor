const SUPPORTED_LANGUAGES = ['javascript', 'python'];
const DEFAULT_LANGUAGE = 'javascript';

// Normalize a requested language to a supported value.
export function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
}

// Build a fresh room entity with default metadata.
export function createRoomEntity(id, language) {
  const now = new Date().toISOString();
  return {
    id,
    language: normalizeLanguage(language),
    createdAt: now,
    updatedAt: now,
  };
}

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
