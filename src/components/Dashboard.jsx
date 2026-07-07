import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Calendar, Target, Timer, Sparkles, CloudSun } from 'lucide-react'

const cards = [
  { key: 'todo', title: 'Tasks', desc: 'Manage your to-do list', icon: CheckSquare, color: 'var(--color-todo)', gradient: 'from-[var(--color-todo)] to-[#4f46e5]' },
  { key: 'planner', title: 'Planner', desc: 'Schedule your day', icon: Calendar, color: 'var(--color-planner)', gradient: 'from-[var(--color-planner)] to-[#7c3aed]' },
  { key: 'goals', title: 'Goals', desc: 'Track daily objectives', icon: Target, color: 'var(--color-goals)', gradient: 'from-[var(--color-goals)] to-[#16a34a]' },
  { key: 'pomodoro', title: 'Focus', desc: 'Timer for deep work', icon: Timer, color: 'var(--color-pomodoro)', gradient: 'from-[var(--color-pomodoro)] to-[#d97706]' },
  { key: 'motivation', title: 'Motivation', desc: 'Daily inspiration', icon: Sparkles, color: 'var(--color-motivation)', gradient: 'from-[var(--color-motivation)] to-[#db2777]' },
  { key: 'weather', title: 'Weather', desc: 'Current conditions', icon: CloudSun, color: 'var(--color-weather)', gradient: 'from-[var(--color-weather)] to-[#0284c7]' },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

export default function Dashboard({ onOpen }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Welcome back</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Select a tool to get started</p>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
      >
        {cards.map((card) => {
          const Icon = card.icon
          const isHovered = hovered === card.key

          return (
            <motion.button
              key={card.key}
              variants={item}
              onClick={() => onOpen(card.key)}
              onMouseEnter={() => setHovered(card.key)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-start gap-4 p-5 rounded-xl border text-left relative overflow-hidden transition-all duration-[var(--transition)]"
              style={{
                background: 'var(--bg-card)',
                borderColor: isHovered ? 'color-mix(in srgb, var(--border) 50%, transparent)' : 'var(--border)',
                boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-[var(--transition)]"
                style={{
                  background: `color-mix(in srgb, ${card.color} 10%, transparent)`,
                  color: card.color,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{card.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{card.desc}</p>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-0 transition-opacity duration-[var(--transition)]"
                style={{
                  background: `linear-gradient(90deg, ${card.color}, transparent)`,
                  opacity: isHovered ? 0.4 : 0,
                }}
              />
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
