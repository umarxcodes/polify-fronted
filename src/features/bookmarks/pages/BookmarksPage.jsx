import { useState } from "react";
import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Input } from '../../../components/ui/Input'
import { useBookmarks } from "../hooks/useBookmarks";
import BookmarkCard from "../components/BookmarkCard";

export default function BookmarksPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const { bookmarks, isLoading, error, refetch, removeBookmark } = useBookmarks({
    search,
    sort,
    page: 1,
    limit: 20,
  });

  const handleRemove = (pollId) => {
    removeBookmark(pollId);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Bookmarks</h1>
          <p className="text-surface-400 mt-1">Your saved polls</p>
        </div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-danger-500">{error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">Try again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Bookmarks</h1>
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

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark, index) => (
            <BookmarkCard
              key={bookmark._id || index}
              bookmark={bookmark}
              index={index}
              onRemove={{ remove: handleRemove, isRemoving: false }}
            />
          ))}
        </div>
      ) : (
        <Card dark className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-4">
            <Bookmark size={28} />
          </div>
          <h3 className="text-lg font-semibold text-surface-200 mb-1">No bookmarks yet</h3>
          <p className="text-sm text-surface-400 mb-4">Save interesting polls to access them later</p>
          <Link to="/dashboard">
            <Button variant="primary">Explore Polls</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
