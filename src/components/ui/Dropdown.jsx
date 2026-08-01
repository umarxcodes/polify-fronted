import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { resolveIcon } from './iconUtils'

export const Dropdown = ({
  trigger,
  items,
  align = 'left',
  width = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`
              absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-surface-200
              overflow-hidden
              ${align === 'right' ? 'right-0' : 'left-0'}
              ${width !== 'auto' ? `w-${width}` : 'min-w-[200px]'}
            `}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-2 px-4 py-2.5 text-sm
                    transition-colors duration-150
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-50'}
                    ${item.danger ? 'text-danger-600 hover:bg-danger-50' : 'text-surface-700'}
                  `}
                >
                  {item.icon && (
                    <span className="text-surface-400">
                      {resolveIcon(item.icon, 16)}
                    </span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.check && <Check size={16} className="text-brand-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown
