import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Vote, Eye, Trash2, ExternalLink } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export default function BookmarkCard({ bookmark, index, onRemove }) {
  const poll = bookmark.poll || bookmark.pollId || bookmark;
  const savedAt = bookmark.savedAt || bookmark.createdAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">
                {poll.category || "General"}
              </Badge>
              <span className="text-xs text-surface-400">
                Saved {savedAt ? new Date(savedAt).toLocaleDateString() : "Recently"}
              </span>
            </div>
            <Link to={`/polls/${poll._id}`}>
              <h4 className="text-base font-semibold text-surface-900 hover:text-brand-600 transition-colors truncate">
                {poll.title}
              </h4>
            </Link>
            {poll.description && (
              <p className="text-sm text-surface-600 mt-1 line-clamp-2">
                {poll.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Vote size={14} />
                {poll.totalVotes?.toLocaleString() || 0} votes
              </span>
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Eye size={14} />
                {poll.views?.toLocaleString() || 0} views
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to={`/polls/${poll._id}`}>
              <Button variant="ghost" size="sm" icon={<ExternalLink size={16} />} />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              loading={onRemove.isRemoving}
              onClick={() => onRemove.remove(poll._id)}
              icon={<Trash2 size={16} />}
              aria-label="Remove bookmark"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
