

export const Select = ({ children, error, className = '', ...props }) => (
  <select
    className={`input ${error ? 'input-error' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default Select;
