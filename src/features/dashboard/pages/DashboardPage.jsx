import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Vote,
  Users,
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getDashboardStats,
  getLatestPolls,
  getTrendingPolls,
  getRecommendedPolls,
  getNotifications,
  getUnreadCount,
  getCurrentUser,
} from "../api/dashboardApi";

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

export default function DashboardPage() {
  const { user } = useAuth();

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

  const stats = statsData || {};
  const latestPolls = latestData?.polls || latestData || [];
  const trendingPolls = trendingData?.polls || trendingData || [];
  const recommendedPolls = recommendedData?.polls || recommendedData || [];
  const notifications = notificationsData?.notifications || notificationsData || [];
  const unreadCount = typeof unreadData === "number" ? unreadData : unreadData?.count || 0;
  const profile = userData?.user || userData || user || {};

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
    refetchLatest();
    refetchTrending();
    refetchRecommended();
    refetchNotifications();
    refetchUnread();
    refetchUser();
  };

  const hasAnyError = statsError || latestError || trendingError;

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
              icon={Users}
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
              icon={TrendingUp}
              label="Engagement"
              value={stats.completionRate ? `${stats.completionRate}%` : "0%"}
              change={
                stats.leastPopularPoll?.title
                  ? `Best: ${stats.leastPopularPoll.title.length > 15 ? stats.leastPopularPoll.title.slice(0, 15) + "..." : stats.leastPopularPoll.title}`
                  : "No data"
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
        </div>

        {/* Right column - Trending, Notifications, Profile */}
        <div className="space-y-6">
          {/* Profile summary */}
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
                  {formatNumber(stats.totalPolls)}
                </p>
                <p className="text-xs text-surface-400">Polls</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">
                  {formatNumber(stats.totalVotes)}
                </p>
                <p className="text-xs text-surface-400">Votes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">
                  {formatNumber(stats.totalBookmarks || 0)}
                </p>
                <p className="text-xs text-surface-400">Bookmarks</p>
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
