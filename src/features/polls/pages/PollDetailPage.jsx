import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Vote,
  Clock,
  Eye,
  Share2,
  TrendingUp,
  ArrowLeft,
  MoreHorizontal,
  Flag,
  MessageCircle,
  Lock,
  Archive,
  PlayCircle,
  Ban,
  Loader2,
} from 'lucide-react'
import { apiClient } from '../../../lib/axios'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Avatar } from '../../../components/ui/Avatar'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Dropdown } from '../../../components/ui/Dropdown'
import { useVoting } from '../../voting/hooks/useVoting'
import VoteResults from '../../voting/components/VoteResults'
import { useComments } from '../../comments/hooks/useComments'
import CommentCard from '../../comments/components/CommentCard'
import CommentInput from '../../comments/components/CommentInput'
import BookmarkButton from '../../bookmarks/components/BookmarkButton'

function PollOption({
  option,
  percentage,
  isSelected,
  isWinner,
  onSelect,
  disabled,
  index,
  pollType,
}) {
  const isMultiple = pollType === 'multiple';
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => !disabled && onSelect(option._id)}
      disabled={disabled}
      className={`
        relative w-full text-left p-5 rounded-xl border-2 transition-all duration-300
        ${
          isSelected
            ? 'border-brand-500 bg-brand-50/50'
            : 'border-surface-200 hover:border-surface-300 bg-white'
        }
        ${disabled ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
        className={`
          absolute inset-0 rounded-xl origin-left
          ${isWinner ? 'bg-gradient-to-r from-brand-500/10 to-brand-600/5' : 'bg-surface-50'}
        `}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`
            w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0
            ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-surface-300'}
          `}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}
            {isMultiple && !isSelected && (
              <div className="w-3 h-3 rounded-sm border-2 border-surface-300" />
            )}
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

      <div className="mt-3 h-2 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
          className={`
            h-full rounded-full
            ${isWinner ? 'bg-gradient-to-r from-brand-500 to-brand-600' : 'bg-surface-300'}
          `}
        />
      </div>
    </motion.button>
  )
}

function PollStatusBadge({ status, expiresAt, startsAt }) {
  const now = new Date();
  const isExpired = expiresAt && new Date(expiresAt) < now;
  const isScheduled = startsAt && new Date(startsAt) > now;

  if (status === 'draft') {
    return (
      <Badge variant="secondary" size="sm" dot>
        <Archive size={12} />
        Draft
      </Badge>
    );
  }
  if (isExpired || status === 'expired') {
    return (
      <Badge variant="warning" size="sm" dot>
        <Clock size={12} />
        Expired
      </Badge>
    );
  }
  if (isScheduled) {
    return (
      <Badge variant="info" size="sm" dot>
        <PlayCircle size={12} />
        Scheduled
      </Badge>
    );
  }
  if (status === 'deleted') {
    return (
      <Badge variant="danger" size="sm" dot>
        <Ban size={12} />
        Deleted
      </Badge>
    );
  }
  return (
    <Badge variant="success" size="sm" dot>
      <Vote size={12} />
      Active
    </Badge>
  );
}

export default function PollDetailPage() {
  const { id } = useParams()
  const [selectedOptions, setSelectedOptions] = useState([])
  const [showComments, setShowComments] = useState(false)

  const {
    data: poll,
    isLoading,
    error: pollError,
  } = useQuery({
    queryKey: ['poll', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/polls/${id}`)
      return data?.data || data
    },
    enabled: !!id,
  })

  const {
    myVote,
    results,
    castVote,
    changeVote,
    removeVote,
    isVoting,
  } = useVoting(id)

  const {
    comments,
    isLoading: commentsLoading,
    addComment,
    editComment,
    deleteComment,
    replyTo,
    like,
    unlike,
    pin,
    unpin,
    report,
    isAdding,
    isLiking,
    isPinning,
    isReporting,
  } = useComments(id)

  const handleVote = (optionId) => {
    if (isVoting) return;
    
    const pollType = poll?.type || 'single';
    const isMultiple = pollType === 'multiple';
    
    if (myVote) {
      if (poll?.allowVoteChange) {
        if (isMultiple) {
          const newSelected = selectedOptions.includes(optionId)
            ? selectedOptions.filter(id => id !== optionId)
            : [...selectedOptions, optionId];
          if (newSelected.length > 0) {
            setSelectedOptions(newSelected);
            changeVote(newSelected);
          }
        } else {
          setSelectedOptions([optionId]);
          changeVote([optionId]);
        }
      }
      return;
    }

    if (isMultiple) {
      const newSelected = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
      setSelectedOptions(newSelected);
      if (newSelected.length > 0) {
        castVote(newSelected);
      }
    } else {
      setSelectedOptions([optionId]);
      castVote([optionId]);
    }
  }

  const handleRemoveVote = () => {
    if (isVoting) return;
    removeVote();
    setSelectedOptions([]);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (pollError || !poll) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mx-auto mb-4">
          <Vote size={28} />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">
          Poll not found
        </h3>
        <p className="text-sm text-surface-500 mb-4">
          The poll you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const now = new Date();
  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < now;
  const isScheduled = poll.startsAt && new Date(poll.startsAt) > now;
  const isLocked = poll.status === 'draft' || poll.status === 'deleted';
  const canVote = poll.status === 'active' && !isExpired && !isScheduled && !isLocked;
  const hasVoted = !!myVote;
  const isMultiple = poll.type === 'multiple';
  const displayResults = results || {};
  
  const totalVotes = displayResults.totalVotes || poll.totalVotes || 0;
  const resultOptions = displayResults.options || poll.options?.map(opt => ({
    optionId: opt._id,
    text: opt.text,
    votes: opt.votes || 0,
    percentage: 0,
  })) || [];

  const maxVotes = Math.max(...resultOptions.map(opt => opt.votes || 0), 1);

  const getStatusMessage = () => {
    if (isLocked) return {
      icon: Lock,
      title: poll.status === 'draft' ? 'This poll is a draft' : 'This poll has been deleted',
      description: poll.status === 'draft' ? 'The poll creator hasn\'t published this poll yet.' : 'This poll is no longer available.',
    };
    if (isScheduled) return {
      icon: PlayCircle,
      title: 'This poll hasn\'t started yet',
      description: `This poll will open on ${new Date(poll.startsAt).toLocaleDateString()}.`,
    };
    if (isExpired) return {
      icon: Clock,
      title: 'This poll has expired',
      description: `This poll ended on ${new Date(poll.expiresAt).toLocaleDateString()}.`,
    };
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/dashboard">
        <Button variant="ghost" size="sm">
          <ArrowLeft size={18} />
          Back
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
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
              <div className="flex items-center gap-2">
                <PollStatusBadge
                  status={poll.status}
                  expiresAt={poll.expiresAt}
                  startsAt={poll.startsAt}
                />
                <Dropdown
                  trigger={
                    <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  }
                  items={[
                    {
                      label: 'Share',
                      icon: <Share2 size={16} />,
                      onClick: () => {},
                    },
                    {
                      label: 'Report',
                      icon: <Flag size={16} />,
                      onClick: () => {},
                    },
                  ]}
                  align="right"
                />
              </div>
            </div>

            {/* Category & Title */}
            <div className="mt-6">
              <Badge variant="secondary" size="sm" className="mb-3">
                {poll.category || 'General'}
              </Badge>
              <h1 className="text-2xl font-bold text-surface-900 leading-tight">
                {poll.title}
              </h1>
              {poll.description && (
                <p className="text-base text-surface-600 mt-3 leading-relaxed">
                  {poll.description}
                </p>
              )}
            </div>
          </div>

          {/* Poll options or results */}
          <div className="px-8 pb-6">
            {statusMessage ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 mb-4">
                  <statusMessage.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-1">
                  {statusMessage.title}
                </h3>
                <p className="text-sm text-surface-500 max-w-md">
                  {statusMessage.description}
                </p>
              </div>
            ) : canVote ? (
              <div className="space-y-3">
                {poll.options?.map((option, idx) => {
                  const percentage = hasVoted
                    ? Math.round((option.votes / totalVotes) * 100)
                    : 0
                  const isWinner = hasVoted && option.votes === maxVotes
                  const isSelected = selectedOptions.includes(option._id)
                  
                  return (
                    <PollOption
                      key={option._id || idx}
                      option={option}
                      percentage={hasVoted ? percentage : 0}
                      isSelected={isSelected}
                      isWinner={isWinner}
                      onSelect={handleVote}
                      disabled={hasVoted && !poll.allowVoteChange}
                      index={idx}
                      pollType={poll.type}
                    />
                  )
                })}
              </div>
            ) : (
              <VoteResults
                options={resultOptions}
                totalVotes={totalVotes}
                pollType={poll.type}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-surface-100 bg-surface-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Vote size={16} />
                  <span className="font-medium">
                    {totalVotes.toLocaleString()} votes
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Eye size={16} />
                  <span className="font-medium">
                    {poll.views?.toLocaleString() || 0} views
                  </span>
                </span>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span className="font-medium">
                    {poll.commentsCount || 0}
                  </span>
                </button>
                <span className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Clock size={16} />
                  <span className="font-medium">
                    {poll.expiresAt
                      ? `Ends ${new Date(poll.expiresAt).toLocaleDateString()}`
                      : 'No end date'}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookmarkButton pollId={poll._id} />
                <Button variant="ghost" size="sm" icon={<Share2 size={16} />} />
              </div>
            </div>
            
            {canVote && (
              <div className="mt-4 pt-4 border-t border-surface-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isVoting && (
                      <div className="flex items-center gap-2 text-sm text-surface-500">
                        <Loader2 size={16} className="animate-spin" />
                        Submitting vote...
                      </div>
                    )}
                    {hasVoted && poll.allowVoteChange && !isVoting && (
                      <p className="text-sm text-surface-500">
                        You can change your vote as long as this poll is active.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasVoted && poll.allowVoteChange ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          disabled={isVoting || selectedOptions.length === 0}
                          loading={isVoting}
                          onClick={() => {
                            if (isMultiple && selectedOptions.length > 0) {
                              changeVote(selectedOptions);
                            } else if (!isMultiple && selectedOptions.length === 1) {
                              changeVote(selectedOptions);
                            }
                          }}
                          icon={<Vote size={16} />}
                        >
                          {isMultiple ? `Change Vote (${selectedOptions.length})` : 'Change Vote'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isVoting}
                          onClick={handleRemoveVote}
                          icon={<Ban size={16} />}
                        >
                          Remove
                        </Button>
                      </>
                    ) : !hasVoted && !isVoting ? (
                      <Button
                        variant="default"
                        size="sm"
                        disabled={selectedOptions.length === 0}
                        onClick={() => {
                          if (isMultiple && selectedOptions.length > 0) {
                            castVote(selectedOptions);
                          } else if (!isMultiple && selectedOptions.length === 1) {
                            castVote(selectedOptions);
                          }
                        }}
                        icon={<Vote size={16} />}
                      >
                        {isMultiple ? `Vote (${selectedOptions.length})` : 'Vote'}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Comments
            </h3>
            <CommentInput
              onSubmit={addComment}
              placeholder="Write a comment..."
              disabled={isAdding}
            />
            <div className="mt-6 space-y-1">
              {commentsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment, index) => (
                  <CommentCard
                    key={comment._id || index}
                    comment={comment}
                    currentUserId={null}
                    pollOwnerId={poll?.createdBy?._id}
                    onReply={replyTo}
                    onEdit={editComment}
                    onDelete={deleteComment}
                    onLike={like}
                    onUnlike={unlike}
                    onPin={pin}
                    onUnpin={unpin}
                    onReport={report}
                    isLiking={isLiking}
                    isReplying={false}
                    isPinning={isPinning}
                    isReporting={isReporting}
                    index={index}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle
                    className="mx-auto text-surface-400 mb-3"
                    size={32}
                  />
                  <p className="text-sm text-surface-500">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
