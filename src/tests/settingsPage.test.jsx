import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import SettingsPage from '../features/user/pages/SettingsPage'

const { mockGet, mockPatch } = vi.hoisted(() => {
  const get = vi.fn()
  const patch = vi.fn()
  return { mockGet: get, mockPatch: patch }
})

vi.mock('../lib/axios', () => ({
  apiClient: {
    get: mockGet,
    patch: mockPatch,
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('SettingsPage', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockPatch.mockReset()

    mockGet.mockImplementation((url) => {
      if (url === '/users/me') {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              user: {
                name: 'Ava',
                username: 'ava',
                email: 'ava@example.com',
                bio: 'Product designer',
                location: 'London',
                website: 'https://ava.dev',
              },
            },
          },
        })
      }

      if (url === '/notifications/preferences') {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              preferences: {
                emailNotifications: false,
                pushNotifications: true,
                voteNotifications: true,
                commentNotifications: true,
                pollNotifications: true,
                systemNotifications: true,
                marketingNotifications: false,
              },
            },
          },
        })
      }

      return Promise.resolve({ data: {} })
    })
  })

  it('loads profile data and notification preferences from the backend', async () => {
    render(<SettingsPage />)

    await waitFor(() =>
      expect(screen.getByDisplayValue('Ava')).toBeInTheDocument()
    )
    await waitFor(() =>
      expect(screen.getByDisplayValue('ava@example.com')).toBeInTheDocument()
    )

    const emailToggle = screen.getByLabelText('Email notifications')
    expect(emailToggle).not.toBeChecked()

    const pushToggle = screen.getByLabelText('Push notifications')
    expect(pushToggle).toBeChecked()
  })
})
