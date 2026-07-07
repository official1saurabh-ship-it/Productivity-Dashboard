import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Sparkles } from 'lucide-react'

const FALLBACK_QUOTES = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
]

export default function MotivationQuote() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchQuote = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('https://api.quotable.io/random')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setQuote({ text: data.content, author: data.author })
    } catch {
      setError(true)
      const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setQuote(fallback)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQuote() }, [fetchQuote])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Daily Motivation</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Inspiration for your day</p>
        </div>
      </div>

      <div className="rounded-xl border p-8 text-center relative overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-motivation)] via-[var(--color-planner)] to-[var(--color-todo)] opacity-30" />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-8">
              <div className="w-10 h-10 rounded-xl border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--color-motivation)' }} />
              <span className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>Finding inspiration...</span>
            </motion.div>
          ) : quote ? (
            <motion.div
              key={quote.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="py-4"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6" style={{ background: 'color-mix(in srgb, var(--color-motivation) 10%, transparent)', color: 'var(--color-motivation)' }}>
                <Sparkles size={22} />
              </div>
              <p className="text-lg leading-relaxed max-w-lg mx-auto font-medium" style={{ color: 'var(--text)' }}>
                "{quote.text}"
              </p>
              {quote.author && (
                <p className="text-sm font-semibold mt-4" style={{ color: 'var(--text-secondary)' }}>
                  &mdash; {quote.author}
                </p>
              )}
              {error && (
                <p className="text-xs mt-3" style={{ color: 'var(--warning)' }}>Using offline quote</p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          onClick={fetchQuote}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-[var(--transition)] hover:bg-[var(--bg-muted)]"
          style={{ borderColor: 'var(--border)', color: 'var(--color-motivation)' }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'New Quote'}
        </button>
      </div>
    </div>
  )
}
