import { LANGUAGES } from '../lib/constants.js';

// Dropdown letting the user switch the editor language.
export default function LanguageSelector({ value, onChange }) {
  return (
    <select
      className="language-selector"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {LANGUAGES.map((language) => (
        <option key={language.id} value={language.id}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
