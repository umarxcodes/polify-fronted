import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Plus,
  Search,
  Bell,
  Bookmark,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Explore", href: "/search" },
  { icon: Plus, label: "Create poll", href: "/polls/create" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: 3 },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/profile/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-surface-200/80
          transition-all duration-300 ease-out
          ${collapsed ? "w-[72px]" : "w-[260px]"}
        `}
      >
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
              <span className="text-lg font-bold text-surface-900 tracking-tight whitespace-nowrap">
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
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/10"
                    : "text-surface-500 hover:text-surface-700 hover:bg-surface-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative flex-shrink-0 ${isActive ? "text-brand-600" : "text-surface-400 group-hover:text-surface-600"}`}>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 space-y-1 border-t border-surface-200/60">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-surface-500 hover:text-surface-700 hover:bg-surface-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`flex-shrink-0 ${isActive ? "text-brand-600" : "text-surface-400 group-hover:text-surface-600"}`} />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* User profile */}
          <div className="mt-2 pt-2 border-t border-surface-200/60">
            <div className="flex items-center gap-3 px-3 py-2">
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(user?.name || "U").split(" ").map((n) => n[0]).join("")}
                </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-surface-500 truncate">
                    @{user?.username || "user"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-surface-500 hover:text-surface-700 hover:border-surface-300 shadow-sm transition-all"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-surface-200/60">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-surface-900">
                {location.pathname === "/dashboard" ? "Dashboard" : ""}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-surface-100 rounded-xl border border-surface-200/60 w-64">
                <Search size={16} className="text-surface-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm text-surface-900 placeholder:text-surface-400 outline-none"
                />
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-surface-400 bg-surface-200 rounded">⌘K</kbd>
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
              </button>

              {/* User menu */}
              <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 transition-colors">
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
	                  {(user?.name || "U").split(" ").map((n) => n[0]).join("")}
	                </div>
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
  );
}
