import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Vote,
  Eye,
  Clock,
  TrendingUp,
  Flame,
  Star,
  Search,
  ChevronRight,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/ui/EmptyState";
import { searchService } from "../services/searchService";
import { SearchFilters } from "../components/SearchFilters";

const TABS = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "latest", label: "Latest", icon: Clock },
  { id: "popular", label: "Popular", icon: Flame },
  { id: "ending-soon", label: "Ending Soon", icon: Clock },
  { id: "recommended", label: "For You", icon: Star },
];

export default function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState("trending");
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ sort: "newest" });

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      switch (activeTab) {
        case "trending":
          res = await searchService.getTrendingPolls(filters);
          break;
        case "latest":
          res = await searchService.getLatestPolls(filters);
          break;
        case "popular":
          res = await searchService.getPopularPolls(filters);
          break;
        case "ending-soon":
          res = await searchService.getEndingSoonPolls(filters);
          break;
        case "recommended":
          res = await searchService.getRecommendedPolls(filters);
          break;
        default:
          res = await searchService.getTrendingPolls(filters);
      }
      const data = res?.data || {};
      setPolls(data.polls || []);
    } catch (err) {
      setError(err.message || "Failed to load polls");
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleRetry = () => {
    fetchPolls();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Discover</h1>
        <p className="text-surface-400 mt-2">Explore trending, latest, and popular polls.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-sm shadow-primary-500/25"
                  : "bg-surface-800 text-surface-300 hover:bg-surface-700"
                }
              `}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <SearchFilters
        filters={filters}
        onFilterChange={setFilters}
        resultCount={polls.length}
        dark
      />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} dark className="p-5">
              <Skeleton dark className="h-5 w-3/4 mb-3" />
              <Skeleton dark className="h-4 w-full mb-2" />
              <Skeleton dark className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton dark className="h-8 w-20 rounded-lg" />
                <Skeleton dark className="h-8 w-20 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Card dark className="p-8 text-center">
          <p className="text-danger-400 mb-4">{error}</p>
          <Button variant="secondary" size="sm" onClick={handleRetry}>
            Try again
          </Button>
        </Card>
      )}

      {!loading && !error && polls.length === 0 && (
        <EmptyState
          icon={Search}
          title="No polls found"
          description="Check back later for more content."
          dark
        />
      )}

      {!loading && !error && polls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll, index) => (
            <motion.div
              key={poll._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/polls/${poll._id}`}>
                <Card hover dark className="p-5 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" size="sm" dark>
                      {poll.category || "General"}
                    </Badge>
                    {poll.isActive !== false && (
                      <Badge variant="success" size="sm" dot dark>
                        Active
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 flex-1">
                    {poll.title || "Untitled poll"}
                  </h3>
                  {poll.description && (
                    <p className="text-sm text-surface-400 mb-4 line-clamp-2">
                      {poll.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-800">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-surface-400">
                        <Vote size={14} />
                        {poll.totalVotes?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-surface-400">
                        <Eye size={14} />
                        {poll.views?.toLocaleString() || 0}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-surface-500" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
