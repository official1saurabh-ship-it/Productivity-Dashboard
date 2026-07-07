import { useState } from 'react'
import { ArrowLeft, Search, Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useTimer } from '../contexts/TimerContext'
import TimerBadge from './TimerBadge'
import DateTime from './DateTime'

export default function TopNav({ title, hasBack, onBack }) {
  const { theme, toggleTheme } = useTheme()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 flex items-center h-16 px-6 border-b backdrop-blur-xl transition-all duration-[var(--transition)]"
      style={{
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {hasBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all hover:bg-[var(--bg-muted)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <h1
          className="text-base font-bold truncate"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm transition-all duration-[var(--transition)]"
          style={{
            background: searchFocused ? 'var(--bg-card)' : 'var(--bg-muted)',
            borderColor: searchFocused ? 'var(--primary)' : 'var(--border)',
            color: 'var(--text-secondary)',
            boxShadow: searchFocused ? '0 0 0 3px var(--primary-glow)' : 'none',
          }}
        >
          <Search size={15} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
          <input
            className="bg-transparent border-none outline-none text-sm min-w-[180px]"
            style={{ color: 'var(--text)' }}
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden lg:inline-flex text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ⌘K
          </kbd>
        </div>

        <TimerBadge />

        <DateTime />

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-muted)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-muted)] relative"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--danger)] border-2" style={{ borderColor: 'var(--bg)' }} />
        </button>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ml-1 bg-gradient-to-br from-[var(--primary)] to-[#4f46e5] shadow-[0_2px_8px_var(--primary-glow)]"
        >
          U
        </div>
      </div>
    </header>
  )
}
