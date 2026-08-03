import { Skeleton } from "../../../components/ui/Skeleton";

export function ChartCard({ title, children, loading, error, onRetry, dark = true, action }) {
  if (loading) {
    return (
      <div
        className={`
          rounded-2xl p-6
          ${dark ? "bg-surface-800/80 border border-surface-700/50" : "bg-white border border-surface-200"}
        `}
      >
        <Skeleton dark={dark} className="h-5 w-40 mb-4" />
        <Skeleton dark={dark} className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`
          rounded-2xl p-6 flex flex-col items-center justify-center
          ${dark ? "bg-surface-800/80 border border-surface-700/50" : "bg-white border border-surface-200"}
        `}
      >
        <p className={`text-sm ${dark ? "text-surface-400" : "text-surface-500"} mb-3`}>
          Failed to load chart
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-2xl p-6
        ${dark ? "bg-surface-800/80 border border-surface-700/50" : "bg-white border border-surface-200"}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-base font-semibold ${dark ? "text-white" : "text-surface-900"}`}>
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function EmptyChart({ message = "No data available", dark = true }) {
  return (
    <div
      className={`
        rounded-2xl p-6 flex flex-col items-center justify-center
        ${dark ? "bg-surface-800/80 border border-surface-700/50" : "bg-white border border-surface-200"}
      `}
    >
      <p className={`text-sm ${dark ? "text-surface-400" : "text-surface-500"}`}>
        {message}
      </p>
    </div>
  );
}
