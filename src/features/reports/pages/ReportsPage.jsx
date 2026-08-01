import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Flag, MoreHorizontal } from 'lucide-react'
import { reportService } from '../services/reportService'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Dropdown } from '../../../components/ui/Dropdown'
import { toast } from 'sonner'

const unwrap = (response) => response.data?.data

export default function ReportsPage() {
  const queryClient = useQueryClient()

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => unwrap(await reportService.getReports()),
  })

  const reviewMutation = useMutation({
    mutationFn: ({ id, status }) => reportService.reviewReport(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Report updated')
    },
    onError: () => toast.error('Failed to update report'),
  })

  const items = reports?.reports || reports?.data?.reports || reports || []

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'reviewed': return 'info'
      case 'resolved': return 'success'
      case 'rejected': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900">Reports</h1>
        <p className="mt-1 text-surface-500">
          Review and manage reported content.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <Card className="p-8 text-center text-surface-500">
          We couldn't load your reports.
          <Button size="sm" className="ml-2" onClick={() => queryClient.invalidateQueries({ queryKey: ['reports'] })}>
            Try again
          </Button>
        </Card>
      )}

      {!isLoading && !error && (
        items.length ? (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item._id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-danger-50 text-danger-600">
                      <Flag size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-surface-900 truncate">
                          {item.reason || 'Reported content'}
                        </h3>
                        <Badge variant={getStatusVariant(item.status)} size="sm">
                          {item.status || 'pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-surface-500 line-clamp-2">
                        {item.description || 'No description provided'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-surface-400">
                          {item.targetType || 'Content'}
                        </span>
                        <span className="text-xs text-surface-400">·</span>
                        <span className="text-xs text-surface-400">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Dropdown
                    trigger={<button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"><MoreHorizontal size={18} /></button>}
                    items={[
                      { label: 'Mark as reviewed', onClick: () => reviewMutation.mutate({ id: item._id, status: 'reviewed' }) },
                      { label: 'Resolve', onClick: () => reviewMutation.mutate({ id: item._id, status: 'resolved' }) },
                      { label: 'Reject', onClick: () => reviewMutation.mutate({ id: item._id, status: 'rejected' }), danger: true },
                    ]}
                    align="right"
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Flag className="mx-auto text-surface-400" size={32} />
            <h2 className="mt-4 font-semibold text-surface-900">No reports yet</h2>
            <p className="mt-1 text-sm text-surface-500">All clear! No reported content to review.</p>
          </Card>
        )
      )}
    </div>
  )
}
