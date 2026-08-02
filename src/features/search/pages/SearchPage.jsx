import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { toast } from "sonner";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("pollify_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const trendingSearches = [
    "Remote work productivity",
    "AI tools for developers",
    "Design systems 2024",
    "Leadership qualities",
    "Best programming languages",
  ];

  const saveRecentSearch = useCallback((searchQuery) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== searchQuery.toLowerCase());
      const updated = [searchQuery, ...filtered].slice(0, 10);
      localStorage.setItem("pollify_recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      toast.error("Please enter at least 2 characters");
      return;
    }

    setLoading(true);
    saveRecentSearch(searchQuery);

    try {
      const [pollsRes, usersRes] = await Promise.all([
        apiClient.get("/search/polls", { params: { q: searchQuery, limit: 20 } }),
        apiClient.get("/search/users", { params: { q: searchQuery, limit: 10 } }),
      ]);

      setResults({
        polls: pollsRes.data?.data || pollsRes.data || [],
        users: usersRes.data?.data || usersRes.data || [],
      });
      setActiveTab("all");
    } catch (error) {
      toast.error("Search failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("pollify_recent_searches");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Search</h1>
        <p className="text-surface-500 mt-2">Find polls, people, and topics.</p>
      </div>

      <Card className="p-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search size={20} className="text-surface-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search polls, people, or topics..."
              className="flex-1 py-3 bg-transparent text-sm text-surface-900 placeholder:text-surface-400 outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setResults(null); }}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <Button onClick={() => handleSearch()} loading={loading} size="sm">
            Search
          </Button>
        </div>
      </Card>

      {!results && !loading && (
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                  <Clock size={16} className="text-surface-400" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-surface-500 hover:text-danger-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => { setQuery(search); handleSearch(search); }}
                    className="px-3 py-1.5 rounded-lg bg-surface-100 text-sm text-surface-700 hover:bg-surface-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-brand-500" />
              Trending Searches
            </h3>
            <div className="space-y-2">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => { setQuery(search); handleSearch(search); }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-surface-400 w-6">{index + 1}</span>
                    <span className="text-sm text-surface-700 group-hover:text-surface-900">{search}</span>
                  </div>
                  <ArrowRight size={16} className="text-surface-400 group-hover:text-surface-600 transition-colors" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {results && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {["all", "polls", "users"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeTab === tab
                    ? "bg-brand-500 text-white shadow-sm shadow-brand-500/25"
                    : "bg-white text-surface-600 border border-surface-200 hover:border-surface-300"
                  }
                `}
              >
                {tab === "all" ? "All Results" : tab === "polls" ? "Polls" : "Users"}
              </button>
            ))}
          </div>

          {(activeTab === "all" || activeTab === "polls") && results.polls?.length > 0 && (
            <div className="space-y-4">
              {activeTab === "all" && (
                <h3 className="text-sm font-semibold text-surface-900">Polls ({results.polls.length})</h3>
              )}
              {results.polls.map((poll, index) => (
                <motion.div
                  key={poll._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-6 cursor-pointer" onClick={() => navigate(`/polls/${poll._id}`)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="secondary" size="sm" className="mb-2">
                          {poll.category || "General"}
                        </Badge>
                        <h4 className="text-base font-semibold text-surface-900 mb-1">{poll.title}</h4>
                        {poll.description && (
                          <p className="text-sm text-surface-600 line-clamp-2">{poll.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-surface-500">{poll.totalVotes?.toLocaleString() || 0} votes</span>
                          <span className="text-xs text-surface-400">·</span>
                          <span className="text-xs text-surface-500">{poll.options?.length || 0} options</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {(activeTab === "all" || activeTab === "users") && results.users?.length > 0 && (
            <div className="space-y-4">
              {activeTab === "all" && (
                <h3 className="text-sm font-semibold text-surface-900">Users ({results.users.length})</h3>
              )}
              {results.users.map((user, index) => (
                <motion.div
                  key={user._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="p-4 cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                        {user.name?.split(" ").map(n => n[0]).join("") || "U"}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-surface-900">{user.name}</h4>
                        <p className="text-xs text-surface-500">@{user.username}</p>
                        {user.bio && <p className="text-xs text-surface-600 mt-1 line-clamp-1">{user.bio}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-surface-900">{user.stats?.polls || 0}</p>
                        <p className="text-xs text-surface-500">polls</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {((activeTab === "all" && !results.polls?.length && !results.users?.length) ||
            (activeTab === "polls" && !results.polls?.length) ||
            (activeTab === "users" && !results.users?.length)) && (
            <EmptyState
              type="notFound"
              title="No results found"
              description="Try adjusting your search query"
              icon={Search}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}