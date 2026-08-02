import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { motion } from "framer-motion";
import { Card } from '../../../components/ui/Card'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Input } from '../../../components/ui/Input'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { useBookmarks } from "../hooks/useBookmarks";
import BookmarkCard from "../components/BookmarkCard";

export default function BookmarksPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const navigate = useNavigate();

  const { bookmarks, isLoading, error, refetch, removeBookmark, isRemoving } = useBookmarks({
    search,
    sort,
    page: 1,
    limit: 20,
  });

  const handleRemove = (pollId) => {
    removeBookmark(pollId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Bookmarks</h1>
          <p className="text-surface-400 mt-1">Your saved polls</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input w-40"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} dark className="p-5">
              <div className="space-y-3">
                <Skeleton dark className="h-5 w-3/4" />
                <Skeleton dark className="h-4 w-full" />
                <div className="flex gap-4">
                  <Skeleton dark className="h-4 w-20" />
                  <Skeleton dark className="h-4 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <ErrorState
          error={error.message}
          onRetry={() => refetch()}
          title="Failed to load bookmarks"
          dark
        />
      )}

      {!isLoading && !error && bookmarks.length > 0 && (
        <div className="space-y-4">
          {bookmarks.map((bookmark, index) => (
            <motion.div
              key={bookmark._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BookmarkCard
                bookmark={bookmark}
                index={index}
                onRemove={{ remove: handleRemove, isRemoving }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && !error && bookmarks.length === 0 && (
        <EmptyState
          type="empty"
          title="No bookmarks yet"
          description="Save interesting polls to access them later"
          action={{ label: "Explore Polls", onClick: () => navigate("/dashboard") }}
          icon={Bookmark}
          dark
        />
      )}
    </motion.div>
  );
}