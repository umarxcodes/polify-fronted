import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  suggestions,
  onSelectSuggestion,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className={`relative ${className}`} {...props}>
      <div
        className={`
          flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl
          border transition-all duration-200
          ${isFocused
            ? 'border-brand-500 shadow-lg shadow-brand-500/10'
            : 'border-surface-200 shadow-sm'
          }
        `}
      >
        <Search size={18} className={`transition-colors duration-200 ${isFocused ? 'text-brand-500' : 'text-surface-400'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
          onBlur={() => { setIsFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-surface-900 placeholder:text-surface-400 outline-none"
          {...props}
        />
        {value && (
          <button
            onClick={() => onChange?.('')}
            className="p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-mono text-surface-400 bg-surface-100 rounded-md">
          ⌘K
        </kbd>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-surface-200 overflow-hidden z-50"
          >
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelectSuggestion?.(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                >
                  <Search size={16} className="text-surface-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;
