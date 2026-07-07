import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimer } from '../contexts/TimerContext'
import { Play, Pause, RotateCcw, Settings, Zap, Clock } from 'lucide-react'

export default function PomodoroTimer() {
  const {
    timeLeft, running, session, isQuick, settings, progress, circumference, totalMax,
    startWork, startQuick, pause, reset, applySettings, formatTime, formatMinutes, parseMinutes,
  } = useTimer()
  const [showSettings, setShowSettings] = useState(false)
  const [showQuick, setShowQuick] = useState(false)
  const [quickInput, setQuickInput] = useState('')
  const [workInput, setWorkInput] = useState(String(settings.work))
  const [breakInput, setBreakInput] = useState(String(settings.break))

  const strokeDashoffset = circumference * (1 - progress)
  const sessionLabel = isQuick ? 'Custom' : (session === 'work' ? 'Focus' : 'Break')
  const ringColor = isQuick ? 'var(--color-weather)' : (session === 'work' ? 'var(--color-pomodoro)' : 'var(--color-goals)')

  const btnCls = "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-[var(--transition)] flex items-center gap-2"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Focus Timer</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Pomodoro technique</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowQuick(true); setQuickInput(''); setShowSettings(false) }} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:-translate-y-0.5" style={{ borderColor: 'var(--border)', color: 'var(--color-weather)', background: 'var(--bg-card)' }}>
            <Zap size={13} /> Quick
          </button>
          <button onClick={() => { setShowSettings(true); setWorkInput(String(settings.work)); setBreakInput(String(settings.break)); setShowQuick(false) }} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all hover:-translate-y-0.5" style={{ borderColor: 'var(--border)', color: 'var(--color-pomodoro)', background: 'var(--bg-card)' }}>
            <Settings size={13} /> Settings
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showQuick ? (
          <motion.div key="quick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-weather) 10%, transparent)', color: 'var(--color-weather)' }}>
              <Zap size={22} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Minutes (e.g. <strong>10</strong>) or h:mm (e.g. <strong>1:30</strong>)</p>
            <input className="px-4 py-3 border rounded-lg text-center text-lg font-bold w-40 outline-none transition-all" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }}
              placeholder="10" value={quickInput} onChange={e => setQuickInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { startQuick(quickInput); setShowQuick(false); setQuickInput('') } }} autoFocus />
            {parseMinutes(quickInput) > 0 && <span className="text-sm font-semibold" style={{ color: 'var(--color-weather)' }}>{formatMinutes(parseMinutes(quickInput))}</span>}
            <div className="flex gap-3">
              <button className={`${btnCls} text-white bg-gradient-to-r from-[var(--color-weather)] to-[#0284c7] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--color-weather)_35%,transparent)]`} onClick={() => { startQuick(quickInput); setShowQuick(false); setQuickInput('') }}>
                <Play size={15} fill="currentColor" /> Start
              </button>
              <button className={`${btnCls} border`} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }} onClick={() => setShowQuick(false)}>Cancel</button>
            </div>
          </motion.div>
        ) : showSettings ? (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center gap-5 py-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-pomodoro) 10%, transparent)', color: 'var(--color-pomodoro)' }}>
              <Settings size={22} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Minutes or h:mm format</p>
            <div className="flex gap-4">
              {['work', 'break'].map(type => (
                <div key={type} className="flex flex-col gap-1.5 items-center">
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{type}</label>
                  <input type="text" inputMode="numeric" className="px-4 py-3 border rounded-lg text-center text-base font-bold w-28 outline-none transition-all" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: type === 'work' ? 'var(--color-pomodoro)' : 'var(--color-goals)' }}
                    value={type === 'work' ? workInput : breakInput}
                    onChange={e => type === 'work' ? setWorkInput(e.target.value) : setBreakInput(e.target.value)}
                    placeholder={type === 'work' ? '25' : '5'} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className={`${btnCls} text-white bg-gradient-to-r from-[var(--color-pomodoro)] to-[#d97706] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--color-pomodoro)_35%,transparent)]`}
                onClick={() => { applySettings(parseMinutes(workInput) || 25, parseMinutes(breakInput) || 5); setShowSettings(false) }}>Apply</button>
              <button className={`${btnCls} border`} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }} onClick={() => setShowSettings(false)}>Cancel</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-4">
            <div className="relative w-52 h-52 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="90" fill="none" stroke="var(--border)" strokeWidth="5" strokeLinecap="round" />
                <motion.circle cx="110" cy="110" r="90" fill="none" stroke={ringColor} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={sessionLabel}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: ringColor }}
                >{sessionLabel}</motion.span>
                <div className="text-[2.5rem] font-extrabold tabular-nums leading-tight mt-1" style={{ color: 'var(--text)' }}>{formatTime(timeLeft)}</div>
                <span className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {isQuick ? formatMinutes(totalMax / 60) : formatMinutes(session === 'work' ? settings.work : settings.break)}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              {!running ? (
                <button className={`${btnCls} text-white bg-gradient-to-r from-[var(--color-pomodoro)] to-[#d97706] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--color-pomodoro)_35%,transparent)]`}
                  onClick={startWork} disabled={isQuick && timeLeft === 0}>
                  <Play size={15} fill="currentColor" /> {timeLeft === totalMax && !isQuick ? 'Start' : 'Resume'}
                </button>
              ) : (
                <button className={`${btnCls} text-white bg-gradient-to-r from-[var(--color-planner)] to-[var(--primary)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--color-planner)_35%,transparent)]`} onClick={pause}>
                  <Pause size={15} fill="currentColor" /> Pause
                </button>
              )}
              <button className={`${btnCls} border`} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }} onClick={reset}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
