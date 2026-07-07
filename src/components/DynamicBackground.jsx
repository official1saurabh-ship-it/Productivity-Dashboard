import { useState, useEffect } from 'react'

function getPeriod(hour) {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

export default function DynamicBackground() {
  const [period, setPeriod] = useState(() => getPeriod(new Date().getHours()))

  useEffect(() => {
    const id = setInterval(() => {
      const newPeriod = getPeriod(new Date().getHours())
      setPeriod(newPeriod)
    }, 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-period', period)
  }, [period])

  return null
}
