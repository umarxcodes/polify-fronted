import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../../lib/axios'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Skeleton } from '../../../components/ui/Skeleton'
import { toast } from 'sonner'

const unwrap = (response) => response.data?.data

export default function BookmarksPage() {
  const queryClient = useQueryClient()
  const bookmarks = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => unwrap(await apiClient.get('/bookmarks')),
  })

  const remove = useMutation({
    mutationFn: (pollId) => apiClient.delete(`/bookmarks/${pollId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      toast.success('Bookmark removed')
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || 'Could not remove bookmark'),
  })

  const items = bookmarks.data?.bookmarks || bookmarks.data || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900">Bookmarks</h1>
        <p className="mt-1 text-surface-500">
          Polls you saved to revisit later.
        </p>
      </div>

      {bookmarks.isLoading && (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {bookmarks.isError && (
        <Card className="p-8 text-center text-surface-500">
          We couldn’t load your bookmarks.
          <Button
            size="sm"
            className="ml-2"
            onClick={() => bookmarks.refetch()}
          >
            Try again
          </Button>
        </Card>
      )}

      {!bookmarks.isLoading &&
        !bookmarks.isError &&
        (items.length ? (
          <div className="space-y-3">
            {items.map((item) => {
              const poll = item.pollId || item.poll || item
              return (
                <Card
                  key={item._id || poll._id}
                  className="p-5 flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
                    <Bookmark size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-surface-900 truncate">
                      {poll.title}
                    </p>
                    <p className="mt-1 text-sm text-surface-500">
                      {poll.category || 'General'} · {poll.totalVotes || 0}{' '}
                      votes
                    </p>
                  </div>
                  <Link to={`/polls/${poll._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<ExternalLink size={16} />}
                    >
                      Open
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={remove.isPending}
                    onClick={() => remove.mutate(poll._id)}
                    icon={<Trash2 size={16} />}
                    aria-label="Remove bookmark"
                  />
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Bookmark className="mx-auto text-surface-400" size={32} />
            <h2 className="mt-4 font-semibold text-surface-900">
              No saved polls yet
            </h2>
            <Link to="/search">
              <Button className="mt-4">Explore polls</Button>
            </Link>
          </Card>
        ))}
    </div>
  )
}
