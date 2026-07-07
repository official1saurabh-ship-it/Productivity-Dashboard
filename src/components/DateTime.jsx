import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function DateTime() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
      <Clock size={13} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
      <span className="tabular-nums font-semibold" style={{ color: 'var(--text)' }}>{formatTime(now)}</span>
      <span className="hidden sm:inline text-[var(--text-muted)]">{formatDate(now)}</span>
    </div>
  )
}
