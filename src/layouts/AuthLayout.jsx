import { BarChart3, Bolt, Users } from "lucide-react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function PollifyMark() {
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
      <BarChart3 className="w-5 h-5 text-white" />
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen flex">
      {/* Left showcase - hidden on mobile */}
      <aside className="hidden lg:flex flex-1 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 max-w-lg">
          <div className="flex items-center gap-3">
            <PollifyMark />
            <span className="text-2xl font-bold text-white tracking-tight">Pollify</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-500/15 text-success-400 text-xs font-semibold mb-6 border border-success-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
              Live community
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Every opinion<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">deserves to</span><br />
              be counted.
            </h1>
            <p className="text-surface-400 text-lg leading-relaxed max-w-md">
              Create polls in seconds, collect votes instantly, and discover what your community truly thinks.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Users className="w-5 h-5 text-primary-400 mb-2" />
                <strong className="block text-xl font-bold text-white">50K+</strong>
                <small className="text-surface-400 text-xs">Community members</small>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 text-primary-400 mb-2" />
                <strong className="block text-xl font-bold text-white">1M+</strong>
                <small className="text-surface-400 text-xs">Votes cast</small>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Bolt className="w-5 h-5 text-primary-400 mb-2" />
                <strong className="block text-xl font-bold text-white">500K+</strong>
                <small className="text-surface-400 text-xs">Polls created</small>
              </div>
            </div>
            <p className="text-surface-500 text-sm">© {new Date().getFullYear()} Pollify · Made for the community</p>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <section className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <PollifyMark />
            <span className="text-xl font-bold text-surface-900 tracking-tight">Pollify</span>
          </div>

          {children || <Outlet />}
        </div>
      </section>
    </main>
  );
}
