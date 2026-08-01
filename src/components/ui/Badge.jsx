const variants = {
  primary: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  secondary: 'bg-surface-800 text-surface-300 border-surface-700',
  success: 'bg-success-500/15 text-success-400 border-success-500/20',
  danger: 'bg-danger-500/15 text-danger-400 border-danger-500/20',
  warning: 'bg-warning-500/15 text-warning-400 border-warning-500/20',
  info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
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
