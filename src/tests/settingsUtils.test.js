import { describe, it, expect } from 'vitest'
import { normalizeUserResponse } from '../utils/apiResponse'

describe('normalizeUserResponse', () => {
  it('unwraps the backend envelope and returns the nested user payload', () => {
    const payload = {
      success: true,
      statusCode: 200,
      message: 'Profile fetched successfully',
      data: {
        user: {
          name: 'Ava',
          username: 'ava',
          email: 'ava@example.com',
          notificationPreferences: { emailNotifications: false },
        },
      },
    }

    expect(normalizeUserResponse(payload)).toEqual({
      name: 'Ava',
      username: 'ava',
      email: 'ava@example.com',
      notificationPreferences: { emailNotifications: false },
    })
  })

  it('falls back to the direct payload when the envelope is already unwrapped', () => {
    const payload = {
      name: 'Nia',
      username: 'nia',
      email: 'nia@example.com',
    }

    expect(normalizeUserResponse(payload)).toEqual(payload)
  })
})
