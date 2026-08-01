import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  Flag,
  Shield,
  BarChart3,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/axios'
import { resolveIcon } from '../components/ui/iconUtils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: FileText, label: 'Polls', href: '/admin/polls' },
  { icon: Flag, label: 'Reports', href: '/admin/reports' },
  { icon: Shield, label: 'Moderation', href: '/admin/moderation' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/dashboard')
      return data?.data?.stats || data?.stats || {}
    },
  })

  const statItems = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.totalUsers?.toLocaleString() || '0',
    },
    {
      icon: FileText,
      label: 'Active Polls',
      value: stats?.totalPolls?.toLocaleString() || '0',
    },
    {
      icon: Flag,
      label: 'Reports',
      value: stats?.pendingReports?.toLocaleString() || '0',
    },
    {
      icon: BarChart3,
      label: 'Engagement',
      value: `${stats?.engagementRate || 0}%`,
    },
  ]

  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-surface-900 border-r border-surface-800
          transition-all duration-300 ease-out
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Shield size={16} className="text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 shadow-sm shadow-brand-500/10'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {resolveIcon(item.icon, 20, {
                    strokeWidth: isActive ? 2.5 : 2,
                    className: `flex-shrink-0 ${isActive ? 'text-brand-400' : ''}`,
                  })}
                  {!collapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Stats preview */}
        {!collapsed && (
          <div className="px-3 pb-3 space-y-2">
            <div className="p-3 rounded-xl bg-surface-800/50 border border-surface-700/50">
              <p className="text-xs font-medium text-surface-400 mb-2">
                Quick Stats
              </p>
              <div className="space-y-2">
                {statItems.slice(0, 3).map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-surface-400">
                      {stat.label}
                    </span>
                    <span className="text-xs font-semibold text-surface-200">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-surface-800 border border-surface-700 rounded-full flex items-center justify-center text-surface-400 hover:text-surface-200 hover:border-surface-600 shadow-sm transition-all"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <div
        className="flex-1 min-h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-16 bg-surface-900/80 backdrop-blur-xl border-b border-surface-800">
          <div className="flex items-center justify-between h-full px-6">
            <div>
              <h1 className="text-lg font-semibold text-white">
                {location.pathname === '/admin' ? 'Admin Dashboard' : ''}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
