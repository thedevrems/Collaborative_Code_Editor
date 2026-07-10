import { useEffect, useState } from 'react';
import { DEFAULT_LANGUAGE } from '../lib/constants.js';

// Track and update the room language stored in the shared Yjs metadata map.
export function useSharedLanguage(connection) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    if (!connection) {
      return undefined;
    }
    const meta = connection.doc.getMap('meta');
    const sync = () => setLanguage(meta.get('language') ?? DEFAULT_LANGUAGE);
    sync();
    meta.observe(sync);
    return () => meta.unobserve(sync);
  }, [connection]);

  // Write a new language into the shared metadata map.
  function changeLanguage(next) {
    connection?.doc.getMap('meta').set('language', next);
  }

  return { language, changeLanguage };
}
