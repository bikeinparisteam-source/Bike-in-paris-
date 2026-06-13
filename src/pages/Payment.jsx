import { motion } from 'framer-motion'
import { useReservationStore } from '../store/reservationStore'
import BackButton from '../components/BackButton'

const methods = [
  {
    label: 'Apple Pay',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    label: 'Google Pay',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <text x="2" y="17" fontFamily="sans-serif" fontWeight="700" fontSize="13" fill="#4285F4">G</text>
        <text x="9" y="17" fontFamily="sans-serif" fontWeight="700" fontSize="13" fill="#EA4335">P</text>
      </svg>
    ),
  },
  {
    label: 'PayPal',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#64B5F6">
        <path d="M7.076 21.337H4.083a.641.641 0 0 1-.633-.74L5.33 3.914a.767.767 0 0 1 .757-.645h5.549c1.83 0 3.302.516 4.107 1.396.8.874.978 2.06.633 3.444l-.015.06a5.955 5.955 0 0 1-2.368 3.487 6.74 6.74 0 0 1-3.966 1.157H8.19a.613.613 0 0 0-.605.514l-.51 3.01z"/>
      </svg>
    ),
  },
  {
    label: 'Carte bancaire',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
]

export default function Payment() {
  const store = useReservationStore()
  const totalNow = store.getTotalNow()
  const isOnline = store.paymentType === 'online'
  const totalOnline = store.rentalPrice + (store.deliveryType === 'delivery' ? 10 : 0)
  const soldeOnsite = totalOnline - (store.deliveryType === 'delivery' ? 10 : 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,136,58,0.05) 0%, #0F0E17 55%)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '28px 24px 16px' }}>
        <BackButton />
      </div>

      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '0 24px', marginBottom: '32px' }}
      >
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#A09080', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Dernière étape</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F5F0E8', lineHeight: 1.2 }}>
          Paiement sécurisé
        </h1>
      </motion.div>

      {/* Carte principale */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px', marginBottom: '24px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

              {/* Gauche — montant + caution */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>

                {/* Montant à régler */}
                <div style={{
                  borderRadius: '18px', padding: '28px',
                  background: 'linear-gradient(135deg, rgba(200,136,58,0.14) 0%, rgba(28,27,46,0.7) 100%)',
                  border: '2px solid rgba(200,136,58,0.5)',
                  boxShadow: '0 0 32px rgba(200,136,58,0.12)',
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px' }}>
                    À régler maintenant
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(2.8rem, 6vw, 4rem)', color: '#C8883A', lineHeight: 1, marginBottom: '8px' }}>
                    {totalNow}€
                  </p>
                  {!isOnline && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      Solde de <span style={{ color: '#F5F0E8', fontWeight: 600 }}>{soldeOnsite}€</span> réglé lors de la {store.deliveryType === 'delivery' ? 'livraison' : 'récupération'}
                    </p>
                  )}
                </div>

                {/* Caution + pièce d'identité */}
                <div style={{
                  borderRadius: '16px', padding: '18px',
                  background: 'rgba(200,136,58,0.07)',
                  border: '1px solid rgba(200,136,58,0.25)',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(200,136,58,0.15)', border: '1px solid rgba(200,136,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                    </svg>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    Une caution de <span style={{ color: '#C8883A', fontWeight: 600 }}>300€</span> et une <span style={{ color: '#F5F0E8' }}>pièce d'identité</span> seront demandées à la remise du vélo.
                  </p>
                </div>

                {/* Sécurité */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A09080" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.75rem' }}>
                    Paiement 100% sécurisé · Chiffré SSL · Stripe
                  </p>
                </div>
              </div>

              {/* Droite — méthodes de paiement */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  Choisissez votre moyen de paiement
                </p>

                {/* Boutons méthodes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {methods.map(({ label, icon }) => (
                    <motion.button
                      key={label}
                      onClick={() => alert('Stripe à configurer ensemble')}
                      whileHover={{ scale: 1.03, borderColor: 'rgba(200,136,58,0.5)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '14px 10px', borderRadius: '12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(58,56,80,0.7)',
                        cursor: 'pointer', transition: 'border-color 0.2s',
                        color: '#A09080',
                      }}
                    >
                      {icon}
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#F5F0E8' }}>{label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Séparateur */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(58,56,80,0.5)' }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#A09080', fontSize: '0.75rem' }}>ou entrez vos informations</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(58,56,80,0.5)' }} />
                </div>

                {/* Zone Stripe */}
                <div style={{
                  borderRadius: '14px', padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px dashed rgba(58,56,80,0.7)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#3A3850', fontSize: '0.82rem', marginBottom: '6px' }}>
                    Numéro de carte, date d'expiration, CVV
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#3A3850', fontSize: '0.72rem' }}>
                    Intégration Stripe à configurer
                  </p>
                </div>

                {/* Bouton confirmer */}
                <motion.button
                  onClick={() => alert('Stripe à configurer ensemble')}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(200,136,58,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '18px', borderRadius: '14px', border: 'none',
                    background: '#C8883A', cursor: 'pointer',
                    boxShadow: '0 0 28px rgba(200,136,58,0.35)',
                    marginTop: '4px',
                  }}
                >
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F0E17', margin: 0 }}>
                    Confirmer et payer
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', color: '#0F0E17', margin: '2px 0 0', lineHeight: 1 }}>
                    {totalNow}€
                  </p>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
