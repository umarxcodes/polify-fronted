import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Plus,
  Search,
  Bell,
  Bookmark,
  Settings,
  User,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  Vote,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/axios'
import { resolveIcon } from '../components/ui/iconUtils'
import { Dropdown } from '../components/ui/Dropdown'
import { Avatar } from '../components/ui/Avatar'
import { useTheme } from '../contexts/ThemeContext'
import { toast } from 'sonner'

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: Plus, label: 'Create Poll', href: '/polls/create' },
  { icon: FileText, label: 'My Polls', href: '/polls' },
  { icon: Vote, label: 'Voted Polls', href: '/votes/history' },
  { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Search, label: 'Explore', href: '/search' },
]

const bottomNavItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/profile/settings' },
]

function SidebarContent({ collapsed, onNavigate, user }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
              Pollify
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
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 shadow-sm shadow-brand-500/10'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative flex-shrink-0 ${isActive ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300'}`}>
                  {resolveIcon(item.icon, 20, {
                    strokeWidth: isActive ? 2.5 : 2,
                  })}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-1 border-t border-surface-800">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex-shrink-0 ${isActive ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300'}`}>
                  {resolveIcon(item.icon, 20, { strokeWidth: isActive ? 2.5 : 2 })}
                </div>
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* User profile */}
        <div className="mt-2 pt-2 border-t border-surface-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar
              src={user?.profileImage}
              fallback={(user?.name || 'U').split(' ').map(n => n[0]).join('')}
              size="sm"
              color="brand"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-surface-400 truncate">
                  @{user?.username || 'user'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const themeContext = useTheme()
  const { theme = 'system', toggleTheme = () => {} } = themeContext || {}
  const location = useLocation()
  const navigate = useNavigate()

  const { data: unread } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications/unread-count')
      return data?.data?.count || data?.count || 0
    },
    refetchInterval: 60 * 1000,
  })

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Logout failed')
    }
  }

  const profileMenuItems = [
    { label: 'Profile', icon: User, onClick: () => navigate('/profile') },
    { label: 'Settings', icon: Settings, onClick: () => navigate('/profile/settings') },
    { label: 'Toggle theme', icon: theme === 'dark' ? Sun : Moon, onClick: toggleTheme },
    { label: 'Logout', icon: LogOut, onClick: handleLogout, danger: true },
  ]

  return (
    <div className="flex min-h-screen bg-surface-950 text-surface-100">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-surface-900 border-r border-surface-800
          transform transition-transform duration-300 ease-out lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[260px]
        `}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <span className="text-lg font-bold text-white">Pollify</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} user={user} />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-surface-900 border-r border-surface-800
          transition-all duration-300 ease-out relative
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        `}
      >
        <SidebarContent collapsed={collapsed} onNavigate={() => {}} user={user} />

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
        style={{ marginLeft: 0 }}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-16 bg-surface-900/80 backdrop-blur-xl border-b border-surface-800">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-semibold text-white">
                {location.pathname === '/dashboard' ? 'Dashboard' : ''}
              </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-surface-800 rounded-xl border border-surface-700 w-64">
                <Search size={16} className="text-surface-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm text-surface-100 placeholder:text-surface-500 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = e.target.value.trim()
                      if (query)
                        navigate(`/search?q=${encodeURIComponent(query)}`)
                    }
                  }}
                />
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-surface-500 bg-surface-700 rounded">
                  ⌘K
                </kbd>
              </div>

              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
              >
                <Bell size={20} />
                {typeof unread === 'number' && unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User dropdown */}
              <Dropdown
                align="right"
                width={220}
                trigger={
                  <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-800 transition-colors">
                    <Avatar
                      src={user?.profileImage}
                      fallback={(user?.name || 'U').split(' ').map(n => n[0]).join('')}
                      size="sm"
                      color="brand"
                    />
                    <ChevronDown size={14} className="text-surface-400 hidden sm:block" />
                  </button>
                }
                items={profileMenuItems}
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
