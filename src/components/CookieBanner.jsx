import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
          style={{
            position: 'fixed',
            bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            width: 'min(720px, calc(100vw - 32px))',
            zIndex: 9999,
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(18,16,32,0.97) 0%, rgba(12,11,21,0.97) 100%)',
            border: '1px solid rgba(200,136,58,0.25)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            padding: '20px 24px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>

            {/* Icône + texte */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '240px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(200,136,58,0.1)', border: '1px solid rgba(200,136,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.88rem', color: '#F5F0E8', margin: '0 0 4px' }}>
                  Ce site utilise des cookies
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(245,240,232,0.45)', margin: 0, lineHeight: 1.55 }}>
                  Cookies techniques essentiels + Stripe (paiement sécurisé).{' '}
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
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button
                onClick={refuse}
                style={{
                  padding: '9px 18px', borderRadius: '50px', border: '1px solid rgba(58,56,80,0.7)',
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
                  padding: '9px 22px', borderRadius: '50px', border: 'none',
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
