import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Vote,
  Bookmark,
  Share2,
  MessageCircle,
  MoreHorizontal,
  TrendingUp,
  Check,
  Plus,
} from 'lucide-react'
import { pollApi } from '../api/pollApi'
import { apiClient } from '../../../lib/axios'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Avatar } from '../../../components/ui/Avatar'
import { Dropdown } from '../../../components/ui/Dropdown'
import { toast } from 'sonner'
import { Skeleton } from '../../../components/ui/Skeleton'

function PollOption({
  option,
  percentage,
  isSelected,
  isWinner,
  onSelect,
  disabled,
  index,
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => !disabled && onSelect(option._id)}
      disabled={disabled}
      className={`
        relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300
        ${
          isSelected
            ? 'border-brand-500 bg-brand-50/50'
            : 'border-surface-200 hover:border-surface-300 bg-white hover:shadow-sm'
        }
        ${disabled ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2 + index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          absolute inset-0 rounded-xl origin-left
          ${isWinner ? 'bg-gradient-to-r from-brand-500/10 to-brand-600/5' : 'bg-surface-50'}
        `}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
            ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-surface-300'}
          `}
          >
            {isSelected && <Check size={14} className="text-white" />}
          </div>
          <span className="text-sm font-medium text-surface-900">
            {option.text}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isWinner && (
            <Badge variant="success" size="sm" className="hidden sm:flex">
              <TrendingUp size={12} />
              Leading
            </Badge>
          )}
          <span
            className={`text-sm font-bold ${isSelected ? 'text-brand-600' : 'text-surface-900'}`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Vote count bar */}
      <div className="mt-2 h-1.5 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            delay: 0.3 + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`
            h-full rounded-full
            ${isWinner ? 'bg-gradient-to-r from-brand-500 to-brand-600' : 'bg-surface-300'}
          `}
        />
      </div>
    </motion.button>
  )
}

function PollCard({ poll, index = 0 }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(poll.totalVotes || 0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const totalVotes =
    voteCount ||
    poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) ||
    1
  const maxVotes = Math.max(
    ...(poll.options?.map((opt) => opt.votes || 0) || [1])
  )

  const handleVote = async (optionId) => {
    if (hasVoted) return

    try {
      await apiClient.post(`/votes/polls/${poll._id}/vote`, {
        options: [optionId],
      })
      setSelectedOption(optionId)
      setHasVoted(true)
      setVoteCount((prev) => prev + 1)
      toast.success('Vote recorded!', {
        description: 'Your vote has been counted.',
        duration: 3000,
      })
    } catch (error) {
      toast.error('Voting failed', {
        description: error.message || 'Please try again.',
      })
    }
  }

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await apiClient.delete(`/bookmarks/${poll._id}`)
        setIsBookmarked(false)
        toast.success('Removed from bookmarks')
      } else {
        await apiClient.post(`/bookmarks/${poll._id}`)
        setIsBookmarked(true)
        toast.success('Added to bookmarks')
      }
    } catch (error) {
      toast.error('Action failed', { description: error.message })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + `/polls/${poll._id}`
      )
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const menuItems = [
    { label: 'Save poll', icon: Bookmark, onClick: handleBookmark },
    { label: 'Share', icon: Share2, onClick: handleShare },
    { label: 'Report', icon: MoreHorizontal, onClick: () => {} },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Card hover className="overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                fallback={poll.createdBy?.name?.[0] || 'U'}
                color="brand"
                size="md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-900">
                    {poll.createdBy?.name || 'Anonymous'}
                  </span>
                  {poll.isVerified && (
                    <Badge variant="primary" size="sm" dot>
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-surface-500">
                    @{poll.createdBy?.username || 'user'}
                  </span>
                  <span className="text-xs text-surface-400">·</span>
                  <span className="text-xs text-surface-500">
                    {poll.timeAgo || '2h'}
                  </span>
                </div>
              </div>
            </div>
            <Dropdown
              trigger={
                <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              }
              items={menuItems}
              align="right"
            />
          </div>

          {/* Category & Title */}
          <div className="mt-4">
            <Badge variant="secondary" size="sm" className="mb-3">
              {poll.category || 'General'}
            </Badge>
            <h3 className="text-lg font-semibold text-surface-900 leading-tight">
              {poll.title}
            </h3>
            {poll.description && (
              <p className="text-sm text-surface-600 mt-2 leading-relaxed">
                {poll.description}
              </p>
            )}
          </div>
        </div>

        {/* Poll options */}
        <div className="px-6 pb-4">
          <div className="space-y-3">
            {poll.options?.map((option, idx) => {
              const percentage = hasVoted
                ? Math.round((option.votes / totalVotes) * 100)
                : 0
              const isWinner = hasVoted && option.votes === maxVotes
              return (
                <PollOption
                  key={option._id || idx}
                  option={option}
                  percentage={percentage}
                  isSelected={selectedOption === option._id}
                  isWinner={isWinner}
                  onSelect={handleVote}
                  disabled={hasVoted}
                  index={idx}
                />
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 transition-colors">
                <Vote size={16} />
                <span className="font-medium">
                  {voteCount.toLocaleString()} votes
                </span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 transition-colors"
              >
                <MessageCircle size={16} />
                <span className="font-medium">{poll.commentsCount || 0}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isBookmarked ? 'primary' : 'ghost'}
                size="sm"
                onClick={handleBookmark}
                icon={
                  <Bookmark
                    size={16}
                    fill={isBookmarked ? 'currentColor' : 'none'}
                  />
                }
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                icon={<Share2 size={16} />}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function PollFeedPage() {
  const [filter, setFilter] = useState('latest')

  const {
    data: polls,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['polls', filter],
    queryFn: async () => {
      const response = await pollApi.getPolls({ filter })
      const body = response.data
      const received = body?.data?.polls || body?.polls || []
      return received.map((poll, idx) => ({ ...poll, index: idx }))
    },
    staleTime: 30000,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-6" />
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mx-auto mb-4">
          <Vote size={28} />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">
          Failed to load polls
        </h3>
        <p className="text-sm text-surface-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Poll Feed</h2>
          <p className="text-surface-500 mt-1">
            Discover and vote on community polls
          </p>
        </div>
        <Link to="/polls/create">
          <Button variant="primary" icon={<Plus size={18} />}>
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['latest', 'trending', 'ending-soon', 'popular'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${
                filter === f
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                  : 'bg-white text-surface-600 border border-surface-200 hover:border-surface-300'
              }
            `}
          >
            {f === 'latest'
              ? 'Latest'
              : f === 'trending'
                ? 'Trending'
                : f === 'ending-soon'
                  ? 'Ending Soon'
                  : 'Popular'}
          </button>
        ))}
      </div>

      {/* Poll list */}
      <div className="space-y-4">
        {polls.length > 0 ? (
          polls.map((poll, idx) => (
            <PollCard key={poll._id || idx} poll={poll} index={idx} />
          ))
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 mx-auto mb-4">
              <Vote size={28} />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 mb-1">
              No polls yet
            </h3>
            <p className="text-sm text-surface-500 mb-4">
              Be the first to create a poll!
            </p>
            <Link to="/polls/create">
              <Button variant="primary" icon={<Plus size={18} />}>
                Create Poll
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
