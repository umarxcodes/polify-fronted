import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from "framer-motion";
import { Flag, MoreHorizontal } from 'lucide-react'
import { reportService } from '../services/reportService'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Dropdown } from '../../../components/ui/Dropdown'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
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
        <ErrorState
          error={error.message}
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['reports'] })}
          title="Failed to load reports"
        />
      )}

      {!isLoading && !error && (
        items.length ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
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
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="empty"
            title="No reports yet"
            description="All clear! No reported content to review."
            icon={Flag}
          />
        )
      )}
    </motion.div>
  )
}