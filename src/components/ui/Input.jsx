import { motion } from 'framer-motion'
import { resolveIcon } from './iconUtils'

export const Input = ({
  error,
  label,
  icon: Icon,
  className = '',
  dark,
  ...props
}) => {
  const iconElement = resolveIcon(Icon, 18)

  return (
    <div className={`${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-1.5 ${dark ? 'text-surface-300' : 'text-surface-700'}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {iconElement && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-surface-500' : 'text-surface-400'}`}
          >
            {iconElement}
          </div>
        )}
        <input
          className={`
          input w-full px-4 py-2.5 text-sm
          ${iconElement ? 'pl-10' : ''}
          ${
            dark
              ? 'bg-surface-800 border-surface-700 text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              : 'border-surface-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
          }
          ${error ? 'input-error border-danger-500' : ''}
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
