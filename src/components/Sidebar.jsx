import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, CheckSquare, Calendar, Target, Timer, Sparkles, CloudSun,
  ChevronLeft, ChevronRight, Settings, LogOut, ChevronDown,
} from 'lucide-react'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'todo', label: 'Tasks', icon: CheckSquare, color: 'var(--color-todo)' },
  { key: 'planner', label: 'Planner', icon: Calendar, color: 'var(--color-planner)' },
  { key: 'goals', label: 'Goals', icon: Target, color: 'var(--color-goals)' },
  { key: 'pomodoro', label: 'Focus', icon: Timer, color: 'var(--color-pomodoro)' },
  { key: 'motivation', label: 'Motivation', icon: Sparkles, color: 'var(--color-motivation)' },
  { key: 'weather', label: 'Weather', icon: CloudSun, color: 'var(--color-weather)' },
]

export default function Sidebar({ collapsed, onToggle, activeFeature, onNavigate }) {
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r select-none"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        background: 'var(--bg-sidebar)',
        borderColor: 'var(--border)',
        transition: 'width var(--transition-slow)',
      }}
    >
      <div className="flex items-center h-16 px-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[#4f46e5] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-[0_2px_8px_var(--primary-glow)]">
            P
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-bold whitespace-nowrap overflow-hidden"
                style={{ color: 'var(--text)' }}
              >
                Prodify
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onToggle}
          className="ml-auto w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all hover:bg-[var(--bg-muted)]"
          style={{ color: 'var(--text-muted)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.key === 'dashboard' ? !activeFeature : activeFeature === item.key
          const isHovered = hoveredItem === item.key

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-[var(--transition)]"
              style={{
                padding: collapsed ? '10px' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              }}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: 18, height: 18 }}>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -inset-2 rounded-md"
                    style={{ background: 'var(--primary-light)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ position: 'relative', zIndex: 1 }} />
              </div>

              {!collapsed && (
                <span className="truncate" style={{ zIndex: 1 }}>{item.label}</span>
              )}

              {isHovered && !collapsed && item.color && (
                <div
                  className="absolute right-2 w-1.5 h-1.5 rounded-full opacity-50"
                  style={{ background: item.color }}
                />
              )}

              {isHovered && collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="fixed left-[calc(var(--sidebar-collapsed)+12px)] z-[60] px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap shadow-lg pointer-events-none"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    transform: `translateY(${hoveredItem === item.key ? '0' : '0'})`,
                  }}
                >
                  {item.label}
                </motion.div>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t shrink-0 px-3 py-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-[var(--bg-muted)] cursor-pointer" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#4f46e5] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            U
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>User</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>user@email.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
