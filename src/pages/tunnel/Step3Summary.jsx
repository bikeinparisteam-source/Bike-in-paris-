import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCube } from '../../components/CubeTransition'
import BackButton from '../../components/BackButton'
import StepProgress from '../../components/StepProgress'
import { useReservationStore, getRentalPrice } from '../../store/reservationStore'

const fmt = (d) => d
  ? d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  : '—'

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5L4 7L8 3" stroke="#C8883A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CrossIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M2 2L7 7M7 2L2 7" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

export default function Step3Summary() {
  const { goPrev, currentIndex, total } = useCube()
  const navigate = useNavigate()
  const store = useReservationStore()
  const { deliveryType, deliveryAddress, startDate, startTime, durationDays, endDate, rentalPrice } = store

  const totalOnline = rentalPrice + (deliveryType === 'delivery' ? 10 : 0)
  const amountOnsite = deliveryType === 'delivery' ? 15 : 5

  const includedItems = [
    'Vélo biplace',
    '2 casques certifiés',
    '1 antivol + géolocalisation et alarme en cas de vol',
    '2 batteries',
    ...(durationDays > 1 ? ['Chargeur inclus'] : []),
  ]

  const handlePay = (type) => {
    store.setPaymentType(type)
    navigate('/payment')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,136,58,0.05) 0%, #0F0E17 55%)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 16px' }}>
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
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#A09080', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Étape 3</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F5F0E8', lineHeight: 1.2 }}>
          Récapitulatif
        </h1>
      </motion.div>

      {/* Carte principale */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px', marginBottom: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{ width: '100%', maxWidth: '820px' }}
        >
          <div style={{
            borderRadius: '24px', padding: '32px',
            background: 'linear-gradient(135deg, rgba(28,27,46,0.96) 0%, rgba(15,14,23,0.88) 100%)',
            border: '1.5px solid rgba(58,56,80,0.7)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}>

            {/* Deux colonnes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

              {/* Gauche : inclus + votre commande */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                {/* Ce qui est inclus */}
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '16px' }}>
                    Inclus dans votre location
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {includedItems.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(200,136,58,0.15)', border: '1px solid rgba(200,136,58,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckIcon />
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#F5F0E8', fontSize: '0.9rem' }}>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Séparateur */}
                <div style={{ borderTop: '1px solid rgba(58,56,80,0.5)' }} />

                {/* Votre commande */}
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '4px' }}>
                    Votre commande
                  </p>

                  {/* Ligne : mode */}
                  <SummaryRow
                    label="Mode"
                    value={deliveryType === 'delivery' ? 'Livraison à domicile · +10€' : 'Retrait dans le 12ème · Gratuit'}
                    onEdit={goPrev}
                  />

                  {/* Adresse si livraison */}
                  {deliveryType === 'delivery' && deliveryAddress && (
                    <SummaryRow label="Adresse" value={deliveryAddress} onEdit={goPrev} />
                  )}

                  {/* Dates */}
                  <SummaryRow
                    label="Départ"
                    value={startDate ? `${fmt(startDate)} à ${startTime}` : '—'}
                    onEdit={goPrev}
                  />
                  <SummaryRow
                    label="Récupération"
                    value={endDate ? `${fmt(endDate)} à 19h00` : '—'}
                    onEdit={goPrev}
                  />
                  <SummaryRow
                    label="Durée"
                    value={durationDays ? `${durationDays} jour${durationDays > 1 ? 's' : ''}` : '—'}
                    onEdit={goPrev}
                  />

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', marginTop: '8px', borderTop: '1px solid rgba(58,56,80,0.4)' }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#F5F0E8', fontSize: '0.9rem', fontWeight: 600 }}>Total</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '2rem', color: '#C8883A', lineHeight: 1 }}>{totalOnline}€</span>
                  </div>
                </div>
              </div>

              {/* Droite : règles + caution + paiement */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Règles */}
                <div style={{
                  borderRadius: '16px', padding: '22px',
                  background: 'linear-gradient(135deg, rgba(40,10,10,0.7) 0%, rgba(15,14,23,0.6) 100%)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  display: 'flex', flexDirection: 'column', gap: '16px',
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(248,113,113,0.8)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    Il est interdit de
                  </p>

                  {/* Règles */}
                  {['Sortir de Paris avec le vélo', 'Débrider ou modifier le vélo'].map((rule, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CrossIcon />
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#F5F0E8', fontSize: '1rem', fontWeight: 500 }}>{rule}</span>
                    </div>
                  ))}

                  {/* Conclusion */}
                  <div style={{ marginTop: '6px', paddingTop: '16px', borderTop: '1px solid rgba(239,68,68,0.2)' }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: '#f87171', lineHeight: 1.4 }}>
                      Le vélo sera désactivé automatiquement et émettra une alarme.
                    </p>
                  </div>
                </div>

                {/* Caution */}
                <div style={{
                  borderRadius: '16px', padding: '16px 18px',
                  background: 'rgba(200,136,58,0.07)',
                  border: '1px solid rgba(200,136,58,0.25)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(200,136,58,0.15)', border: '1px solid rgba(200,136,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                    </svg>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    Une caution de <span style={{ color: '#C8883A', fontWeight: 600, fontSize: '1rem' }}>300€</span> et une pièce d'identité seront demandées à la remise du vélo.
                  </p>
                </div>

                {/* Boutons paiement */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                  <motion.button
                    onClick={() => handlePay('online')}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(200,136,58,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                      background: '#C8883A', cursor: 'pointer',
                      boxShadow: '0 0 24px rgba(200,136,58,0.3)',
                    }}
                  >
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: '#0F0E17', margin: 0 }}>
                      Payer en ligne maintenant
                    </p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', color: '#0F0E17', margin: '2px 0 0', lineHeight: 1 }}>
                      {totalOnline}€
                    </p>
                  </motion.button>

                  <motion.button
                    onClick={() => handlePay('onsite')}
                    whileHover={{ scale: 1.01, borderColor: 'rgba(200,136,58,0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '14px', cursor: 'pointer',
                      background: 'rgba(245,240,232,0.08)',
                      border: '1.5px solid rgba(245,240,232,0.25)',
                    }}
                  >
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: '#F5F0E8', margin: 0 }}>
                      Payer lors de la {deliveryType === 'delivery' ? 'livraison' : 'récupération'}
                    </p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.4rem', color: '#F5F0E8', margin: '4px 0 0', lineHeight: 1 }}>
                      {amountOnsite}€ <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '0.8rem', color: '#A09080' }}>maintenant · solde sur place</span>
                    </p>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(58,56,80,0.3)', gap: '12px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>{label}</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#F5F0E8', fontSize: '0.88rem', lineHeight: 1.4, textTransform: label === 'Départ' || label === 'Récupération' ? 'capitalize' : 'none' }}>{value}</p>
      </div>
      <button
        onClick={onEdit}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#C8883A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', flexShrink: 0, padding: '2px 0' }}
      >
        Modifier
      </button>
    </div>
  )
}
