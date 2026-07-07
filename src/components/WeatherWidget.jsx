import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CloudSun, Droplets, Wind, Gauge, Thermometer, MapPin } from 'lucide-react'

const API_KEY = 'YOUR_API_KEY'
const DEFAULT_CITY = 'London'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [city, setCity] = useState(DEFAULT_CITY)

  useEffect(() => { fetchWeather(city) }, [])

  async function fetchWeather(location) {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setWeather({
        city: data.name, country: data.sys.country, temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like), condition: data.weather[0].main,
        description: data.weather[0].description, humidity: data.main.humidity,
        pressure: data.main.pressure, wind: Math.round(data.wind.speed), icon: data.weather[0].icon,
      })
    } catch { setError(true); setWeather(null) }
    finally { setLoading(false) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) fetchWeather(city.trim())
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Weather</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Current conditions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2.5 mb-6">
        <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 border rounded-lg transition-all duration-[var(--transition)]" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <MapPin size={14} style={{ color: 'var(--color-weather)' }} />
          <input className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: 'var(--text)' }} placeholder="Search city..." value={city} onChange={e => setCity(e.target.value)} />
        </div>
        <button type="submit" className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_color-mix(in_srgb,var(--color-weather)_35%,transparent)] bg-gradient-to-r from-[var(--color-weather)] to-[#0284c7]">
          <Search size={14} /> Search
        </button>
      </form>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-14">
            <div className="w-10 h-10 rounded-xl border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--color-weather)' }} />
            <span className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading weather...</span>
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
              <CloudSun size={22} strokeWidth={1.5} />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Could not load weather.<br />Try another city.</p>
          </motion.div>
        ) : weather ? (
          <motion.div key="weather" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-weather) 10%, transparent)' }}>
                <img className="w-16 h-16" src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} alt={weather.description} />
              </div>
              <div>
                <div className="text-[2.5rem] font-extrabold leading-none tracking-tight" style={{ color: 'var(--text)' }}>{weather.temp}°</div>
                <div className="flex items-center gap-1.5 text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={13} style={{ color: 'var(--color-weather)' }} />
                  {weather.city}, {weather.country}
                </div>
              </div>
            </div>
            <p className="text-sm font-medium capitalize mb-5" style={{ color: 'var(--text)' }}>{weather.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Feels Like', value: `${weather.feelsLike}°`, icon: Thermometer },
                { label: 'Humidity', value: `${weather.humidity}%`, icon: Droplets },
                { label: 'Wind', value: `${weather.wind} m/s`, icon: Wind },
                { label: 'Pressure', value: `${weather.pressure} hPa`, icon: Gauge },
              ].map((d, i) => (
                <motion.div key={d.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="flex items-center gap-3 px-4 py-3 rounded-lg border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                  <d.icon size={14} style={{ color: 'var(--color-weather)' }} className="shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{d.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
