

export const ThemeToggle = ({ checked, onChange, className = '' }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange?.(!checked)}
    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-surface-300'} ${className}`}
  >
    <span
      className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`}
    >
      {checked ? '☀️' : '🌙'}
    </span>
  </button>
);

export default ThemeToggle;
