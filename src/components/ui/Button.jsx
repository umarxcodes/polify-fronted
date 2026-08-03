import { resolveIcon } from './iconUtils'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  success: 'btn-success',
  outline: 'btn-outline',
}

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon: Icon,
  className = '',
  ...props
}) => {
  const iconElement = resolveIcon(Icon, 16)

  return (
    <button
      disabled={disabled || loading}
      className={`
        btn ${variants[variant] || 'btn-primary'} ${sizes[size] || 'btn-md'}
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${loading ? 'btn-loading' : ''}
        ${className}
      `}
      {...props}
    >
      {!loading && iconElement && <span>{iconElement}</span>}
      {children}
    </button>
  )
}

export default Button
