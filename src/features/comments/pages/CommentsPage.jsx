import { useParams } from "react-router-dom";
import { useState } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
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

  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Comments</h1>
            <p className="text-surface-400 mt-1">Join the conversation</p>
          </div>
        </div>
        <Card dark className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mx-auto mb-4">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-1">
            Failed to load comments
          </h3>
          <p className="text-sm text-surface-500 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="secondary">
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Comments</h1>
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
          ) : comments.length > 0 ? (
            <div className="space-y-1">
              {comments.map((comment, index) => (
                <CommentCard
                  key={comment._id || index}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-lg font-semibold text-surface-200 mb-1">
                No comments yet
              </h3>
              <p className="text-sm text-surface-400">
                Be the first to start the discussion!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
