import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, MoreHorizontal, Pin, Flag, Trash2, Edit3 } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
import CommentInput from "./CommentInput";
import ReportDialog from "./ReportDialog";

export default function CommentCard({
  comment,
  currentUserId,
  pollOwnerId,
  isReplying,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onUnlike,
  onPin,
  onUnpin,
  onReport,
  isLiking,
  isReporting,
  index,
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditingLocal, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const isAuthor = currentUserId && comment.userId?._id === currentUserId;
  const isPollOwner = currentUserId && pollOwnerId === currentUserId;
  const canEdit = isAuthor && !comment.isDeleted;
  const canDelete = isAuthor && !comment.isDeleted;
  const canReply = currentUserId && !comment.isDeleted;
  const canPin = isPollOwner && !comment.isDeleted;
  const canReport = currentUserId && !isAuthor && !comment.isDeleted;

  const handleReplySubmit = async (content) => {
    await onReply({ commentId: comment._id, content });
    setShowReplyInput(false);
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    await onEdit({ commentId: comment._id, content: editContent.trim() });
    setIsEditing(false);
  };

  const handleLike = () => {
    if (comment.hasLiked) {
      onUnlike(comment._id);
    } else {
      onLike(comment._id);
    }
  };

  const menuItems = [
    ...(canPin && !comment.isPinned
      ? [{ label: "Pin comment", icon: Pin, onClick: () => onPin(comment._id) }]
      : []),
    ...(canPin && comment.isPinned
      ? [{ label: "Unpin comment", icon: Pin, onClick: () => onUnpin(comment._id) }]
      : []),
    ...(canEdit
      ? [{ label: "Edit", icon: Edit3, onClick: () => setIsEditing(true) }]
      : []),
    ...(canDelete
      ? [{ label: "Delete", icon: Trash2, onClick: () => onDelete(comment._id) }]
      : []),
    ...(canReport
      ? [{ label: "Report", icon: Flag, onClick: () => setShowReportDialog(true) }]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex gap-3 p-4 rounded-xl transition-colors ${
        comment.isPinned ? "bg-brand-50/50 border border-brand-100" : "hover:bg-surface-50"
      }`}
    >
      <Avatar fallback={comment.userId?.name?.[0] || "U"} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-surface-900">
              {comment.userId?.name || "Anonymous"}
            </span>
            {comment.isPinned && (
              <Badge variant="primary" size="sm" dot>
                <Pin size={10} />
                Pinned
              </Badge>
            )}
            {comment.isEdited && (
              <span className="text-xs text-surface-400">(edited)</span>
            )}
            <span className="text-xs text-surface-400">
              {comment.timeAgo || "Recently"}
            </span>
          </div>
          {menuItems.length > 0 && (
            <Dropdown
              trigger={
                <button className="p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              }
              items={menuItems}
              align="right"
            />
          )}
        </div>

            {isEditingLocal ? (
              <div className="mt-2 space-y-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="xs" onClick={handleEditSubmit} disabled={isEditingLocal}>
                    {isEditingLocal ? "Saving..." : "Save"}
                  </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-surface-700 mt-1 whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleLike}
                disabled={!currentUserId || isLiking}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  comment.hasLiked
                    ? "text-danger-600"
                    : "text-surface-500 hover:text-danger-600"
                }`}
              >
                <Heart
                  size={14}
                  fill={comment.hasLiked ? "currentColor" : "none"}
                />
                <span>{comment.likesCount || 0}</span>
              </button>
              {canReply && (
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-brand-600 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>Reply</span>
                </button>
              )}
              {comment.repliesCount > 0 && (
                <span className="text-xs text-surface-400">
                  {comment.repliesCount} repl{comment.repliesCount === 1 ? "y" : "ies"}
                </span>
              )}
            </div>
          </>
        )}

        {showReplyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3"
          >
            <CommentInput
              onSubmit={handleReplySubmit}
              placeholder="Write a reply..."
              disabled={isReplying}
            />
          </motion.div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-2 pl-4 border-l-2 border-surface-200">
            {comment.replies.map((reply, idx) => (
              <div
                key={reply._id || idx}
                className="flex gap-2 p-3 rounded-lg bg-surface-50/50"
              >
                <Avatar fallback={reply.userId?.name?.[0] || "U"} size="xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-surface-900">
                      {reply.userId?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-surface-400">
                      {reply.timeAgo || "Recently"}
                    </span>
                    {reply.isEdited && (
                      <span className="text-xs text-surface-400">(edited)</span>
                    )}
                  </div>
                  <p className="text-sm text-surface-700 mt-0.5 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => (reply.hasLiked ? onUnlike(reply._id) : onLike(reply._id))}
                      disabled={!currentUserId || isLiking}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        reply.hasLiked
                          ? "text-danger-600"
                          : "text-surface-500 hover:text-danger-600"
                      }`}
                    >
                      <Heart
                        size={12}
                        fill={reply.hasLiked ? "currentColor" : "none"}
                      />
                      <span>{reply.likesCount || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        onSubmit={({ reason }) => {
          onReport({ commentId: comment._id, reason });
          setShowReportDialog(false);
        }}
        isReporting={isReporting}
      />
    </motion.div>
  );
}
