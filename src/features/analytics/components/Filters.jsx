import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter } from "lucide-react";

const DATE_PRESETS = [
  { id: "today", label: "Today", days: 1 },
  { id: "7d", label: "Last 7 Days", days: 7 },
  { id: "30d", label: "Last 30 Days", days: 30 },
  { id: "90d", label: "Last 90 Days", days: 90 },
  { id: "year", label: "This Year", days: 365 },
  { id: "all", label: "All Time", days: null },
];

export function DateFilter({ value, onChange, dark = true }) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = (preset) => {
    if (preset.days === null) {
      onChange({ startDate: null, endDate: null, preset: preset.id });
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - preset.days);
      onChange({ startDate, endDate, preset: preset.id });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
          transition-colors
          ${dark
            ? "bg-surface-800 border border-surface-700 text-white hover:border-surface-600"
            : "bg-white border border-surface-200 text-surface-900 hover:border-surface-300"
          }
        `}
      >
        <Calendar size={16} />
        <span>
          {value?.preset
            ? DATE_PRESETS.find((p) => p.id === value.preset)?.label || "Custom"
            : "Date Range"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`
                absolute top-full mt-2 right-0 z-50 p-2 rounded-xl shadow-xl
                ${dark ? "bg-surface-800 border border-surface-700" : "bg-white border border-surface-200"}
              `}
              style={{ minWidth: 200 }}
            >
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm
                    transition-colors
                    ${value?.preset === preset.id
                      ? "bg-primary-500/15 text-primary-400"
                      : dark
                        ? "text-surface-300 hover:bg-surface-700"
                        : "text-surface-600 hover:bg-surface-100"
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterDropdown({ label, options, value, onChange, dark = true }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
          transition-colors
          ${dark
            ? "bg-surface-800 border border-surface-700 text-white hover:border-surface-600"
            : "bg-white border border-surface-200 text-surface-900 hover:border-surface-300"
          }
        `}
      >
        <Filter size={16} />
        <span>{label}: {value || "All"}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`
                absolute top-full mt-2 right-0 z-50 p-2 rounded-xl shadow-xl
                ${dark ? "bg-surface-800 border border-surface-700" : "bg-white border border-surface-200"}
              `}
              style={{ minWidth: 160 }}
            >
              <button
                onClick={() => { onChange(null); setIsOpen(false); }}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm
                  transition-colors
                  ${!value
                    ? "bg-primary-500/15 text-primary-400"
                    : dark
                      ? "text-surface-300 hover:bg-surface-700"
                      : "text-surface-600 hover:bg-surface-100"
                  }
                `}
              >
                All
              </button>
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => { onChange(option); setIsOpen(false); }}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm
                    transition-colors
                    ${value === option
                      ? "bg-primary-500/15 text-primary-400"
                      : dark
                        ? "text-surface-300 hover:bg-surface-700"
                        : "text-surface-600 hover:bg-surface-100"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
