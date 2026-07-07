import { motion } from 'framer-motion'
import { useTimer } from '../contexts/TimerContext'
import { Clock, Coffee } from 'lucide-react'

export default function TimerBadge() {
  const { running, timeLeft, session, isQuick, formatTime } = useTimer()

  if (!running) return null

  const icon = isQuick ? Clock : (session === 'work' ? Clock : Coffee)
  const label = isQuick ? 'TIMER' : (session === 'work' ? 'FOCUS' : 'BREAK')

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-[0_0_12px_var(--primary-glow)]"
      style={{
        background: 'var(--primary-light)',
        borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
        color: 'var(--primary)',
      }}
      title={`Timer running: ${label} - ${formatTime(timeLeft)}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
      <span className="text-[10px] font-bold tracking-wider">{label}</span>
      <span className="tabular-nums font-bold">{formatTime(timeLeft)}</span>
    </motion.button>
  )
}
