import { useState } from 'react'
import { settingsService } from '../services/settingsService'

export const useSettings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await settingsService.getSettings()
      setSettings(data)
      return data
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load settings')
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await settingsService.updateSettings(payload)
      setSettings(data)
      return data
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to save settings')
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { settings, fetchSettings, updateSettings, loading, error }
}
