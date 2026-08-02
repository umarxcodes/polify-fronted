import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { searchService } from "../../services/searchService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { SearchHistory } from "./SearchHistory";

const TRENDING = [
  "Remote work productivity",
  "AI tools for developers",
  "Design systems 2024",
  "Leadership qualities",
  "Best programming languages",
];

export const SearchCommandPalette = ({ isOpen, onClose, onSearch, dark = false }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSuggestions([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchService.getSuggestions(searchQuery);
      const data = res?.data || [];
      const flat = [
        ...(data.polls || []).map(p => ({ type: "poll", text: p.title })),
        ...(data.users || []).map(u => ({ type: "user", text: u.name || u.username })),
        ...(data.categories || []).map(c => ({ type: "category", text: c })),
      ];
      setSuggestions(flat.slice(0, 8));
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose?.();
    if (e.key === "Enter") {
      if (query.trim()) {
        onSearch?.(query.trim());
        onClose?.();
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearch?.(suggestion.text);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card dark={dark} className="overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search size={20} className={dark ? "text-surface-400" : "text-surface-400"} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search polls, users, categories..."
                  className={`
                    flex-1 bg-transparent text-base outline-none
                    ${dark ? "text-white placeholder:text-surface-500" : "text-surface-900 placeholder:text-surface-400"}
                  `}
                />
                {query && (
                  <button
                    onClick={() => { setQuery(""); setSuggestions([]); }}
                    className={`
                      p-1.5 rounded-lg transition-colors
                      ${dark ? "text-surface-400 hover:text-white hover:bg-surface-800" : "text-surface-400 hover:text-surface-600 hover:bg-surface-100"}
                    `}
                  >
                    <X size={16} />
                  </button>
                )}
                <kbd className={`
                  px-2 py-1 text-[10px] font-mono rounded-md
                  ${dark ? "text-surface-500 bg-surface-800" : "text-surface-400 bg-surface-100"}
                `}>
                  ESC
                </kbd>
              </div>

              <div className={`border-t ${dark ? "border-surface-800" : "border-surface-200"}`}>
                {loading && (
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      <span className={`text-sm ${dark ? "text-surface-400" : "text-surface-500"}`}>Searching...</span>
                    </div>
                  </div>
                )}

                {!loading && suggestions.length > 0 && (
                  <div className="py-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.text}-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`
                          w-full flex items-center justify-between px-4 py-2.5 text-left
                          transition-colors duration-150
                          ${dark ? "hover:bg-surface-800 text-surface-300" : "hover:bg-surface-50 text-surface-700"}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Search size={16} className={dark ? "text-surface-500" : "text-surface-400"} />
                          <span className="text-sm">{suggestion.text}</span>
                        </div>
                        <Badge variant="secondary" size="sm" dark={dark}>
                          {suggestion.type}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {!loading && !suggestions.length && query.length >= 2 && (
                  <div className={`px-4 py-6 text-center ${dark ? "text-surface-500" : "text-surface-400"}`}>
                    <Search size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No suggestions found</p>
                  </div>
                )}

                {!query && (
                  <div className="py-3">
                    <div className={`px-4 py-2 flex items-center gap-2 ${dark ? "text-surface-500" : "text-surface-400"}`}>
                      <Clock size={14} />
                      <span className="text-xs font-semibold uppercase tracking-wider">Recent</span>
                    </div>
                    <SearchHistory onSelect={handleSuggestionClick} dark={dark} />
                  </div>
                )}

                {!query && (
                  <div className={`py-3 border-t ${dark ? "border-surface-800" : "border-surface-200"}`}>
                    <div className={`px-4 py-2 flex items-center gap-2 ${dark ? "text-surface-500" : "text-surface-400"}`}>
                      <TrendingUp size={14} />
                      <span className="text-xs font-semibold uppercase tracking-wider">Trending</span>
                    </div>
                    <div className="px-2">
                      {TRENDING.map((term, index) => (
                        <button
                          key={term}
                          onClick={() => handleSuggestionClick({ text: term, type: "trending" })}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-lg text-left
                            transition-colors duration-150
                            ${dark ? "hover:bg-surface-800 text-surface-300" : "hover:bg-surface-50 text-surface-700"}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium w-5 ${dark ? "text-surface-500" : "text-surface-400"}`}>
                              {index + 1}
                            </span>
                            <span className="text-sm">{term}</span>
                          </div>
                          <ArrowRight size={14} className={dark ? "text-surface-500" : "text-surface-400"} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
