import { beforeEach, describe, expect, it } from 'vitest'
import { getAuthToken, setAuthToken } from '../../lib/axios'

describe('auth token persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and restores the access token across reloads', () => {
    setAuthToken('persisted-token')

    expect(getAuthToken()).toBe('persisted-token')
    expect(localStorage.getItem('pollify_access_token')).toBe('persisted-token')

    setAuthToken(null)

    expect(getAuthToken()).toBeNull()
    expect(localStorage.getItem('pollify_access_token')).toBeNull()
  })
})
