import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { apiClient } from '../../../lib/axios'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Skeleton } from '../../../components/ui/Skeleton'
import { toast } from 'sonner'

const unwrap = (response) => response.data?.data

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => unwrap(await apiClient.get('/notifications')),
  })

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  const markAll = useMutation({
    mutationFn: () => apiClient.patch('/notifications/read-all'),
    onSuccess: refresh,
  })
  const markRead = useMutation({
    mutationFn: (id) => apiClient.patch(`/notifications/${id}/read`),
    onSuccess: refresh,
    onError: () => toast.error('Could not update notification'),
  })
  const remove = useMutation({
    mutationFn: (id) => apiClient.delete(`/notifications/${id}`),
    onSuccess: refresh,
  })

  const items = query.data?.notifications || query.data || []

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Notifications</h1>
          <p className="mt-1 text-surface-500">
            Keep up with votes, replies, and activity.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          loading={markAll.isPending}
          onClick={() => markAll.mutate()}
          icon={<CheckCheck size={16} />}
        >
          Mark all read
        </Button>
      </div>

      {query.isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {query.isError && (
        <Card className="p-8 text-center text-surface-500">
          Couldn’t load notifications.
        </Card>
      )}

      {!query.isLoading &&
        !query.isError &&
        (items.length ? (
          <div className="space-y-3">
            {items.map((n) => (
              <Card
                key={n._id}
                className={`p-4 flex gap-4 ${n.isRead ? '' : 'border-brand-200 bg-brand-50/30'}`}
              >
                <Bell className="mt-0.5 shrink-0 text-brand-600" size={19} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900">
                    {n.title || n.type || 'New activity'}
                  </p>
                  <p className="mt-1 text-sm text-surface-600">{n.message}</p>
                  <p className="mt-1 text-xs text-surface-400">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : 'Just now'}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markRead.mutate(n._id)}
                      icon={<CheckCheck size={16} />}
                      aria-label="Mark as read"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove.mutate(n._id)}
                    icon={<Trash2 size={16} />}
                    aria-label="Delete notification"
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Bell className="mx-auto text-surface-400" size={32} />
            <p className="mt-4 text-surface-500">You’re all caught up.</p>
          </Card>
        ))}
    </div>
  )
}
