const variants = {
  primary: 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:from-brand-600 hover:to-brand-700',
  secondary: 'bg-white text-surface-700 border border-surface-200 shadow-sm hover:shadow-md hover:border-surface-300 hover:bg-surface-50',
  ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100',
  danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg shadow-danger-500/25 hover:shadow-xl hover:shadow-danger-500/30',
  outline: 'bg-transparent text-brand-600 border-2 border-brand-500 hover:bg-brand-50',
  subtle: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-lg',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        btn btn-${variant} inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
