import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Vote,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  Flame,
  Search,
  Bell,
  Eye,
  Clock,
  Share2,
  Bookmark,
  ExternalLink,
  RefreshCw,
  UserPlus,
  Tag,
  Calendar,
  Trophy,
  Zap,
  Target,
  MessageCircle,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { SearchInput } from "../../../components/ui/SearchInput";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getDashboardStats,
  getLatestPolls,
  getTrendingPolls,
  getRecommendedPolls,
  getNotifications,
  getUnreadCount,
  getCurrentUser,
  getUserStats,
  getCategories,
  getSearchSuggestions,
} from "../api/dashboardApi";
import { useDebounce } from "../hooks/useDebounce";

const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatDate = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
};

function StatCard({ icon: Icon, label, value, change, delay = 0, compact = false }) {
  const isPositive = change?.startsWith("+");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover dark className={`p-5 ${compact ? "min-h-[140px]" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 flex-shrink-0">
              <Icon size={20} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-400">{label}</p>
              <p className="text-xl font-bold text-white mt-0.5 line-clamp-2">
                {value}
              </p>
            </div>
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                isPositive
                  ? "bg-success-500/15 text-success-400"
                  : "bg-danger-500/15 text-danger-400"
              }`}
            >
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {change}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function PollCard({ poll, index = 0, showDescription = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover dark className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm" dark>
                {poll.category || "General"}
              </Badge>
              {poll.isActive !== false && (
                <Badge variant="success" size="sm" dot dark>
                  Active
                </Badge>
              )}
            </div>
            <Link to={`/polls/${poll._id}`}>
              <h4 className="text-base font-semibold text-surface-100 hover:text-brand-400 transition-colors line-clamp-2">
                {poll.title || "Untitled poll"}
              </h4>
            </Link>
            {showDescription && poll.description && (
              <p className="text-sm text-surface-400 mt-1 line-clamp-2">
                {poll.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Vote size={14} />
                {formatNumber(poll.totalVotes || 0)} votes
              </span>
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Eye size={14} />
                {formatNumber(poll.views || 0)} views
              </span>
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Clock size={14} />
                {formatDate(poll.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="sm" className="p-2" aria-label="Share poll">
              <Share2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2" aria-label="Bookmark poll">
              <Bookmark size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="p-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold text-surface-200 mb-1">{title}</h3>
      <p className="text-sm text-surface-400 mb-4">{description}</p>
      {action}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-danger-500/15 flex items-center justify-center text-danger-400 mb-4">
        <Activity size={28} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">Failed to load</h3>
      <p className="text-sm text-surface-400 mb-4">{message}</p>
      <Button onClick={onRetry} variant="secondary" icon={<RefreshCw size={16} />}>
        Try again
      </Button>
    </div>
  );
}

function ProfileSummaryCard({ profile, stats, statsLoading }) {
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <Card dark className="p-6">
      <div className="flex items-center gap-4">
        <Avatar
          src={profile.profileImage}
          fallback={(profile.name || "U").split(" ").map((n) => n[0]).join("")}
          size="lg"
          color="brand"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {profile.name || "User"}
          </h3>
          <p className="text-sm text-surface-400 truncate">
            @{profile.username || "user"}
          </p>
          {profile.bio && (
            <p className="text-xs text-surface-500 mt-1 line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-surface-800">
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {statsLoading ? "..." : formatNumber(stats.totalPollsCreated || 0)}
          </p>
          <p className="text-xs text-surface-400">Polls</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {statsLoading ? "..." : formatNumber(stats.followersCount || 0)}
          </p>
          <p className="text-xs text-surface-400">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {statsLoading ? "..." : formatNumber(stats.followingCount || 0)}
          </p>
          <p className="text-xs text-surface-400">Following</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-surface-400">Profile completion</span>
          <span className="text-surface-300 font-medium">
            {stats.profileCompletionPercentage ?? 0}%
          </span>
        </div>
        <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.profileCompletionPercentage ?? 0}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-surface-500">
          <Calendar size={12} />
          Member since {memberSince}
        </div>
      </div>

      <div className="mt-4">
        <Link to="/profile">
          <Button variant="secondary" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function UserStatisticsCard({ stats, statsLoading }) {
  const items = [
    { label: "Total Polls", value: stats.totalPollsCreated, icon: FileText },
    { label: "Votes Cast", value: stats.totalVotesCast, icon: Vote },
    { label: "Comments", value: stats.totalComments, icon: MessageCircle },
    { label: "Bookmarks", value: stats.totalSavedPolls, icon: Bookmark },
    { label: "Likes Received", value: stats.totalLikesReceived, icon: Heart },
    { label: "Followers", value: stats.followersCount, icon: UserPlus },
  ];

  return (
    <Card dark className="p-6">
      <h3 className="text-base font-semibold text-white mb-4">Your Statistics</h3>
      {statsLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton dark className="h-4 w-24" />
              <Skeleton dark className="h-4 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                  <item.icon size={14} />
                </div>
                <span className="text-sm text-surface-300">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {formatNumber(item.value || 0)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}

function CategoriesWidget({ categories, loading }) {
  return (
    <Card dark className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag size={16} className="text-brand-400" />
        <h3 className="text-base font-semibold text-white">Categories</h3>
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton dark key={i} className="h-8 w-full rounded-lg" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 8).map((category, index) => (
            <motion.div
              key={category._id || category.name || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link to={`/search?category=${encodeURIComponent(category.name || category)}`}>
                <Badge variant="secondary" size="sm" dark className="cursor-pointer hover:bg-surface-700 transition-colors">
                  {category.name || category}
                </Badge>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-surface-500">No categories found</p>
      )}
    </Card>
  );
}

function QuickStatsCard({ stats, statsLoading }) {
  const items = [
    { label: "Total Votes", value: stats.totalVotesCast, icon: Vote, color: "text-success-400" },
    { label: "Saved Polls", value: stats.totalSavedPolls, icon: Bookmark, color: "text-brand-400" },
    { label: "Comments", value: stats.totalComments, icon: MessageCircle, color: "text-warning-400" },
  ];

  return (
    <Card dark className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-warning-400" />
        <h3 className="text-base font-semibold text-white">Quick Stats</h3>
      </div>
      {statsLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton dark className="h-4 w-24" />
              <Skeleton dark className="h-4 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <item.icon size={14} className={item.color} />
                <span className="text-sm text-surface-300">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {formatNumber(item.value || 0)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RecentActivityCard({ polls }) {
  const activities = polls.slice(0, 5).map((poll, index) => ({
    id: poll._id || index,
    type: "poll_created",
    title: poll.title || "Untitled poll",
    time: poll.createdAt,
    icon: FileText,
  }));

  return (
    <Card dark className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-success-400" />
        <h3 className="text-base font-semibold text-white">Recent Activity</h3>
      </div>
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400 flex-shrink-0">
                <activity.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-200 line-clamp-2">
                  {activity.title}
                </p>
                <p className="text-xs text-surface-500 mt-0.5">
                  {formatDate(activity.time)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Your recent activity will appear here."
        />
      )}
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });

  const {
    data: userStats,
    isLoading: userStatsLoading,
    refetch: refetchUserStats,
  } = useQuery({
    queryKey: ["dashboard", "userStats"],
    queryFn: getUserStats,
    enabled: !!user,
  });

  const {
    data: latestData,
    isLoading: latestLoading,
    error: latestError,
    refetch: refetchLatest,
  } = useQuery({
    queryKey: ["dashboard", "latest"],
    queryFn: getLatestPolls,
  });

  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ["dashboard", "trending"],
    queryFn: getTrendingPolls,
  });

  const {
    data: recommendedData,
    isLoading: recommendedLoading,
    refetch: refetchRecommended,
  } = useQuery({
    queryKey: ["dashboard", "recommended"],
    queryFn: getRecommendedPolls,
    enabled: !!user,
  });

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: () => getNotifications(5),
    enabled: !!user,
  });

  const {
    data: unreadData,
    refetch: refetchUnread,
  } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadCount,
    refetchInterval: 60 * 1000,
  });

  const {
    data: userData,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: getCurrentUser,
    enabled: !!user,
  });

  const {
    data: categoriesData,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: getCategories,
  });

  const stats = statsData || {};
  const userStatsData = userStats || {};
  const latestPolls = latestData?.polls || latestData || [];
  const trendingPolls = trendingData?.polls || trendingData || [];
  const recommendedPolls = recommendedData?.polls || recommendedData || [];
  const notifications = notificationsData?.notifications || notificationsData || [];
  const unreadCount = typeof unreadData === "number" ? unreadData : unreadData?.count || 0;
  const profile = userData?.user || userData || user || {};
  const categories = categoriesData?.categories || categoriesData || [];

  const quickActions = [
    { icon: Plus, label: "Create Poll", href: "/polls/create", variant: "primary" },
    { icon: Search, label: "Explore", href: "/search", variant: "secondary" },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/analytics",
      variant: "secondary",
    },
  ];

  const handleRetryAll = () => {
    refetchStats();
    refetchUserStats();
    refetchLatest();
    refetchTrending();
    refetchRecommended();
    refetchNotifications();
    refetchUnread();
    refetchUser();
    refetchCategories();
  };

  const hasAnyError = statsError || latestError || trendingError;

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      getSearchSuggestions(debouncedSearch)
        .then((data) => {
          setSearchSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
        })
        .catch(() => {
          setSearchSuggestions([]);
        });
    }
  }, [debouncedSearch]);

  const handleSearchSelect = (suggestion) => {
    setSearchQuery(suggestion);
    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
  };

  if (hasAnyError) {
    return (
      <div className="space-y-6">
        <ErrorState
          message={statsError?.message || latestError?.message || trendingError?.message}
          onRetry={handleRetryAll}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600 p-6 md:p-8 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-white/80 mt-1">
              Welcome back, {profile.name?.split(" ")[0] || "User"}! Here's what's happening in your community.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Button
                  variant={action.variant === "primary" ? "default" : "outline"}
                  icon={action.icon}
                  size="sm"
                  className={
                    action.variant === "primary"
                      ? "bg-white text-brand-700 hover:bg-white/90 shadow-lg"
                      : "border-white/30 text-white hover:bg-white/10"
                  }
                >
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Global Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search polls, users, categories..."
          suggestions={searchSuggestions}
          onSelectSuggestion={handleSearchSelect}
          className="max-w-2xl"
        />
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} dark className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton dark className="w-11 h-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton dark className="h-3 w-20" />
                    <Skeleton dark className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              icon={FileText}
              label="Total Polls"
              value={formatNumber(stats.totalPolls)}
              change={`${stats.completionRate ?? 0}% active`}
              delay={0}
            />
            <StatCard
              icon={Vote}
              label="Total Votes"
              value={formatNumber(stats.totalVotes)}
              change={`${stats.avgVotes ?? 0} avg`}
              delay={0.05}
            />
            <StatCard
              icon={Trophy}
              label="Most Popular"
              value={
                stats.mostPopularPoll?.title
                  ? stats.mostPopularPoll.title.length > 20
                    ? stats.mostPopularPoll.title.slice(0, 20) + "..."
                    : stats.mostPopularPoll.title
                  : "No polls yet"
              }
              change={
                stats.mostPopularPoll?.totalVotes
                  ? `${formatNumber(stats.mostPopularPoll.totalVotes)} votes`
                  : "No activity"
              }
              delay={0.1}
              compact
            />
            <StatCard
              icon={Target}
              label="Completion"
              value={stats.completionRate ? `${stats.completionRate}%` : "0%"}
              change={
                stats.leastPopularPoll?.title
                  ? `Focus: ${stats.leastPopularPoll.title.length > 15 ? stats.leastPopularPoll.title.slice(0, 15) + "..." : stats.leastPopularPoll.title}`
                  : "Keep creating"
              }
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Recent and Recommended */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent polls */}
          <Card dark className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Recent Polls</h3>
                <p className="text-sm text-surface-400 mt-0.5">Latest activity</p>
              </div>
              <Link to="/polls">
                <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />}>
                  View all
                </Button>
              </Link>
            </div>
            {latestLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton dark className="w-8 h-8 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton dark className="h-4 w-48" />
                      <Skeleton dark className="h-3 w-32" />
                    </div>
                    <Skeleton dark className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : latestPolls.length > 0 ? (
              <div className="space-y-3">
                {latestPolls.slice(0, 5).map((poll, index) => (
                  <PollCard key={poll._id || index} poll={poll} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No polls yet"
                description="Create your first poll to see it here."
                action={
                  <Link to="/polls/create">
                    <Button variant="primary" size="sm" icon={<Plus size={16} />}>
                      Create Poll
                    </Button>
                  </Link>
                }
              />
            )}
          </Card>

          {/* Recommended polls */}
          {recommendedData && (
            <Card dark className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Recommended For You</h3>
                  <p className="text-sm text-surface-400 mt-0.5">Based on your activity</p>
                </div>
              </div>
              {recommendedLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton dark className="w-8 h-8 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton dark className="h-4 w-48" />
                        <Skeleton dark className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendedPolls.length > 0 ? (
                <div className="space-y-3">
                  {recommendedPolls.slice(0, 3).map((poll, index) => (
                    <PollCard key={poll._id || index} poll={poll} index={index} showDescription />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No recommendations yet"
                  description="Vote on more polls to get personalized recommendations."
                />
              )}
            </Card>
          )}

          {/* Recent Activity */}
          <RecentActivityCard polls={latestPolls} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Profile summary */}
          <ProfileSummaryCard
            profile={profile}
            stats={userStatsData}
            statsLoading={userStatsLoading}
          />

          {/* User Statistics */}
          <UserStatisticsCard stats={userStatsData} statsLoading={userStatsLoading} />

          {/* Trending topics */}
          <Card dark className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Trending</h3>
                <p className="text-sm text-surface-400 mt-0.5">Hot polls</p>
              </div>
              <Flame size={18} className="text-brand-400" />
            </div>
            {trendingLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton dark className="h-4 w-32" />
                    <Skeleton dark className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : trendingPolls.length > 0 ? (
              <div className="space-y-3">
                {trendingPolls.slice(0, 5).map((poll, index) => (
                  <motion.div
                    key={poll._id || poll.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400 flex-shrink-0">
                        <Flame size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-surface-200 truncate">
                          {poll.title || "Untitled poll"}
                        </span>
                        <span className="text-xs text-surface-500">
                          {poll.creator?.name ||
                            poll.creator?.username ||
                            "Community"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-white">
                        {formatNumber(poll.totalVotes || 0)}
                      </span>
                      <span className="text-xs font-medium text-success-400">
                        {poll.trendingScore
                          ? `${Math.round(poll.trendingScore)} pts`
                          : "Trending"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Flame}
                title="No trending polls"
                description="Check back later for trending content."
              />
            )}
          </Card>

          {/* Categories */}
          <CategoriesWidget categories={categories} loading={false} />

          {/* Quick Stats */}
          <QuickStatsCard stats={userStatsData} statsLoading={userStatsLoading} />

          {/* Notifications preview */}
          <Card dark className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Notifications</h3>
                <p className="text-sm text-surface-400 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
              {unreadCount > 0 && (
                <Badge variant="danger" size="sm" dot>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </div>
            {notificationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton dark className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton dark className="h-3 w-full" />
                      <Skeleton dark className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification, index) => (
                  <motion.div
                    key={notification._id || index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                      notification.isRead ? "bg-surface-900/50" : "bg-brand-500/5"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-surface-400 flex-shrink-0">
                      <Bell size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-200 line-clamp-2">
                        {notification.title || notification.message}
                      </p>
                      <p className="text-xs text-surface-500 mt-0.5">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1" />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="You're all caught up!"
              />
            )}
            <div className="mt-4 pt-4 border-t border-surface-800">
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="w-full">
                  View all notifications
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
