const variants = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  success: 'badge-success',
  danger: 'badge-danger',
  warning: 'badge-warning',
  info: 'badge-info',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export const Badge = ({ children, variant = 'primary', size = 'md', dot, className = '' }) => (
  <span
    className={`
      badge ${variants[variant] || 'badge-primary'} ${sizes[size] || 'badge-md'}
      inline-flex items-center gap-1.5 font-medium rounded-full border
      ${className}
    `}
  >
    {dot && (
      <span className={`w-1.5 h-1.5 rounded-full ${
        variant === 'success' ? 'bg-success-500' :
        variant === 'danger' ? 'bg-danger-500' :
        variant === 'warning' ? 'bg-warning-500' :
        'bg-primary-500'
      }`} />
    )}
    {children}
  </span>
);

export default Badge;
