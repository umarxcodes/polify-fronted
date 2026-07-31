

export const Switch = ({ checked, onChange, label, className = '', ...props }) => (
  <label className={`inline-flex items-center gap-2 text-sm text-surface-700 ${className}`}>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-brand-500' : 'bg-surface-300'}`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
    {label && <span>{label}</span>}
  </label>
);

export default Switch;
