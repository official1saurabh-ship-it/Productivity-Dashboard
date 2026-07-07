import DateTime from './DateTime'
import ThemeSwitch from './ThemeSwitch'
import TimerBadge from './TimerBadge'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-[var(--blur)] transition-all duration-[var(--transition)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-gradient-to-br from-[var(--primary)] to-[var(--color-planner)] flex items-center justify-center text-white font-bold text-base">
          P
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--color-planner)] bg-clip-text text-transparent">
          Productivity Hub
        </h1>
      </div>
      <div className="flex items-center gap-5">
        <TimerBadge />
        <DateTime />
        <ThemeSwitch />
      </div>
    </header>
  )
}
