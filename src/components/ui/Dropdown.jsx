import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { resolveIcon } from './iconUtils'

export const Dropdown = ({
  trigger,
  items,
  align = 'left',
  width = 'auto',
  dark,
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
              absolute z-50 mt-2 rounded-xl shadow-xl border overflow-hidden
              ${align === 'right' ? 'right-0' : 'left-0'}
              ${width !== 'auto' ? `w-${width}` : 'min-w-[200px]'}
              ${dark ? 'bg-surface-900 border-surface-700' : 'bg-white border-surface-200'}
            `}
          >
            <div className={`py-1 ${dark ? 'divide-y divide-surface-800' : ''}`}>
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
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : (dark ? 'hover:bg-surface-800' : 'hover:bg-surface-50')}
                    ${item.danger ? 'text-danger-500 hover:bg-danger-500/10' : (dark ? 'text-surface-300' : 'text-surface-700')}
                  `}
                >
                  {item.icon && (
                    <span className={dark ? 'text-surface-500' : 'text-surface-400'}>
                      {resolveIcon(item.icon, 16)}
                    </span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.check && <Check size={16} className="text-primary-500" />}
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
