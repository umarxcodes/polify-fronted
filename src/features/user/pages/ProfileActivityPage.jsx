import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import { Calendar, Vote, FileText, TrendingUp, BarChart3 } from 'lucide-react'
import { resolveIcon } from '../../../components/ui/iconUtils'
import { apiClient } from '../../../lib/axios'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { normalizeApiResponse } from '../../../utils/apiResponse'

import { Skeleton } from '../../../components/ui/Skeleton'

function ActivityTimeline({ activities }) {
  const icons = {
    vote: <Vote size={16} />,
    poll: <FileText size={16} />,
    comment: <FileText size={16} />,
  }

  return (
    <div className="space-y-4">
      {activities?.map((activity, index) => (
        <motion.div
          key={activity._id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/10 flex items-center justify-center text-brand-600 flex-shrink-0">
            {icons[activity.type] || <Calendar size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-surface-900">{activity.description}</p>
            <p className="text-xs text-surface-500 mt-1">{activity.timeAgo}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function StatsGrid({ stats }) {
  const statsItems = [
    { label: 'Total Polls', value: stats?.totalPolls || 0, icon: FileText },
    { label: 'Total Votes', value: stats?.totalVotes || 0, icon: Vote },
    {
      label: 'Engagement',
      value: `${stats?.engagementRate || 0}%`,
      icon: TrendingUp,
    },
    { label: 'Rank', value: `#${stats?.rank || 1}`, icon: BarChart3 },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/10 flex items-center justify-center text-brand-600 mx-auto mb-3">
              {resolveIcon(stat.icon, 22)}
            </div>
            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
            <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default function ProfileActivityPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', 'activity'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me/activity')
      return normalizeApiResponse(response.data)
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600">{error.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Activity</h2>
        <p className="text-surface-500 mt-1">Your recent Pollify activity</p>
      </div>

      <StatsGrid stats={data?.stats} />

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">
          Recent Activity
        </h3>
        <ActivityTimeline activities={data?.activities || []} />
      </Card>
    </div>
  )
}
