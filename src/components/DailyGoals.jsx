import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, Trash2, Edit3, Check, Target } from 'lucide-react'

export default function DailyGoals() {
  const [goals, setGoals] = useLocalStorage('goals', [])
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  function addGoal(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setGoals(prev => [...prev, { id: Date.now(), text, completed: false }]); setInput('')
  }
  function toggleGoal(id) { setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g)) }
  function deleteGoal(id) { setGoals(prev => prev.filter(g => g.id !== id)) }
  function startEdit(goal) { setEditingId(goal.id); setEditText(goal.text) }
  function saveEdit(id) {
    const text = editText.trim()
    if (!text) setGoals(prev => prev.filter(g => g.id !== id))
    else setGoals(prev => prev.map(g => g.id === id ? { ...g, text } : g))
    setEditingId(null); setEditText('')
  }
  function cancelEdit() { setEditingId(null); setEditText('') }

  const completed = goals.filter(g => g.completed).length
  const progress = goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Daily Goals</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{completed}/{goals.length} completed</p>
        </div>
      </div>

      <form onSubmit={addGoal} className="flex gap-2.5 mb-6">
        <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 border rounded-lg transition-all duration-[var(--transition)]" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <Target size={14} style={{ color: 'var(--color-goals)' }} />
          <input className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: 'var(--text)' }} placeholder="Add a daily goal..." value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <button type="submit" className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--color-goals)_35%,transparent)] bg-gradient-to-r from-[var(--color-goals)] to-[#16a34a]">
          <Plus size={15} /> Add
        </button>
      </form>

      {goals.length > 0 && (
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-goals)] to-[#16a34a]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{progress}%</span>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
            <Target size={22} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No goals set</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>What do you want to achieve today?</p>
        </div>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence>
            {goals.map(goal => {
              const editing = editingId === goal.id
              return (
                <motion.li
                  key={goal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                  layout
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-[var(--transition)]"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: editing ? 'var(--color-goals)' : 'var(--border)',
                    boxShadow: editing ? '0 0 0 2px color-mix(in srgb, var(--color-goals) 15%, transparent)' : 'var(--shadow)',
                    opacity: goal.completed ? 0.6 : 1,
                  }}
                >
                  <button onClick={() => toggleGoal(goal.id)} className="w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-[var(--transition)]" style={{ borderColor: goal.completed ? 'var(--success)' : 'var(--border)', background: goal.completed ? 'var(--success)' : 'transparent' }} aria-label={goal.completed ? 'Mark incomplete' : 'Mark complete'}>
                    {goal.completed && <Check size={12} stroke="white" strokeWidth={3} />}
                  </button>
                  {editing ? (
                    <input className="flex-1 px-2.5 py-1 rounded text-sm font-medium border outline-none" style={{ borderColor: 'var(--color-goals)', background: 'var(--bg-card)', color: 'var(--text)' }}
                      value={editText} onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(goal.id); if (e.key === 'Escape') cancelEdit() }}
                      onBlur={() => saveEdit(goal.id)} autoFocus />
                  ) : (
                    <span className={`flex-1 text-sm font-medium ${goal.completed ? 'line-through' : ''}`} style={{ color: goal.completed ? 'var(--text-muted)' : 'var(--text)' }}>{goal.text}</span>
                  )}
                  <div className="flex gap-1 shrink-0">
                    {editing ? (
                      <button onClick={() => saveEdit(goal.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--success-light)]" style={{ color: 'var(--success)' }}>
                        <Check size={13} />
                      </button>
                    ) : (
                      <>
                        <button onClick={() => startEdit(goal)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-muted)]" style={{ color: 'var(--text-muted)' }} aria-label="Edit">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => deleteGoal(goal.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--danger-light)]" style={{ color: 'var(--text-muted)' }} aria-label="Delete">
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
