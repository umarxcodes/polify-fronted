import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

const REASON_OPTIONS = [
  { value: "", label: "All Reasons" },
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "hate_speech", label: "Hate Speech" },
  { value: "misinformation", label: "Misinformation" },
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "copyright", label: "Copyright" },
  { value: "fake_account", label: "Fake Account" },
  { value: "scam", label: "Scam" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export function ReportFilters({ filters, onChange, dark = true }) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
          transition-colors relative
          ${dark
            ? "bg-surface-800 border border-surface-700 text-white hover:border-surface-600"
            : "bg-white border border-surface-200 text-surface-900 hover:border-surface-300"
          }
        `}
      >
        <Filter size={16} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className={`
            absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center
            ${dark ? "bg-primary-500 text-white" : "bg-primary-500 text-white"}
          `}>
            {activeFilterCount}
          </span>
        )}
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
                absolute top-full mt-2 right-0 z-50 p-4 rounded-xl shadow-xl
                ${dark ? "bg-surface-800 border border-surface-700" : "bg-white border border-surface-200"}
              `}
              style={{ minWidth: 280 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">Filters</h4>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Status</label>
                  <select
                    value={filters.status || ""}
                    onChange={(e) => updateFilter("status", e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${dark ? "bg-surface-700 border border-surface-600 text-white" : "bg-surface-50 border border-surface-200 text-surface-900"}
                    `}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Reason</label>
                  <select
                    value={filters.reason || ""}
                    onChange={(e) => updateFilter("reason", e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${dark ? "bg-surface-700 border border-surface-600 text-white" : "bg-surface-50 border border-surface-200 text-surface-900"}
                    `}
                  >
                    {REASON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Priority</label>
                  <select
                    value={filters.priority || ""}
                    onChange={(e) => updateFilter("priority", e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${dark ? "bg-surface-700 border border-surface-600 text-white" : "bg-surface-50 border border-surface-200 text-surface-900"}
                    `}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Escalated</label>
                  <select
                    value={filters.escalated || ""}
                    onChange={(e) => updateFilter("escalated", e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      ${dark ? "bg-surface-700 border border-surface-600 text-white" : "bg-surface-50 border border-surface-200 text-surface-900"}
                    `}
                  >
                    <option value="">All</option>
                    <option value="true">Escalated</option>
                    <option value="false">Not Escalated</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
