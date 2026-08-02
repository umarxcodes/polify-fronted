export const Select = ({ children, error, className = '', dark, ...props }) => (
  <select
    className={`input w-full px-4 py-2.5 text-sm appearance-none ${error ? 'input-error' : ''} ${dark ? 'input-dark' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default Select;
