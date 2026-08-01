import { useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'

const SettingsPage = () => {
  const { fetchSettings, settings, loading, error } = useSettings()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return (
    <div className="max-w-4xl p-6">
      <h1 className="text-2xl font-semibold text-surface-900">Settings</h1>
      {loading && (
        <p className="mt-4 text-sm text-surface-500">Loading settings…</p>
      )}
      {error && <p className="mt-4 text-sm text-danger-600">{error.message}</p>}
      {settings && (
        <pre className="mt-4 overflow-auto rounded-xl bg-surface-900 p-4 text-sm text-surface-100">
          {JSON.stringify(settings, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default SettingsPage
