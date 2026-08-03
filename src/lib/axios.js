/**
 * Shared API transport. Access tokens stay in memory while the backend owns the
 * HttpOnly refresh cookie; this keeps a page refresh from exposing a token.
 */
import axios from 'axios'
import { API_BASE_URL } from '../constants/api'

const AUTH_TOKEN_KEY = 'pollify_access_token'

let accessToken = null
let refreshPromise = null
let unauthorizedHandler = null
let csrfTokenValue = null

function readStoredToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

function writeStoredToken(token) {
  if (typeof window === 'undefined') return
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export function setAuthToken(token) {
  accessToken = token || null
  writeStoredToken(accessToken)
}

export function getAuthToken() {
  return accessToken ?? readStoredToken()
}

export function hasAuthToken() {
  return Boolean(getAuthToken())
}

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler
}

const persistedToken = readStoredToken()
if (persistedToken) {
  accessToken = persistedToken
}

function csrfToken() {
  if (csrfTokenValue) return csrfTokenValue
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('csrf-token='))
    ?.split('=')[1]
}

function setCsrfToken(token) {
  csrfTokenValue = typeof token === 'string' && token ? token : null
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Refreshes the cookie-backed session exactly once, even when several requests
 * fail together (or React Strict Mode remounts the authentication provider).
 */
export function refreshAccessToken() {
  refreshPromise ??= apiClient
    .post('/auth/refresh-token')
    .then((response) => response.data?.data?.accessToken || response.data?.accessToken)
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`

  if (!['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
    const csrf = csrfToken()
    if (csrf) config.headers['x-csrf-token'] = csrf
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    // The API exposes this header because its CSRF cookie belongs to the API
    // domain and is unreadable from a separately deployed Vercel frontend.
    const csrf = response.headers?.['x-csrf-token'] || response.data?.data?.csrfToken
    if (csrf) setCsrfToken(csrf)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const isRefreshRequest = originalRequest?.url === '/auth/refresh-token'

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isRefreshRequest ||
      !getAuthToken()
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const token = await refreshAccessToken()
      if (!token) throw new Error('Session expired')

      setAuthToken(token)
      originalRequest.headers.Authorization = `Bearer ${token}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      setAuthToken(null)
      if (unauthorizedHandler) {
        unauthorizedHandler()
      }
      return Promise.reject(refreshError)
    }
  }
)
