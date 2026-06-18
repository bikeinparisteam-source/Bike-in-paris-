import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const LANGS = [
  { code: 'fr', flag: '🇫🇷' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'es', flag: '🇪🇸' },
  { code: 'it', flag: '🇮🇹' },
  { code: 'de', flag: '🇩🇪' },
]

export default function LanguageSwitcher({ placement = 'down' }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler) }
  }, [open])

  const current = LANGS.find(l => l.code === lang)
  const others = LANGS.filter(l => l.code !== lang)

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Changer de langue"
        style={{
          width: '36px', height: '36px',
          borderRadius: '10px',
          background: open ? 'rgba(200,136,58,0.15)' : 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(200,136,58,0.2)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.15rem', transition: 'background 0.18s, border-color 0.18s',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(200,136,58,0.1)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
      >
        {current.flag}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: placement === 'up' ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: placement === 'up' ? 6 : -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              [placement === 'up' ? 'bottom' : 'top']: 'calc(100% + 8px)',
              right: 0,
              display: 'flex', flexDirection: 'column', gap: '3px',
              padding: '7px',
              background: 'rgba(14,10,5,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '13px',
              border: '1px solid rgba(200,136,58,0.18)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              zIndex: 500,
            }}
          >
            {others.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false) }}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,136,58,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {l.flag}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
