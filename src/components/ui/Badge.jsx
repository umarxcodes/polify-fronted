const variants = {
  primary: 'bg-brand-50 text-brand-700 border-brand-200',
  secondary: 'bg-surface-100 text-surface-600 border-surface-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  danger: 'bg-danger-50 text-danger-700 border-danger-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = ({ children, variant = 'primary', size = 'md', dot, className = '' }) => (
  <span
    className={`
      badge badge-${variant} inline-flex items-center gap-1.5 font-medium rounded-full border
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}
  >
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full ${
        variant === 'success' ? 'bg-success-500' :
        variant === 'danger' ? 'bg-danger-500' :
        variant === 'warning' ? 'bg-warning-500' :
        'bg-brand-500'
      }`} />
    )}
    {children}
  </span>
);

export default Badge;
