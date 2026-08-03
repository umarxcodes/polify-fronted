import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most_voted", label: "Most Voted" },
  { value: "most_commented", label: "Most Commented" },
  { value: "trending", label: "Trending" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const TYPE_OPTIONS = [
  { value: "single", label: "Single Choice" },
  { value: "multiple", label: "Multiple Choice" },
  { value: "anonymous", label: "Anonymous" },
];

export const SearchFilters = ({
  filters,
  onFilterChange,
  onClear,
  resultCount,
  dark = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "q" || key === "page" || key === "limit" || key === "sort") return false;
    return value && value !== "" && value !== "all";
  }).length;

  const handleSortChange = useCallback((sort) => {
    onFilterChange({ ...filters, sort, page: 1 });
  }, [filters, onFilterChange]);

  const handleFilterToggle = useCallback((key, value) => {
    const current = filters[key];
    if (current === value) {
      const next = { ...filters };
      delete next[key];
      onFilterChange(next);
    } else {
      onFilterChange({ ...filters, [key]: value, page: 1 });
    }
  }, [filters, onFilterChange]);

  const handleClearAll = useCallback(() => {
    onClear?.();
  }, [onClear]);

  return (
    <Card dark={dark} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className={dark ? "text-surface-400" : "text-surface-500"} />
          <span className={`text-sm font-semibold ${dark ? "text-white" : "text-surface-900"}`}>
            Filters
          </span>
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm">{activeFilterCount}</Badge>
          )}
          <span className={`text-sm ${dark ? "text-surface-400" : "text-surface-500"}`}>
            {resultCount !== undefined ? `${resultCount} result${resultCount !== 1 ? 's' : ''}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className={`text-xs font-medium ${dark ? "text-surface-400 hover:text-white" : "text-surface-500 hover:text-surface-700"} transition-colors`}
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg transition-colors ${dark ? "text-surface-400 hover:text-white hover:bg-surface-800" : "text-surface-500 hover:text-surface-700 hover:bg-surface-100"}`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-medium ${dark ? "text-surface-500" : "text-surface-400"}`}>Sort:</span>
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${filters.sort === option.value
                ? "bg-primary-500 text-white shadow-sm shadow-primary-500/25"
                : dark
                  ? "bg-surface-800 text-surface-300 hover:bg-surface-700"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`pt-4 mt-4 border-t ${dark ? "border-surface-800" : "border-surface-200"}`}>
              <div className="mb-4">
                <span className={`text-xs font-medium ${dark ? "text-surface-500" : "text-surface-400"} block mb-2`}>Status</span>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterToggle("status", option.value)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                        ${filters.status === option.value
                          ? "bg-primary-500 text-white shadow-sm shadow-primary-500/25"
                          : dark
                            ? "bg-surface-800 text-surface-300 hover:bg-surface-700"
                            : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={`text-xs font-medium ${dark ? "text-surface-500" : "text-surface-400"} block mb-2`}>Type</span>
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterToggle("type", option.value)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                        ${filters.type === option.value
                          ? "bg-primary-500 text-white shadow-sm shadow-primary-500/25"
                          : dark
                            ? "bg-surface-800 text-surface-300 hover:bg-surface-700"
                            : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
