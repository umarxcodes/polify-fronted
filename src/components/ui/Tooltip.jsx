import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);

  const positions = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-surface-900
              rounded-lg shadow-lg whitespace-nowrap pointer-events-none
            `}
            style={positions[position]}
          >
            {content}
            <div className={`
              absolute w-2 h-2 bg-surface-900 rotate-45
              ${position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' : ''}
              ${position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' : ''}
              ${position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' : ''}
            `} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
