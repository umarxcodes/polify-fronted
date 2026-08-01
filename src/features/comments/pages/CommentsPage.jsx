import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Avatar } from "../../../components/ui/Avatar";
import { toast } from "sonner";

function CommentItem({ comment, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3 p-4 rounded-xl hover:bg-surface-50 transition-colors"
    >
      <Avatar fallback={comment.user?.name?.[0] || "U"} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-surface-900">{comment.user?.name || "Anonymous"}</span>
          <span className="text-xs text-surface-400">{comment.timeAgo || "Recently"}</span>
        </div>
        <p className="text-sm text-surface-600 mt-1">{comment.text}</p>
      </div>
    </motion.div>
  );
}

export default function CommentsPage() {
  const { pollId } = useParams();
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ["comments", pollId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/comments/polls/${pollId}/comments`);
      return data?.data?.comments || data?.comments || data?.data || data || [];
    },
    enabled: Boolean(pollId),
  });

  const commentMutation = useMutation({
    mutationFn: (text) => apiClient.post(`/comments/polls/${pollId}/comments`, { text }),
    onSuccess: () => {
      setNewComment("");
      toast.success("Comment added");
    },
    onError: () => toast.error("Failed to add comment"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mx-auto mb-4">
          <MessageCircle size={28} />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">Failed to load comments</h3>
        <p className="text-sm text-surface-500 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Comments</h1>
        <p className="text-surface-500 mt-2">Join the conversation.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
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

        {isLoading ? (
          <div className="space-y-3">
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
          <div className="space-y-1">
            {comments.map((comment, index) => (
              <CommentItem key={comment._id || index} comment={comment} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto text-surface-400 mb-3" size={32} />
            <p className="text-sm text-surface-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </Card>
    </div>
  );
}
