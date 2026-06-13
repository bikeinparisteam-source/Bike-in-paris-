import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import { fr } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import { useCube } from '../../components/CubeTransition'
import BackButton from '../../components/BackButton'
import StepProgress from '../../components/StepProgress'
import { useReservationStore, getRentalPrice } from '../../store/reservationStore'

const PRICES_7 = { 1: 30, 2: 60, 3: 80, 4: 100, 5: 120, 6: 140, 7: 160 }
const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00']

const calendarStyles = `
  .rdp-root {
    --rdp-accent-color: #C8883A;
    --rdp-accent-background-color: rgba(200,136,58,0.15);
    --rdp-day-height: 52px;
    --rdp-day-width: 52px;
    color: #F5F0E8;
    width: 100%;
    margin: 0;
  }
  .rdp-month { width: 100%; }
  .rdp-month_grid { width: 100%; border-collapse: separate; border-spacing: 3px; }
  .rdp-month_caption { color: #F5F0E8; font-family: 'Playfair Display', serif; font-size: 1.2rem; padding-bottom: 16px; }
  .rdp-weekdays { margin-bottom: 6px; }
  .rdp-weekday { color: #A09080; font-size: 0.72rem; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
  .rdp-day_button { color: #F5F0E8; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 1rem; width: 100%; height: 100%; font-weight: 500; }
  .rdp-day_button:hover:not(:disabled) { background: rgba(200,136,58,0.2) !important; }
  .rdp-selected .rdp-day_button { background: #C8883A !important; color: #0F0E17 !important; font-weight: 700; box-shadow: 0 0 18px rgba(200,136,58,0.6); border-radius: 10px; }
  .rdp-disabled .rdp-day_button { color: #2A2840 !important; cursor: not-allowed; }
  .rdp-outside .rdp-day_button { color: #2A2840; }
  .rdp-nav button { color: #A09080; border-radius: 8px; padding: 8px; transition: all 0.2s; }
  .rdp-nav button:hover { color: #C8883A; background: rgba(200,136,58,0.12); }
  .rdp-today:not(.rdp-selected) .rdp-day_button { color: #C8883A; font-weight: 700; }
`

const getDateRange = (start, end) => {
  if (!start || !end) return []
  const dates = []
  const cur = new Date(start)
  cur.setDate(cur.getDate() + 1)
  while (cur < end) {
    dates.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

/* ─── Popup 8-15 jours ─── */
function ExtendedDaysPopup({ onConfirm, onClose }) {
  const [days, setDays] = useState(8)
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 w-full max-w-sm rounded-3xl p-8 flex flex-col gap-6"
        initial={{ scale: 0.88, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1C1B2E 0%, #0F0E17 100%)',
          border: '1.5px solid rgba(200,136,58,0.4)',
          boxShadow: '0 0 60px rgba(200,136,58,0.15)',
        }}
      >
        <div>
          <p className="font-['Playfair_Display'] font-bold text-2xl text-[#F5F0E8] mb-1">Combien de jours ?</p>
          <p className="font-['DM_Sans'] text-[#A09080] text-sm">De 8 à 15 jours · +20€ par jour au-delà de 7</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[8,9,10,11,12,13,14,15].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className="py-3 rounded-xl transition-all duration-200 font-['DM_Sans'] font-semibold text-base"
              style={{
                background: days === d ? 'rgba(200,136,58,0.18)' : 'rgba(255,255,255,0.04)',
                border: days === d ? '1.5px solid rgba(200,136,58,0.6)' : '1px solid rgba(58,56,80,0.6)',
                color: days === d ? '#C8883A' : '#F5F0E8',
              }}
            >{d}j</button>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(200,136,58,0.08)', border: '1px solid rgba(200,136,58,0.2)' }}>
          <span className="font-['DM_Sans'] text-[#A09080] text-sm">{days} jours</span>
          <span className="font-['Playfair_Display'] font-bold text-2xl text-[#C8883A]">{getRentalPrice(days)}€</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-['DM_Sans'] text-sm text-[#A09080] hover:text-[#F5F0E8] transition-colors"
            style={{ border: '1px solid rgba(58,56,80,0.7)' }}>Annuler</button>
          <button onClick={() => onConfirm(days)} className="flex-1 py-3 rounded-xl font-['DM_Sans'] font-semibold text-sm bg-[#C8883A] text-[#0F0E17]">
            Confirmer</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Dropdown durée ─── */
function DurationDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [showExtended, setShowExtended] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const label = value ? `${value} jour${value > 1 ? 's' : ''} — ${getRentalPrice(value)}€` : 'Choisir la durée'

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 500,
            color: '#A09080', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(58,56,80,0.55)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ color: value ? '#F5F0E8' : '#A09080' }}>{label}</span>
          <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A09080" strokeWidth="2" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </motion.svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="drop"
              initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -6, scaleY: 0.94 }}
              transition={{ duration: 0.16 }}
              className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl overflow-hidden z-30"
              style={{
                transformOrigin: 'top',
                background: 'linear-gradient(160deg, #1C1B2E 0%, #120F1E 100%)',
                border: '1.5px solid rgba(58,56,80,0.8)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.7)',
              }}
            >
              {Object.entries(PRICES_7).map(([d, p]) => {
                const selected = value === Number(d)
                return (
                  <button key={d} onClick={() => { onChange(Number(d)); setOpen(false) }}
                    className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                    style={{ background: selected ? 'rgba(200,136,58,0.1)' : 'transparent', borderBottom: '1px solid rgba(58,56,80,0.3)' }}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span className="font-['DM_Sans'] text-sm" style={{ color: selected ? '#C8883A' : '#F5F0E8' }}>
                      {d} jour{Number(d) > 1 ? 's' : ''}
                    </span>
                    <span className="font-['Playfair_Display'] font-bold text-lg" style={{ color: selected ? '#C8883A' : '#F5F0E8' }}>
                      {p}€
                    </span>
                  </button>
                )
              })}
              <button
                onClick={() => { setShowExtended(true); setOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                style={{ background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="font-['DM_Sans'] text-sm text-[#A09080]">Plus de 7 jours</span>
                <span className="font-['DM_Sans'] text-xs text-[#A09080]">dès 180€ →</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showExtended && (
          <ExtendedDaysPopup
            onConfirm={(d) => { onChange(d); setShowExtended(false) }}
            onClose={() => setShowExtended(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Page ─── */
export default function Step2Calendar() {
  const { goNext, currentIndex, total } = useCube()
  const store = useReservationStore()

  const [startDate, setStartDate] = useState(store.startDate)
  const [startTime, setStartTime] = useState(store.startTime || '10:00')
  const [duration, setDuration] = useState(store.durationDays)
  const continueRef = useRef(null)

  const endDate = startDate && duration
    ? (() => { const d = new Date(startDate); d.setDate(d.getDate() + duration - 1); return d })()
    : null

  const canContinue = !!(startDate && duration)

  useEffect(() => {
    if (startDate && duration && continueRef.current) {
      setTimeout(() => {
        continueRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }, 420)
    }
  }, [startDate, duration])

  const handleContinue = () => {
    store.setStartDate(startDate)
    store.setStartTime(startTime)
    store.setDurationDays(duration)
    goNext()
  }

  const handleNextAvailable = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    setStartDate(d)
  }

  const formatDateLong = (d) => d
    ? d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    : null

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,136,58,0.05) 0%, #0F0E17 55%)' }}>
      <style>{calendarStyles}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-7 pb-4 md:px-14 lg:px-20">
        <BackButton />
        <StepProgress current={currentIndex} total={total} />
      </div>

      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '0 24px', marginBottom: '32px' }}
      >
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#A09080', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Étape 1</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F5F0E8', lineHeight: 1.2 }}>
          Quand et combien de temps ?
        </h1>
      </motion.div>

      {/* Carte — centrée */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px', marginBottom: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          style={{ width: '100%', maxWidth: '820px' }}
        >
          <div style={{
            borderRadius: '24px',
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(28,27,46,0.96) 0%, rgba(15,14,23,0.88) 100%)',
            border: '1.5px solid rgba(58,56,80,0.7)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Deux colonnes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>

              {/* Gauche — Calendrier */}
              <div style={{ paddingRight: '40px' }}>
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  locale={fr}
                  disabled={{ before: new Date() }}
                  modifiers={{
                    inRange: endDate ? getDateRange(startDate, endDate) : [],
                    rangeEnd: endDate || undefined,
                  }}
                  modifiersStyles={{
                    inRange: { backgroundColor: 'rgba(200,136,58,0.22)', borderRadius: '6px', color: '#F5F0E8' },
                    rangeEnd: { backgroundColor: 'rgba(200,136,58,0.4)', borderRadius: '10px', color: '#0F0E17', fontWeight: '700', boxShadow: '0 0 12px rgba(200,136,58,0.4)' },
                  }}
                />
              </div>

              {/* Barre verticale + Droite */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '16px',
                paddingLeft: '32px',
                borderLeft: '1px solid rgba(58,56,80,0.55)',
              }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Durée de location</p>
                  <DurationDropdown value={duration} onChange={setDuration} />
                </div>

                <AnimatePresence>
                  {duration && (
                    <motion.div key="total" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.7rem', marginBottom: '4px' }}>Total location</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '2.5rem', color: '#C8883A', lineHeight: 1 }}>
                        {getRentalPrice(duration)}€
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(58,56,80,0.4)' }}>
                  <button
                    onClick={handleNextAvailable}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '12px',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 500,
                      color: '#A09080', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(58,56,80,0.55)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F5F0E8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#A09080'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/>
                    </svg>
                    Prochaines disponibilités
                  </button>
                </div>
              </div>
            </div>

            {/* Heures */}
            <AnimatePresence>
              {startDate && (
                <motion.div
                  key="hours"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid rgba(58,56,80,0.45)' }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px' }}>
                      Heure de départ
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '10px' }}>
                      {HOURS.map(h => (
                        <button
                          key={h}
                          onClick={() => setStartTime(h)}
                          style={{
                            padding: '16px 4px',
                            borderRadius: '12px',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: startTime === h ? '#C8883A' : 'rgba(255,255,255,0.04)',
                            color: startTime === h ? '#0F0E17' : '#A09080',
                            border: startTime === h ? 'none' : '1px solid rgba(58,56,80,0.45)',
                            boxShadow: startTime === h ? '0 0 18px rgba(200,136,58,0.5)' : 'none',
                          }}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Encadrés Départ / Récupération */}
      <AnimatePresence>
        {startDate && duration && (
          <motion.div
            key="daterecap"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', padding: '0 24px', marginBottom: '18px' }}
          >
            <div style={{ width: '100%', maxWidth: '820px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Départ */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '18px 20px', borderRadius: '18px', textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(200,136,58,0.18) 0%, rgba(28,27,46,0.7) 100%)',
                border: '2px solid rgba(200,136,58,0.75)',
                boxShadow: '0 0 28px rgba(200,136,58,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C8883A', boxShadow: '0 0 8px rgba(200,136,58,0.8)' }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#C8883A', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Départ</p>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: '#F5F0E8', textTransform: 'capitalize', lineHeight: 1.3 }}>
                  {formatDateLong(startDate)}
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: '#C8883A' }}>à {startTime}</p>
              </div>

              {/* Récupération */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '18px 20px', borderRadius: '18px', textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(200,136,58,0.1) 0%, rgba(28,27,46,0.6) 100%)',
                border: '1.5px solid rgba(200,136,58,0.42)',
                boxShadow: '0 0 16px rgba(200,136,58,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(200,136,58,0.5)', boxShadow: '0 0 6px rgba(200,136,58,0.4)' }} />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Récupération</p>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: '#F5F0E8', textTransform: 'capitalize', lineHeight: 1.3 }}>
                  {formatDateLong(endDate)}
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', color: 'rgba(200,136,58,0.7)' }}>à 19h00</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton Continuer */}
      <div ref={continueRef} style={{ display: 'flex', justifyContent: 'center', padding: '0 24px 36px' }}>
        <motion.button
          onClick={handleContinue}
          disabled={!canContinue}
          whileTap={canContinue ? { scale: 0.97 } : {}}
          whileHover={canContinue ? { scale: 1.02, boxShadow: '0 0 40px rgba(200,136,58,0.45)' } : {}}
          className="px-16 py-5 rounded-2xl font-['DM_Sans'] font-semibold text-lg transition-all duration-300 flex items-center gap-3"
          style={{
            background: canContinue ? '#C8883A' : 'rgba(28,27,46,0.8)',
            color: canContinue ? '#0F0E17' : '#3A3850',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            border: canContinue ? 'none' : '1px solid rgba(58,56,80,0.7)',
            boxShadow: canContinue ? '0 0 30px rgba(200,136,58,0.35)' : 'none',
            minWidth: '240px',
            justifyContent: 'center',
          }}
        >
          Continuer
          {canContinue && (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  )
}
