export const Card = ({ children, className = '', hover, dark, ...props }) => (
  <div
    className={`
      ${dark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'} rounded-2xl border shadow-sm
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

export const CardTitle = ({ children, className = '', as: Component = 'h3', dark, ...props }) => (
  <Component className={`text-lg font-semibold ${dark ? 'text-white' : 'text-surface-900'} ${className}`} {...props}>
    {children}
  </Component>
);

export const CardBody = ({ children, className = '', dark, ...props }) => (
  <div className={`px-6 py-4 text-sm ${dark ? 'text-surface-300' : 'text-surface-600'} ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', dark, ...props }) => (
  <div className={`px-6 py-4 flex items-center gap-2 border-t ${dark ? 'border-surface-800' : 'border-surface-100'} ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
