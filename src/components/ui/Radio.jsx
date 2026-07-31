

export const Radio = ({ checked, onChange, label, name, className = '', ...props }) => (
  <label className={`inline-flex items-center gap-2 text-sm text-surface-700 ${className}`}>
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 border-surface-300 text-brand-500 focus:ring-brand-500"
      {...props}
    />
    {label && <span>{label}</span>}
  </label>
);

export default Radio;
