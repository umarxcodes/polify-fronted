import { isValidElement } from 'react'
import { motion } from 'framer-motion'

const resolveIcon = (icon, size = 18) => {
  if (!icon) return null
  if (isValidElement(icon)) return icon
  if (
    typeof icon === 'function' ||
    (typeof icon === 'object' && icon && typeof icon.render === 'function')
  ) {
    const Component = icon
    return <Component size={size} />
  }
  return null
}

export const Input = ({
  error,
  label,
  icon: Icon,
  className = '',
  ...props
}) => {
  const iconElement = resolveIcon(Icon, 18)

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {iconElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            {iconElement}
          </div>
        )}
        <input
          className={`
          input w-full px-4 py-2.5 text-sm
          ${iconElement ? 'pl-10' : ''}
          ${error ? 'input-error border-danger-500' : 'border-surface-300'}
          focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
          transition-all duration-200
        `}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-danger-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input
