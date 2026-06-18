import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', h, { passive: true })
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return m
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  useEffect(() => {
    const consent = localStorage.getItem('bip_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('bip_cookie_consent', 'accepted')
    setVisible(false)
  }

  const refuse = () => {
    localStorage.setItem('bip_cookie_consent', 'refused')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
          style={{
            position: 'fixed',
            bottom: isMobile ? '12px' : '20px',
            left: '50%',
            width: 'min(720px, calc(100vw - 24px))',
            zIndex: 9999,
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(18,16,32,0.97) 0%, rgba(12,11,21,0.97) 100%)',
            border: '1px solid rgba(200,136,58,0.25)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            padding: isMobile ? '16px 18px' : '20px 24px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? '14px' : '20px' }}>

            {/* Icône + texte */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(200,136,58,0.1)', border: '1px solid rgba(200,136,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: '#F5F0E8', margin: '0 0 3px' }}>
                  Ce site utilise des cookies
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.76rem', color: 'rgba(245,240,232,0.45)', margin: 0, lineHeight: 1.5 }}>
                  Cookies essentiels + Stripe.{' '}
                  <span
                    onClick={() => navigate('/confidentialite')}
                    style={{ color: 'rgba(200,136,58,0.75)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                  >
                    En savoir plus
                  </span>
                </p>
              </div>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0, justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
              <button
                onClick={refuse}
                style={{
                  padding: isMobile ? '10px 20px' : '9px 18px',
                  borderRadius: '50px', border: '1px solid rgba(58,56,80,0.7)',
                  background: 'transparent', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: 'rgba(245,240,232,0.45)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.3)'; e.currentTarget.style.color = 'rgba(245,240,232,0.75)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(58,56,80,0.7)'; e.currentTarget.style.color = 'rgba(245,240,232,0.45)' }}
              >
                Refuser
              </button>
              <button
                onClick={accept}
                style={{
                  padding: isMobile ? '10px 28px' : '9px 22px',
                  borderRadius: '50px', border: 'none',
                  background: 'linear-gradient(135deg, #C8883A, #A06A22)',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#0C0B15',
                  boxShadow: '0 0 18px rgba(200,136,58,0.3)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(200,136,58,0.5)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(200,136,58,0.3)'}
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
