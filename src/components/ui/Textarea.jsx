

export const Textarea = ({ error, className = '', dark, ...props }) => (
  <textarea
    className={`input ${error ? 'input-error' : ''} ${dark ? 'input-dark' : ''} ${className}`}
    {...props}
  />
);

export default Textarea;
