

export const Textarea = ({ error, className = '', ...props }) => (
  <textarea
    className={`input ${error ? 'input-error' : ''} ${className}`}
    {...props}
  />
);

export default Textarea;
