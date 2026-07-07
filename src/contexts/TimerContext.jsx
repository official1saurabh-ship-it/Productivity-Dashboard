import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const TimerContext = createContext()

function parseMinutes(input) {
  if (!input) return 0
  const trimmed = input.trim()
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':')
    const h = parseInt(parts[0]) || 0
    const m = parseInt(parts[1]) || 0
    return h * 60 + m
  }
  return parseInt(trimmed) || 0
}

function formatMinutes(mins) {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('pomodoro-settings', { work: 25, break: 5 })
  const [timeLeft, setTimeLeft] = useState(settings.work * 60)
  const [running, setRunning] = useState(false)
  const [session, setSession] = useState('work')
  const intervalRef = useRef(null)
  const quickMaxRef = useRef(0)
  const sessionRef = useRef('work')
  const timeLeftRef = useRef(settings.work * 60)

  const WORK = settings.work * 60
  const BREAK = settings.break * 60

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (!running) {
      const target = session === 'work' ? WORK : (session === 'break' ? BREAK : timeLeft)
      setTimeLeft(target)
    }
  }, [settings])

  function startTimer(seconds, label) {
    clearInterval(intervalRef.current)
    setRunning(true)
    setSession(label)
    sessionRef.current = label
    setTimeLeft(seconds)
    timeLeftRef.current = seconds
    intervalRef.current = setInterval(() => {
      const current = timeLeftRef.current
      if (current <= 1) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setRunning(false)
        if (label === 'work') {
          setSession('break')
          sessionRef.current = 'break'
          setTimeLeft(BREAK)
          timeLeftRef.current = BREAK
        } else if (label === 'quick') {
          setTimeLeft(0)
          timeLeftRef.current = 0
        } else {
          setSession('work')
          sessionRef.current = 'work'
          setTimeLeft(WORK)
          timeLeftRef.current = WORK
        }
        return
      }
      const next = current - 1
      timeLeftRef.current = next
      setTimeLeft(next)
    }, 1000)
  }

  const startWork = useCallback(() => {
    if (intervalRef.current) return
    startTimer(WORK, 'work')
  }, [WORK])

  const startQuick = useCallback((input) => {
    const mins = parseMinutes(input)
    if (mins < 1) return
    quickMaxRef.current = mins * 60
    startTimer(mins * 60, 'quick')
  }, [])

  const pause = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
    setSession('work')
    sessionRef.current = 'work'
    setTimeLeft(WORK)
    timeLeftRef.current = WORK
    quickMaxRef.current = 0
  }, [WORK])

  const applySettings = useCallback((work, breakDuration) => {
    setSettings({ work, break: breakDuration })
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
    setSession('work')
    sessionRef.current = 'work'
    setTimeLeft(work * 60)
    timeLeftRef.current = work * 60
  }, [])

  const isQuick = session === 'quick'
  const totalMax = isQuick ? quickMaxRef.current : (session === 'work' ? WORK : BREAK)
  const progress = totalMax > 0 ? 1 - timeLeft / totalMax : 0
  const circumference = 2 * Math.PI * 90

  const value = {
    timeLeft,
    running,
    session,
    isQuick,
    settings,
    progress,
    circumference,
    totalMax,
    quickMaxRef,
    startWork,
    startQuick,
    pause,
    reset,
    applySettings,
    formatTime,
    formatMinutes,
    parseMinutes,
  }

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used within TimerProvider')
  return ctx
}
