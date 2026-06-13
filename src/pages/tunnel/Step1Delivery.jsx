import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCube } from '../../components/CubeTransition'
import BackButton from '../../components/BackButton'
import StepProgress from '../../components/StepProgress'
import { useReservationStore } from '../../store/reservationStore'

const PARIS_BOUNDS = { minLat: 48.808, maxLat: 48.910, minLon: 2.218, maxLon: 2.477 }
const isInParis = (lon, lat) =>
  lat >= PARIS_BOUNDS.minLat && lat <= PARIS_BOUNDS.maxLat &&
  lon >= PARIS_BOUNDS.minLon && lon <= PARIS_BOUNDS.maxLon

const searchAddresses = async (query) => {
  if (!query || query.length < 3) return []
  try {
    // citycode=75056 restreint les résultats à Paris uniquement côté serveur
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=6&citycode=75056`
    )
    const data = await res.json()
    return data.features || []
  } catch { return [] }
}

const TruckIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#C8883A' : '#A09080'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

const PinIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#C8883A' : '#A09080'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default function Step1Delivery() {
  const { goNext, currentIndex, total } = useCube()
  const store = useReservationStore()

  const [selected, setSelected] = useState(store.deliveryType)
  const [address, setAddress] = useState(store.deliveryAddress || '')
  const [inputValue, setInputValue] = useState(store.deliveryAddress || '')
  const [suggestions, setSuggestions] = useState([])
  const [addressConfirmed, setAddressConfirmed] = useState(!!store.deliveryAddress)
  const [outsideParis, setOutsideParis] = useState(false)
  const [loading, setLoading] = useState(false)

  const pickupRef = useRef(null)
  const continueRef = useRef(null)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)

  const canContinue = selected === 'pickup' || (selected === 'delivery' && addressConfirmed)

  const handleSelect = (type) => {
    setSelected(type)
    store.setDeliveryType(type)
  }

  const handleContinue = () => {
    store.setDeliveryAddress(address)
    goNext()
  }

  const handleInputChange = (val) => {
    setInputValue(val)
    setAddressConfirmed(false)
    setOutsideParis(false)
    setSuggestions([])
    clearTimeout(debounceRef.current)
    if (val.length < 3) { setLoading(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      const results = await searchAddresses(val)
      setSuggestions(results)
      setLoading(false)
      if (val.length >= 12 && results.length === 0) setOutsideParis(true)
    }, 300)
  }

  const handleSuggestionClick = (feature) => {
    const label = feature.properties.label
    setAddress(label)
    setInputValue(label)
    setAddressConfirmed(true)
    setSuggestions([])
    setTimeout(() => continueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 300)
  }

  useEffect(() => {
    if (selected === 'pickup' && pickupRef.current) {
      setTimeout(() => pickupRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }), 350)
    }
  }, [selected])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,136,58,0.05) 0%, #0F0E17 55%)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 16px' }}>
        <BackButton toHome={currentIndex === 0} />
        <StepProgress current={currentIndex} total={total} />
      </div>

      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '0 24px', marginBottom: '32px' }}
      >
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#A09080', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Étape 2</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F5F0E8', lineHeight: 1.2 }}>
          VÉLO biplace ultra confort
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '1rem', marginTop: '8px' }}>
          Découvrez Paris à deux
        </p>
      </motion.div>

      {/* Carte principale */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px', marginBottom: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          style={{ width: '100%', maxWidth: '820px' }}
        >
          <div style={{
            borderRadius: '24px', padding: '32px',
            background: 'linear-gradient(135deg, rgba(28,27,46,0.96) 0%, rgba(15,14,23,0.88) 100%)',
            border: '1.5px solid rgba(58,56,80,0.7)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}>

            {/* Deux cartes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Livraison */}
              <motion.button
                onClick={() => handleSelect('delivery')}
                whileTap={{ scale: 0.98 }}
                style={{
                  textAlign: 'left', borderRadius: '18px', padding: '28px 24px',
                  cursor: 'pointer', transition: 'all 0.3s',
                  background: selected === 'delivery'
                    ? 'linear-gradient(135deg, rgba(200,136,58,0.14) 0%, rgba(28,27,46,0.8) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  border: selected === 'delivery' ? '2px solid rgba(200,136,58,0.7)' : '1.5px solid rgba(58,56,80,0.6)',
                  boxShadow: selected === 'delivery' ? '0 0 32px rgba(200,136,58,0.15)' : 'none',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {selected === 'delivery' && <div style={{ position: 'absolute', top: 0, left: 0, width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(200,136,58,0.25) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected === 'delivery' ? 'rgba(200,136,58,0.18)' : 'rgba(255,255,255,0.06)' }}>
                    <TruckIcon active={selected === 'delivery'} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '2rem', color: selected === 'delivery' ? '#C8883A' : '#F5F0E8', lineHeight: 1 }}>+10€</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#A09080', marginTop: '2px' }}>supplément</p>
                  </div>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1.2rem', color: '#F5F0E8', marginBottom: '8px' }}>Je souhaite être livré</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#A09080', lineHeight: 1.5 }}>Nous livrons le vélo à votre adresse dans Paris et venons le récupérer à la date convenue.</p>
                {selected === 'delivery' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#C8883A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="#0F0E17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#C8883A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sélectionné</span>
                  </div>
                )}
              </motion.button>

              {/* Retrait */}
              <motion.button
                onClick={() => handleSelect('pickup')}
                whileTap={{ scale: 0.98 }}
                style={{
                  textAlign: 'left', borderRadius: '18px', padding: '28px 24px',
                  cursor: 'pointer', transition: 'all 0.3s',
                  background: selected === 'pickup'
                    ? 'linear-gradient(135deg, rgba(200,136,58,0.14) 0%, rgba(28,27,46,0.8) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  border: selected === 'pickup' ? '2px solid rgba(200,136,58,0.7)' : '1.5px solid rgba(58,56,80,0.6)',
                  boxShadow: selected === 'pickup' ? '0 0 32px rgba(200,136,58,0.15)' : 'none',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {selected === 'pickup' && <div style={{ position: 'absolute', top: 0, left: 0, width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(200,136,58,0.25) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected === 'pickup' ? 'rgba(200,136,58,0.18)' : 'rgba(255,255,255,0.06)' }}>
                    <PinIcon active={selected === 'pickup'} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '2rem', color: selected === 'pickup' ? '#C8883A' : '#F5F0E8', lineHeight: 1 }}>0€</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#A09080', marginTop: '2px' }}>gratuit</p>
                  </div>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1.2rem', color: '#F5F0E8', marginBottom: '8px' }}>Je viens chercher le vélo</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#A09080', lineHeight: 1.5 }}>Retrait dans le 12ème arrondissement de Paris.</p>
                {selected === 'pickup' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#C8883A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="#0F0E17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#C8883A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sélectionné</span>
                  </div>
                )}
              </motion.button>
            </div>

            {/* Formulaire adresse livraison */}
            {selected === 'delivery' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(58,56,80,0.45)' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                    Adresse de livraison
                  </p>

                  {/* Input */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      {loading
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={addressConfirmed ? '#C8883A' : '#A09080'} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      }
                    </div>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={e => handleInputChange(e.target.value)}
                      placeholder="Ex : 41 rue de Rivoli, Paris"
                      autoComplete="off"
                      style={{
                        width: '100%', padding: '15px 44px',
                        borderRadius: '12px',
                        fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem',
                        color: '#F5F0E8', background: 'rgba(255,255,255,0.06)',
                        border: outsideParis
                          ? '1.5px solid rgba(239,68,68,0.7)'
                          : addressConfirmed
                            ? '1.5px solid rgba(200,136,58,0.7)'
                            : '1.5px solid rgba(58,56,80,0.6)',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                    {addressConfirmed && (
                      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Dropdown — rendu en bloc normal, jamais clipé */}
                  {suggestions.length > 0 && (
                    <div style={{
                      marginTop: '6px', borderRadius: '12px', overflow: 'hidden',
                      background: '#1C1B2E',
                      border: '1.5px solid rgba(58,56,80,0.8)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    }}>
                      {suggestions.map((f, i) => (
                        <button
                          key={i}
                          onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(f) }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 16px', background: 'transparent', border: 'none',
                            borderBottom: i < suggestions.length - 1 ? '1px solid rgba(58,56,80,0.3)' : 'none',
                            cursor: 'pointer', textAlign: 'left',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,136,58,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          <div>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: '#F5F0E8' }}>
                              {f.properties.label}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke={outsideParis ? '#f87171' : addressConfirmed ? '#C8883A' : '#A09080'}
                      strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
                      color: outsideParis ? '#f87171' : addressConfirmed ? '#C8883A' : '#A09080' }}>
                      {outsideParis
                        ? 'Adresse hors de Paris — livraison uniquement dans Paris intra-muros'
                        : addressConfirmed
                          ? `✓ ${address}`
                          : 'Livraison uniquement dans Paris intra-muros (75001–75020)'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>

      {/* Bloc retrait hors carte */}
      <AnimatePresence>
        {selected === 'pickup' && (
          <motion.div
            key="pickup-info"
            ref={pickupRef}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', padding: '0 24px', marginBottom: '20px' }}
          >
            <div style={{
              width: '100%', maxWidth: '820px',
              padding: '28px 32px', borderRadius: '20px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(200,136,58,0.08) 0%, rgba(28,27,46,0.6) 100%)',
              border: '1.5px solid rgba(200,136,58,0.3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(200,136,58,0.15)', border: '1px solid rgba(200,136,58,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PinIcon active />
                </div>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: '#F5F0E8', lineHeight: 1.3 }}>
                L'adresse de récupération vous sera communiquée à la fin de la commande
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.85rem', marginTop: '10px' }}>
                Dans le 12ème arrondissement de Paris
              </p>
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
          style={{
            padding: '18px 64px', borderRadius: '16px',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', gap: '12px',
            minWidth: '240px', justifyContent: 'center',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            background: canContinue ? '#C8883A' : 'rgba(28,27,46,0.8)',
            color: canContinue ? '#0F0E17' : '#3A3850',
            border: canContinue ? 'none' : '1px solid rgba(58,56,80,0.7)',
            boxShadow: canContinue ? '0 0 30px rgba(200,136,58,0.35)' : 'none',
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
