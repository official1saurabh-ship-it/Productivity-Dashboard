import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, Save, Clock, Trash2, Edit3, Calendar, Archive } from 'lucide-react'

const DEFAULT_HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

function formatHour(hour) {
  if (hour === 12) return '12:00 PM'
  if (hour > 12) return `${hour - 12}:00 PM`
  return `${hour}:00 AM`
}

function buildDefaultSlots() {
  return DEFAULT_HOURS.map(h => ({ id: `default-${h}`, time: formatHour(h), plan: '' }))
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DailyPlanner() {
  const [savedPlans, setSavedPlans] = useLocalStorage('planner-plans', [])
  const [slots, setSlots] = useState(() => buildDefaultSlots())
  const [showSaved, setShowSaved] = useState(false)
  const [editingTimeId, setEditingTimeId] = useState(null)
  const [editTimeValue, setEditTimeValue] = useState('')

  function handlePlanChange(id, value) { setSlots(prev => prev.map(s => s.id === id ? { ...s, plan: value } : s)) }
  function clearSlot(id) { setSlots(prev => prev.map(s => s.id === id ? { ...s, plan: '' } : s)) }
  function isCustom(id) { return id.startsWith('custom-') }
  function startTimeEdit(slot) { if (!isCustom(slot.id)) return; setEditingTimeId(slot.id); setEditTimeValue(slot.time) }
  function saveTimeEdit(id) {
    const val = editTimeValue.trim()
    if (val) setSlots(prev => prev.map(s => s.id === id ? { ...s, time: val } : s))
    setEditingTimeId(null); setEditTimeValue('')
  }

  function addSlotBetween(beforeId) {
    const idx = slots.findIndex(s => s.id === beforeId)
    if (idx === -1) return
    const prevSlot = slots[idx]; const nextSlot = slots[idx + 1]
    let defaultTime = 'Custom'
    if (nextSlot) {
      const pm = /(\d+):00 (\wM)/; const pm1 = prevSlot.time.match(pm); const pm2 = nextSlot.time.match(pm)
      if (pm1 && pm2) {
        let h1 = parseInt(pm1[1]); if (pm1[2] === 'PM' && h1 !== 12) h1 += 12; if (pm1[2] === 'AM' && h1 === 12) h1 = 0
        let h2 = parseInt(pm2[1]); if (pm2[2] === 'PM' && h2 !== 12) h2 += 12; if (pm2[2] === 'AM' && h2 === 12) h2 = 0
        const mid = Math.round((h1 + h2) / 2); const mp = mid >= 12 ? 'PM' : 'AM'; const mh = mid > 12 ? mid - 12 : mid === 0 ? 12 : mid
        defaultTime = `${mh}:00 ${mp}`
      }
    }
    setSlots(prev => [...prev.slice(0, idx + 1), { id: `custom-${Date.now()}`, time: defaultTime, plan: '' }, ...prev.slice(idx + 1)])
  }

  function savePlan() {
    const filled = slots.filter(s => s.plan.trim())
    if (filled.length === 0) return
    setSavedPlans(prev => [{ id: Date.now(), date: formatDate(new Date()), createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), slots: filled.map(s => ({ time: s.time, plan: s.plan.trim() })) }, ...prev])
    setSlots(buildDefaultSlots())
  }

  function deletePlan(id) { setSavedPlans(prev => prev.filter(p => p.id !== id)) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Daily Planner</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Plan your day hour by hour</p>
        </div>
        <div className="flex gap-2">
          {savedPlans.length > 0 && (
            <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all" style={{ borderColor: showSaved ? 'var(--primary)' : 'var(--border)', background: showSaved ? 'var(--primary-light)' : 'transparent', color: showSaved ? 'var(--primary)' : 'var(--text-secondary)' }}>
              <Archive size={14} /> {showSaved ? 'Edit' : `Saved (${savedPlans.length})`}
            </button>
          )}
          <button onClick={savePlan} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--color-planner)_35%,transparent)] bg-gradient-to-r from-[var(--color-planner)] to-[#7c3aed]">
            <Save size={14} /> Save Plan
          </button>
        </div>
      </div>

      {showSaved ? (
        <div className="space-y-4">
          {savedPlans.length === 0 ? (
            <p className="text-center text-sm py-12" style={{ color: 'var(--text-muted)' }}>No saved plans yet.</p>
          ) : (
            savedPlans.map(plan => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
                <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}>
                  <div className="flex items-center gap-2.5">
                    <Calendar size={14} style={{ color: 'var(--color-planner)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{plan.date}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>at {plan.createdAt}</span>
                  </div>
                  <button onClick={() => deletePlan(plan.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--danger-light)]" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="px-5 py-3 space-y-1">
                  {plan.slots.map((slot, i) => (
                    <div key={i} className="flex items-start gap-4 py-2 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                      <span className="w-20 text-xs font-semibold shrink-0" style={{ color: 'var(--color-planner)' }}>{slot.time}</span>
                      <span className="text-sm" style={{ color: 'var(--text)' }}>{slot.plan}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-0.5">
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Fill in your schedule, add custom time slots, then save.</p>
          {slots.map((slot, i) => (
            <div key={slot.id}>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-transparent transition-all duration-[var(--transition)] hover:border-[var(--border)]" style={{ background: slot.plan ? 'color-mix(in srgb, var(--color-planner) 4%, transparent)' : 'transparent' }}>
                <Clock size={13} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
                {editingTimeId === slot.id ? (
                  <input className="w-20 px-1.5 py-1 rounded text-xs font-semibold border outline-none" style={{ borderColor: 'var(--color-planner)', background: 'var(--bg-card)', color: 'var(--color-planner)' }}
                    value={editTimeValue} onChange={e => setEditTimeValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveTimeEdit(slot.id); if (e.key === 'Escape') { setEditingTimeId(null); setEditTimeValue('') } }}
                    onBlur={() => saveTimeEdit(slot.id)} autoFocus />
                ) : (
                  <span className={`w-20 text-xs font-semibold shrink-0 ${isCustom(slot.id) ? 'cursor-pointer' : ''}`}
                    style={{ color: isCustom(slot.id) ? 'var(--color-planner)' : 'var(--text-secondary)' }}
                    onClick={() => startTimeEdit(slot)}>
                    {slot.time}
                  </span>
                )}
                <input className="flex-1 bg-transparent border-none outline-none text-sm px-2" style={{ color: 'var(--text)' }} placeholder="What will you do?" value={slot.plan} onChange={e => handlePlanChange(slot.id, e.target.value)} />
                {slot.plan && (
                  <button onClick={() => clearSlot(slot.id)} className="w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all hover:bg-[var(--danger-light)]" style={{ color: 'var(--text-muted)' }}>
                    <X size={12} />
                  </button>
                )}
              </div>
              {i < slots.length - 1 && (
                <button onClick={() => addSlotBetween(slot.id)} className="flex items-center gap-2 w-full py-1 px-4 text-[10px] font-semibold uppercase tracking-wider opacity-0 hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  <Plus size={12} /> Add slot
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
