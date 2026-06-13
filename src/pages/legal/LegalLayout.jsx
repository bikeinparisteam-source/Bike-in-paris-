import { useNavigate } from 'react-router-dom'
import logoVelo from '../../assets/logo-velo.png'

export default function LegalLayout({ titre, sousTitre, children }) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0C0B15', color: '#F5F0E8' }}>

      {/* Header */}
      <div style={{ background: 'rgba(8,7,16,0.95)', borderBottom: '1px solid rgba(200,136,58,0.15)', padding: '18px clamp(20px,5vw,60px)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={logoVelo} alt="" style={{ width: '28px', filter: 'drop-shadow(0 0 6px rgba(200,136,58,0.4))' }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', color: '#F5F0E8' }}>Bike in Paris</span>
          </div>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', cursor: 'pointer' }}>
            ← Retour au site
          </button>
        </div>
      </div>

      {/* Titre */}
      <div style={{ borderBottom: '1px solid rgba(58,56,80,0.4)', padding: 'clamp(32px,6vh,56px) clamp(20px,5vw,60px) 28px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(200,136,58,0.7)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '10px' }}>
            {sousTitre}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#F5F0E8', margin: 0 }}>
            {titre}
          </h1>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(32px,6vh,56px) clamp(20px,5vw,60px)' }}>
        {children}
      </div>

      {/* Footer mini */}
      <div style={{ borderTop: '1px solid rgba(58,56,80,0.3)', padding: '20px clamp(20px,5vw,60px)', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: 'rgba(245,240,232,0.25)' }}>
          © {new Date().getFullYear()} Bike in Paris — Abel Dompnier · 07 66 88 05 42
        </p>
      </div>
    </div>
  )
}

/* Composants typographiques partagés */
export function Art({ num, titre, children }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.05rem', color: '#C8883A', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'baseline' }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: 'rgba(200,136,58,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0 }}>{num}</span>
        {titre}
      </h2>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(245,240,232,0.65)', lineHeight: 1.85, paddingLeft: '0' }}>
        {children}
      </div>
    </div>
  )
}

export function Sep() {
  return <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(200,136,58,0.2), transparent)', margin: '36px 0' }} />
}

export function Info({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(58,56,80,0.3)' }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(200,136,58,0.65)', textTransform: 'uppercase', letterSpacing: '0.1em', minWidth: '140px', flexShrink: 0, paddingTop: '1px' }}>{label}</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: 'rgba(245,240,232,0.8)' }}>{value}</span>
    </div>
  )
}
