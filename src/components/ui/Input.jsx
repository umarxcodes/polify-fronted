
import { motion } from 'framer-motion';

export const Input = ({ error, label, icon, className = '', ...props }) => (
  <div className={`${className}`}>
    {label && (
      <label className="block text-sm font-medium text-surface-700 mb-1.5">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
          {icon}
        </div>
      )}
      <input
        className={`
          input w-full px-4 py-2.5 text-sm
          ${icon ? 'pl-10' : ''}
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
);

export default Input;
