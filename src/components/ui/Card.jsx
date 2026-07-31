export const Card = ({ children, className = '', hover, ...props }) => (
  <div
    className={`
      bg-white rounded-2xl border border-surface-200 shadow-sm
      transition-all duration-300 ease-out
      ${hover ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component className={`text-lg font-semibold text-surface-900 ${className}`} {...props}>
    {children}
  </Component>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 text-sm text-surface-600 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 flex items-center gap-2 border-t border-surface-100 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
