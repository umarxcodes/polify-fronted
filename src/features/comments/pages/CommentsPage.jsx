import { useParams } from "react-router-dom";
import { useState } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { useComments } from "../hooks/useComments";
import CommentInput from "../components/CommentInput";
import CommentCard from "../components/CommentCard";

function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export default function CommentsPage() {
  const { pollId } = useParams();
  const [sort, setSort] = useState("newest");

  const {
    comments,
    isLoading,
    error,
    refetch,
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
  } = useComments(pollId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Comments</h1>
            <p className="text-surface-400 mt-1">Join the conversation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {["newest", "oldest", "most_liked"].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sort === s
                  ? "bg-brand-500 text-white"
                  : "bg-surface-800 text-surface-400 hover:text-surface-200"
              }`}
            >
              {s === "newest"
                ? "Newest"
                : s === "oldest"
                  ? "Oldest"
                  : "Most Liked"}
            </button>
          ))}
        </div>
      </div>

      <Card dark className="p-6">
        <CommentInput
          onSubmit={addComment}
          placeholder="Write a comment..."
          disabled={isAdding}
        />

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              error={error.message}
              onRetry={() => refetch()}
              title="Failed to load comments"
              dark
            />
          ) : comments.length > 0 ? (
            <div className="space-y-1">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CommentCard
                    comment={comment}
                    currentUserId={null}
                    pollOwnerId={null}
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
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              type="empty"
              title="No comments yet"
              description="Be the first to start the discussion!"
              icon={MessageCircle}
              dark
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}