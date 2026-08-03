/* eslint-disable react-refresh/only-export-components */
/** Authentication state backed by the API's access-token and refresh-cookie flow. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { authService } from '../features/auth/services/authService'
import {
  getAuthToken,
  refreshAccessToken,
  setAuthToken,
  setUnauthorizedHandler,
} from '../lib/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [restoreError, setRestoreError] = useState(null)

  const clearAuth = useCallback(() => {
    setAuthToken(null)
    setUser(null)
    setRestoreError(null)
  }, [])

  const establishSession = useCallback((session) => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken)
    } else {
      setAuthToken(null)
    }
    setUser(session?.user ?? null)
    setRestoreError(null)
  }, [])

  const signOut = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      /* Local logout still protects the UI. */
    }
    clearAuth()
  }, [clearAuth])

  useEffect(() => {
    let active = true
    const restoreSession = async () => {
      setIsLoading(true)
      setRestoreError(null)
      try {
        if (!getAuthToken()) {
          await authService.getCsrfToken().catch(() => undefined)
          const accessToken = await refreshAccessToken()
          if (!accessToken) throw new Error('No access token returned')
          setAuthToken(accessToken)
        }

        const currentUser = await authService.getMe()
        if (!currentUser) throw new Error('No authenticated user returned')
        if (active) {
          setUser(currentUser)
          setRestoreError(null)
        }
      } catch (error) {
        if (!active) return
        const status = error?.response?.status
        const isAuthFailure = status === 401 || error?.message === 'No access token returned'
        if (isAuthFailure) {
          await authService.getCsrfToken().catch(() => undefined)
          try {
            const accessToken = await refreshAccessToken()
            if (accessToken && active) {
              setAuthToken(accessToken)
              const currentUser = await authService.getMe()
              if (currentUser && active) {
                setUser(currentUser)
                setRestoreError(null)
                return
              }
            }
          } catch {
            // fall through to clear auth
          }
        }
        clearAuth()
      } finally {
        if (active) setIsLoading(false)
      }
    }

    restoreSession()
    return () => {
      active = false
    }
  }, [clearAuth])

  useEffect(() => {
    setUnauthorizedHandler(clearAuth)
    return () => {
      setUnauthorizedHandler(null)
    }
  }, [clearAuth])

  const value = useMemo(
    () => ({ user, isLoading, restoreError, establishSession, signOut }),
    [user, isLoading, restoreError, establishSession, signOut]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
