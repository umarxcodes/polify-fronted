import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Vote,
  Clock,
  Eye,
  Share2,
  Bookmark,
  TrendingUp,
  ArrowLeft,
  MoreHorizontal,
  Flag,
  MessageCircle,
  Send,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
import { toast } from "sonner";

function PollOption({ option, percentage, isSelected, isWinner, onSelect, disabled, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => !disabled && onSelect(option._id)}
      disabled={disabled}
      className={`
        relative w-full text-left p-5 rounded-xl border-2 transition-all duration-300
        ${isSelected
          ? "border-brand-500 bg-brand-50/50"
          : "border-surface-200 hover:border-surface-300 bg-white"
        }
        ${disabled ? "cursor-default" : "cursor-pointer"}
      `}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
        className={`
          absolute inset-0 rounded-xl origin-left
          ${isWinner ? "bg-gradient-to-r from-brand-500/10 to-brand-600/5" : "bg-surface-50"}
        `}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`
            w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0
            ${isSelected ? "border-brand-500 bg-brand-500" : "border-surface-300"}
          `}>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}
          </div>
          <span className="text-sm font-medium text-surface-900">{option.text}</span>
        </div>
        <div className="flex items-center gap-2">
          {isWinner && (
            <Badge variant="success" size="sm" className="hidden sm:flex">
              <TrendingUp size={12} />
              Leading
            </Badge>
          )}
          <span className={`text-sm font-bold ${isSelected ? "text-brand-600" : "text-surface-900"}`}>
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
            ${isWinner ? "bg-gradient-to-r from-brand-500 to-brand-600" : "bg-surface-300"}
          `}
        />
      </div>
    </motion.button>
  );
}

function CommentItem({ comment, onReply }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl hover:bg-surface-50 transition-colors">
      <Avatar fallback={comment.user?.name?.[0] || "U"} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-surface-900">{comment.user?.name || "Anonymous"}</span>
          <span className="text-xs text-surface-400">{comment.timeAgo || "Recently"}</span>
        </div>
        <p className="text-sm text-surface-600 mt-1">{comment.text}</p>
        <div className="flex items-center gap-3 mt-2">
          <button className="text-xs text-surface-500 hover:text-brand-600 transition-colors">Like</button>
          <button className="text-xs text-surface-500 hover:text-brand-600 transition-colors" onClick={() => onReply?.(comment._id)}>Reply</button>
        </div>
      </div>
    </div>
  );
}

export default function PollDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { data: poll, isLoading, error } = useQuery({
    queryKey: ["poll", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/polls/${id}`);
      return data?.data || data;
    },
    enabled: !!id,
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/comments/polls/${id}/comments`);
      return data?.data || data || [];
    },
    enabled: !!id && showComments,
  });

  const voteMutation = useMutation({
    mutationFn: ({ optionId, action }) => {
      if (action === "vote") return apiClient.post(`/votes/polls/${id}/vote`, { optionId });
      if (action === "change") return apiClient.patch(`/votes/polls/${id}/vote`, { optionId });
      return apiClient.delete(`/votes/polls/${id}/vote`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["poll", id] });
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      if (variables.action === "vote" || variables.action === "change") {
        setSelectedOption(variables.optionId);
        setHasVoted(true);
        setVoteCount(prev => prev + 1);
      }
      toast.success("Vote recorded!");
    },
    onError: () => toast.error("Voting failed"),
  });

  const commentMutation = useMutation({
    mutationFn: (text) => apiClient.post(`/comments/polls/${id}/comments`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setNewComment("");
      toast.success("Comment added");
    },
    onError: () => toast.error("Failed to add comment"),
  });

  const handleVote = (optionId) => {
    if (hasVoted) return;
    voteMutation.mutate({ optionId, action: "vote" });
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
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
    );
  }

  if (error || !poll) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mx-auto mb-4">
          <Vote size={28} />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">Poll not found</h3>
        <p className="text-sm text-surface-500 mb-4">The poll you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const totalVotes = voteCount || poll.totalVotes || poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 1;
  const maxVotes = Math.max(...(poll.options?.map(opt => opt.votes || 0) || [1]));
  const commentsList = comments?.comments || comments || [];

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
                <Avatar fallback={poll.createdBy?.name?.[0] || "U"} color="brand" size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-surface-900">
                      {poll.createdBy?.name || "Anonymous"}
                    </span>
                    {poll.isVerified && <Badge variant="primary" size="sm" dot>Verified</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-surface-500">@{poll.createdBy?.username || "user"}</span>
                    <span className="text-xs text-surface-400">·</span>
                    <span className="text-xs text-surface-500">{poll.timeAgo || "2h"}</span>
                  </div>
                </div>
              </div>
              <Dropdown
                trigger={<button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"><MoreHorizontal size={18} /></button>}
                items={[
                  { label: "Share", icon: <Share2 size={16} />, onClick: () => {} },
                  { label: "Report", icon: <Flag size={16} />, onClick: () => {} },
                ]}
                align="right"
              />
            </div>

            {/* Category & Title */}
            <div className="mt-6">
              <Badge variant="secondary" size="sm" className="mb-3">
                {poll.category || "General"}
              </Badge>
              <h1 className="text-2xl font-bold text-surface-900 leading-tight">{poll.title}</h1>
              {poll.description && (
                <p className="text-base text-surface-600 mt-3 leading-relaxed">{poll.description}</p>
              )}
            </div>
          </div>

          {/* Poll options */}
          <div className="px-8 pb-6">
            <div className="space-y-3">
              {poll.options?.map((option, idx) => {
                const percentage = hasVoted ? Math.round((option.votes / totalVotes) * 100) : 0;
                const isWinner = hasVoted && option.votes === maxVotes;
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
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-surface-100 bg-surface-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Vote size={16} />
                  <span className="font-medium">{totalVotes.toLocaleString()} votes</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Eye size={16} />
                  <span className="font-medium">{poll.views?.toLocaleString() || 0} views</span>
                </span>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span className="font-medium">{poll.commentsCount || commentsList.length || 0}</span>
                </button>
                <span className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Clock size={16} />
                  <span className="font-medium">{poll.expiresAt ? `Ends ${new Date(poll.expiresAt).toLocaleDateString()}` : "No end date"}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={<Bookmark size={16} />} />
                <Button variant="ghost" size="sm" icon={<Share2 size={16} />} />
              </div>
            </div>
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
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Comments</h3>
            <form onSubmit={handleComment} className="flex gap-3 mb-6">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" icon={<Send size={16} />} disabled={!newComment.trim()}>
                Post
              </Button>
            </form>
            <div className="space-y-1">
              {commentsList.length > 0 ? (
                commentsList.map((comment) => (
                  <CommentItem key={comment._id} comment={comment} />
                ))
              ) : (
                <p className="text-sm text-surface-500 text-center py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
