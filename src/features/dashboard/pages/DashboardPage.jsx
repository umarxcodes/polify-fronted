import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../../lib/axios'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Badge } from '../../../components/ui/Badge'
import { resolveIcon } from '../../../components/ui/iconUtils'

const formatNumber = (value) => Number(value || 0).toLocaleString()
const formatDate = (value) => {
  if (!value) return 'Recently'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString()
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  delay = 0,
  compact = false,
}) {
  const isPositive = change?.startsWith('+')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover dark className={`p-6 ${compact ? 'min-h-[140px]' : ''}`}>
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
                  ? 'bg-success-500/15 text-success-400'
                  : 'bg-danger-500/15 text-danger-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              {change}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

function ChartCard({ title, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card dark className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-surface-400 mt-0.5">Live data</p>
          </div>
          <Badge variant="primary" dot>
            Live
          </Badge>
        </div>
        {children}
      </Card>
    </motion.div>
  )
}

function ActivityItem({ poll, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-800/50 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 flex-shrink-0">
        <Vote size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-200 truncate">
          {poll.title}
        </p>
        <p className="text-xs text-surface-500 mt-0.5">
          {poll.votes} votes · {poll.timeAgo}
        </p>
      </div>
      <Badge variant="secondary" size="sm" dark>
        {poll.category}
      </Badge>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const [statsRes, latestRes, trendingRes] = await Promise.all([
        apiClient.get('/analytics/dashboard'),
        apiClient.get('/search/latest'),
        apiClient.get('/search/trending'),
      ])

      const stats = statsRes.data?.data || statsRes.data || {}
      const latestPolls =
        latestRes.data?.data?.polls ||
        latestRes.data?.polls ||
        latestRes.data ||
        []
      const trendingPolls =
        trendingRes.data?.data?.polls ||
        trendingRes.data?.polls ||
        trendingRes.data ||
        []

      return {
        stats,
        recentPolls: Array.isArray(latestPolls) ? latestPolls : [],
        trendingPolls: Array.isArray(trendingPolls) ? trendingPolls : [],
      }
    },
  })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-500/15 flex items-center justify-center text-danger-400 mb-4">
          <Activity size={28} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">
          Failed to load dashboard
        </h3>
        <p className="text-sm text-surface-400 mb-4">{error.message}</p>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    )
  }

  const stats = data?.stats || {}
  const recentPolls = data?.recentPolls || []
  const trendingPolls = data?.trendingPolls || []

  const quickActions = [
    {
      icon: Plus,
      label: 'Create Poll',
      href: '/polls/create',
      variant: 'primary',
    },
    { icon: Search, label: 'Explore', href: '/search', variant: 'secondary' },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/analytics',
      variant: 'secondary',
    },
  ]

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
              Welcome back! Here's what's happening in your community.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Button
                  variant={action.variant === 'primary' ? 'default' : 'outline'}
                  icon={action.icon}
                  size="sm"
                  className={
                    action.variant === 'primary'
                      ? 'bg-white text-brand-700 hover:bg-white/90 shadow-lg'
                      : 'border-white/30 text-white hover:bg-white/10'
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
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} dark className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton dark className="w-12 h-12 rounded-xl" />
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
                  ? stats.mostPopularPoll.title
                  : 'No polls yet'
              }
              change={
                stats.mostPopularPoll?.totalVotes
                  ? `${formatNumber(stats.mostPopularPoll.totalVotes)} votes`
                  : 'No activity'
              }
              delay={0.1}
              compact
            />
            <StatCard
              icon={TrendingUp}
              label="Engagement"
              value={stats.completionRate ? `${stats.completionRate}%` : '0%'}
              change={
                stats.leastPopularPoll?.title
                  ? `Best: ${stats.leastPopularPoll.title}`
                  : 'No data'
              }
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent polls */}
        <div className="lg:col-span-2 space-y-4">
          <ChartCard title="Recent Polls" className="!p-0">
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton
                      dark
                      className="w-8 h-8 rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton dark className="h-4 w-48" />
                      <Skeleton dark className="h-3 w-32" />
                    </div>
                    <Skeleton dark className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentPolls.length > 0 ? (
              <div className="divide-y divide-surface-800">
                {recentPolls.slice(0, 5).map((poll, index) => (
                  <ActivityItem
                    key={poll._id || index}
                    poll={{
                      title: poll.title || 'Untitled poll',
                      votes: formatNumber(poll.totalVotes || poll.votes || 0),
                      timeAgo: formatDate(poll.createdAt || poll.updatedAt),
                      category: poll.category || poll.type || 'General',
                    }}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
                  <FileText size={24} />
                </div>
                <p className="text-sm text-surface-400">
                  No polls yet. Create your first poll to get started!
                </p>
                <Link to="/polls/create">
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4"
                    icon={Plus}
                  >
                    Create Poll
                  </Button>
                </Link>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Quick stats & trending */}
        <div className="space-y-6">
          {/* Trending topics */}
          <ChartCard title="Trending Topics" delay={0.2}>
            {isLoading ? (
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
                {trendingPolls.slice(0, 4).map((poll, index) => (
                  <motion.div
                    key={poll._id || poll.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400">
                        <Flame size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-surface-200 truncate">
                          {poll.title || 'Untitled poll'}
                        </span>
                        <span className="text-xs text-surface-500">
                          {poll.creator?.name ||
                            poll.creator?.username ||
                            'Community'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {formatNumber(poll.totalVotes || 0)}
                      </span>
                      <span className="text-xs font-medium text-success-400">
                        {poll.trendingScore
                          ? `${Math.round(poll.trendingScore)} pts`
                          : 'Trending'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-surface-700 p-4 text-sm text-surface-400">
                No trending polls available right now.
              </div>
            )}
          </ChartCard>

          {/* Quick actions */}
          <ChartCard title="Quick Actions" delay={0.3}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Plus, label: 'New Poll', href: '/polls/create' },
                { icon: Vote, label: 'Vote', href: '/dashboard' },
                { icon: Users, label: 'Invite', href: '/dashboard' },
                { icon: BarChart3, label: 'Analytics', href: '/analytics' },
              ].map((action, index) => (
                <Link key={action.label} to={action.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl border border-surface-700 hover:border-brand-500/40 hover:bg-brand-500/10 transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 mx-auto mb-2">
                      {resolveIcon(action.icon, 18)}
                    </div>
                    <span className="text-xs font-medium text-surface-300">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
