import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export const Checkbox = forwardRef(({ checked, onChange, label, disabled, className = '', ...props }, ref) => (
  <label className={`
    inline-flex items-center gap-2.5 cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `}>
    <div className="relative">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <motion.div
        animate={{
          backgroundColor: checked ? 'var(--color-brand-500)' : 'white',
          borderColor: checked ? 'var(--color-brand-500)' : 'var(--color-surface-300)',
        }}
        className={`
          w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-colors duration-200
        `}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
            >
              <Check size={12} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    {label && <span className="text-sm text-surface-700 select-none">{label}</span>}
  </label>
));

export const Switch = forwardRef(({ checked, onChange, label, disabled, className = '', ...props }, ref) => (
  <label className={`
    inline-flex items-center gap-2.5 cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `}>
    <div className="relative">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <motion.div
        animate={{
          backgroundColor: checked ? 'var(--color-brand-500)' : 'var(--color-surface-300)',
        }}
        className="w-11 h-6 rounded-full relative"
      >
        <motion.div
          animate={{
            x: checked ? 20 : 2,
          }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
          className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
        />
      </motion.div>
    </div>
    {label && <span className="text-sm text-surface-700 select-none">{label}</span>}
  </label>
));

export { AnimatePresence };

export default Checkbox;
