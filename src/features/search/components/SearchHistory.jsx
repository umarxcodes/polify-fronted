import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Clock } from "lucide-react";
import { searchService } from "../../services/searchService";
import { Skeleton } from "../../../components/ui/Skeleton";
import { toast } from "sonner";

const STORAGE_KEY = "pollify_search_history";

export const SearchHistory = ({ onSelect, onClose, dark = false }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendHistory, setBackendHistory] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      const localHistory = local ? JSON.parse(local) : [];
      setHistory(localHistory);

      const token = localStorage.getItem("pollify_access_token");
      if (token) {
        const res = await searchService.getSearchHistory({ limit: 20 });
        const backend = res?.data?.history || [];
        setBackendHistory(backend);
      }
    } catch {
      // ignore backend error, use local history
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem("pollify_access_token");
      if (token) {
        await searchService.deleteSearchHistory();
      }
    } catch {
      // ignore
    }
    setHistory([]);
    setBackendHistory(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Search history cleared");
  };

  const handleSelect = (query) => {
    onSelect?.(query);
    onClose?.();
  };

  const allHistory = backendHistory?.length
    ? backendHistory.map(h => h.query).filter(Boolean)
    : history;

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} dark={dark} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!allHistory?.length) {
    return (
      <div className={`text-center py-8 ${dark ? "text-surface-400" : "text-surface-500"}`}>
        <Clock size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No search history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {allHistory.slice(0, 10).map((query, index) => (
        <motion.button
          key={`${query}-${index}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          onClick={() => handleSelect(query)}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left
            transition-colors duration-150 group
            ${dark
              ? "hover:bg-surface-800 text-surface-300"
              : "hover:bg-surface-50 text-surface-700"
            }
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Clock size={14} className={dark ? "text-surface-500" : "text-surface-400"} />
            <span className="text-sm truncate">{query}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHistory(prev => {
                const next = prev.filter((_, i) => i !== index);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                return next;
              });
            }}
            className={`
              p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity
              ${dark ? "text-surface-500 hover:text-surface-300" : "text-surface-400 hover:text-surface-600"}
            `}
          >
            <X size={14} />
          </button>
        </motion.button>
      ))}
      {allHistory.length > 0 && (
        <button
          onClick={handleClearAll}
          className={`
            w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
            transition-colors duration-150 mt-2
            ${dark
              ? "text-danger-400 hover:bg-danger-500/10"
              : "text-danger-600 hover:bg-danger-50"
            }
          `}
        >
          <Trash2 size={14} />
          Clear all history
        </button>
      )}
    </div>
  );
};
