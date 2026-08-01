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
import { setAuthToken, setUnauthorizedHandler } from '../lib/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = useCallback(() => {
    setAuthToken(null)
    setUser(null)
  }, [])

  const establishSession = useCallback((session) => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken)
    } else {
      setAuthToken(null)
    }
    setUser(session?.user ?? null)
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
      try {
        await authService.getCsrfToken()
        const session = await authService.refreshToken()
        if (!active) return

        if (session?.accessToken) {
          setAuthToken(session.accessToken)
        } else {
          clearAuth()
          return
        }

        const currentUser = await authService.getMe()
        if (active && currentUser) {
          setUser(currentUser)
        }
      } catch {
        if (active) {
          clearAuth()
        }
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
    () => ({ user, isLoading, establishSession, signOut }),
    [user, isLoading, establishSession, signOut]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
