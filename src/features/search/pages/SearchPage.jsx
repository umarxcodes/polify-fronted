import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Search, X, Clock, TrendingUp, ArrowRight, Vote, Eye } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { SearchFilters } from "../components/SearchFilters";
import { toast } from "sonner";

const TABS = [
  { id: "all", label: "All Results" },
  { id: "polls", label: "Polls" },
  { id: "users", label: "Users" },
  { id: "categories", label: "Categories" },
];

const TRENDING = [
  "Remote work productivity",
  "AI tools for developers",
  "Design systems 2024",
  "Leadership qualities",
  "Best programming languages",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("pollify_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filters, setFilters] = useState({ sort: "newest" });
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const saveRecentSearch = useCallback((searchQuery) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== searchQuery.toLowerCase());
      const updated = [searchQuery, ...filtered].slice(0, 10);
      localStorage.setItem("pollify_recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      toast.error("Please enter at least 2 characters");
      return;
    }

    setLoading(true);
    setError(null);
    saveRecentSearch(searchQuery);

    try {
      const params = {
        q: searchQuery,
        limit: 20,
        sort: filters.sort || "newest",
        ...Object.fromEntries(
          Object.entries(filters).filter(([k, v]) => k !== "sort" && k !== "q" && v)
        ),
      };

      const [pollsRes, usersRes, categoriesRes] = await Promise.all([
        apiClient.get("/search/polls", { params }),
        apiClient.get("/search/users", { params: { q: searchQuery, limit: 20 } }),
        apiClient.get("/search/categories", { params: { q: searchQuery, limit: 20 } }),
      ]);

      setResults({
        polls: pollsRes.data?.data?.polls || [],
        pollsPagination: pollsRes.data?.data?.pagination || {},
        users: usersRes.data?.data?.users || [],
        usersPagination: usersRes.data?.data?.pagination || {},
        categories: categoriesRes.data?.data?.categories || [],
      });
      setActiveTab("all");
    } catch (err) {
      const message = err.message || "Search failed. Please try again.";
      setError(message);
      toast.error("Search failed", { description: message });
    } finally {
      setLoading(false);
    }
  }, [filters, saveRecentSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => performSearch(value), 400);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      performSearch(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("pollify_recent_searches");
  };

  const handleRetry = () => {
    if (query.trim()) performSearch(query);
  };

  const visibleResults = (() => {
    if (!results) return [];
    if (activeTab === "all") {
      return [
        ...(results.polls || []).map(item => ({ ...item, _type: "poll" })),
        ...(results.users || []).map(item => ({ ...item, _type: "user" })),
        ...(results.categories || []).map(item => ({ ...item, _type: "category" })),
      ];
    }
    if (activeTab === "polls") return (results.polls || []).map(item => ({ ...item, _type: "poll" }));
    if (activeTab === "users") return (results.users || []).map(item => ({ ...item, _type: "user" }));
    if (activeTab === "categories") return (results.categories || []).map(item => ({ ...item, _type: "category" }));
    return [];
  })();

  const hasResults = results && (results.polls?.length || results.users?.length || results.categories?.length);
  const hasNoResults = results && !loading && !hasResults;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Search</h1>
        <p className="text-surface-400 mt-2">Find polls, people, and topics.</p>
      </div>

      <Card dark className="p-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search size={20} className="text-surface-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search polls, people, or topics..."
              className="flex-1 py-3 bg-transparent text-sm text-white placeholder:text-surface-500 outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults(null); setError(null); }}
                className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <Button onClick={() => performSearch(query)} loading={loading} size="sm">
            Search
          </Button>
        </div>
      </Card>

      {!results && !loading && !error && (
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <Card dark className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock size={16} className="text-surface-400" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-surface-400 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => { setQuery(search); performSearch(search); }}
                    className="px-3 py-1.5 rounded-lg bg-surface-800 text-sm text-surface-300 hover:bg-surface-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card dark className="p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary-400" />
              Trending Searches
            </h3>
            <div className="space-y-2">
              {TRENDING.map((search, index) => (
                <button
                  key={index}
                  onClick={() => { setQuery(search); performSearch(search); }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-surface-500 w-6">{index + 1}</span>
                    <span className="text-sm text-surface-300 group-hover:text-white">{search}</span>
                  </div>
                  <ArrowRight size={16} className="text-surface-500 group-hover:text-surface-300 transition-colors" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={handleRetry}
          dark
        />
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} dark className="p-6">
              <Skeleton dark className="h-6 w-3/4 mb-2" />
              <Skeleton dark className="h-4 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton dark className="h-12 w-full rounded-xl" />
                <Skeleton dark className="h-12 w-full rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && hasResults && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? "bg-primary-500 text-white shadow-sm shadow-primary-500/25"
                    : "bg-surface-800 text-surface-300 hover:bg-surface-700"
                  }
                `}
              >
                {tab.label}
                {tab.id !== "all" && results[tab.id + "Pagination"]?.total > 0 && (
                  <span className="ml-1.5 text-xs opacity-75">
                    ({results[tab.id + "Pagination"].total})
                  </span>
                )}
              </button>
            ))}
          </div>

          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            onClear={() => setFilters({ sort: "newest" })}
            resultCount={visibleResults.length}
            dark
          />

          <div className="space-y-3">
            {visibleResults.map((item, index) => {
              if (item._type === "poll") {
                return (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card hover dark className="p-5 cursor-pointer" onClick={() => navigate(`/polls/${item._id}`)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" size="sm" dark>
                              {item.category || "General"}
                            </Badge>
                            {item.isActive !== false && (
                              <Badge variant="success" size="sm" dot dark>
                                Active
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-base font-semibold text-white mb-1 truncate">
                            {item.title || "Untitled poll"}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-surface-400 line-clamp-2 mb-3">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-xs text-surface-400">
                              <Vote size={14} />
                              {item.totalVotes?.toLocaleString() || 0} votes
                            </span>
                            <span className="flex items-center gap-1 text-xs text-surface-400">
                              <Eye size={14} />
                              {item.views?.toLocaleString() || 0} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              }

              if (item._type === "user") {
                return (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card hover dark className="p-4 cursor-pointer" onClick={() => navigate(`/profile/${item.username}`)}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {item.name?.split(" ").map(n => n[0]).join("") || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                          <p className="text-xs text-surface-400">@{item.username}</p>
                          {item.bio && (
                            <p className="text-xs text-surface-500 mt-1 line-clamp-1">{item.bio}</p>
                          )}
                        </div>
                        <Badge variant="secondary" size="sm" dark>
                          {item.stats?.polls || 0} polls
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                );
              }

              if (item._type === "category") {
                return (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/search?category=${encodeURIComponent(item._id || item.name || item)}`}>
                      <Card hover dark className="p-4 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-white">
                              {item._id || item.name || item}
                            </h4>
                            <p className="text-xs text-surface-400 mt-0.5">
                              {item.count || 0} polls · {(item.totalVotes || 0).toLocaleString()} votes
                            </p>
                          </div>
                          <Badge variant="primary" size="sm" dark>
                            {item.count || 0}
                          </Badge>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {hasNoResults && (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`No results for "${query}". Try another keyword or check your filters.`}
          action={
            <Button variant="secondary" size="sm" onClick={() => { setQuery(""); setResults(null); }}>
              Clear search
            </Button>
          }
          dark
        />
      )}
    </motion.div>
  );
}
