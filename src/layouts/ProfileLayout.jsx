import { Outlet, NavLink, useParams } from 'react-router-dom'
import { User, Settings, BarChart3, Bookmark, Vote } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/axios'
import { resolveIcon } from '../components/ui/iconUtils'

const tabs = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: BarChart3, label: 'Activity', href: '/profile/activity' },
  { icon: Vote, label: 'Polls', href: '/profile/polls' },
  { icon: Bookmark, label: 'Bookmarks', href: '/profile/bookmarks' },
  { icon: Settings, label: 'Settings', href: '/profile/settings' },
]

export default function ProfileLayout() {
  const { username } = useParams()
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const endpoint = username ? `/users/${username}` : '/users/me'
      const { data } = await apiClient.get(endpoint)
      return data?.data || data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="relative bg-gradient-to-br from-brand-500/10 via-surface-50 to-violet-500/10 border-b border-surface-200/60">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 rounded-2xl bg-surface-200 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-48 bg-surface-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-surface-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayName = user?.name || 'User'
  const displayUsername = user?.username || 'user'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Profile header */}
      <div className="relative bg-gradient-to-br from-brand-500/10 via-surface-50 to-violet-500/10 border-b border-surface-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-end gap-6">
            <div
              className="relative"
              style={{ animation: 'scaleIn 0.4s ease-out' }}
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/25">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full border-4 border-surface-50" />
            </div>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold text-surface-900"
                style={{ animation: 'fadeInUp 0.4s ease-out 0.1s both' }}
              >
                {displayName}
              </h1>
              <p
                className="text-surface-500 mt-1"
                style={{ animation: 'fadeInUp 0.4s ease-out 0.15s both' }}
              >
                @{displayUsername}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex items-center gap-8 mt-8"
            style={{ animation: 'fadeInUp 0.4s ease-out 0.2s both' }}
          >
            {[
              { label: 'Polls', value: user?.stats?.polls || 0 },
              { label: 'Votes', value: user?.stats?.votes || 0 },
              { label: 'Followers', value: user?.stats?.followers || 0 },
              { label: 'Following', value: user?.stats?.following || 0 },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-surface-900">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.href}
                to={tab.href}
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    isActive
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {resolveIcon(tab.icon, 18, {
                      strokeWidth: isActive ? 2.5 : 2,
                    })}
                    {tab.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Outlet context={{ user }} />
      </main>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
