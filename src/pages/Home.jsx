import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import imgNuit from '../assets/fond-nuit.jpg'
import imgMatin from '../assets/fond-matin.jpg'
import imgApresMidi from '../assets/fond-apres-midi.jpg'
import imgVelo from '../assets/fond-velo.jpg'
import logoVelo from '../assets/logo-velo.png'
import logoEcriture from '../assets/logo-ecriture.png'
import veloFront from '../assets/velo-front.png'
import imgVeloQuais from '../assets/velo-quais.jpg'

const FRAMES = [
  { src: imgNuit,      time: '22h00', label: 'Nuit sur Paris' },
  { src: imgMatin,     time: '08h00', label: "L'aube" },
  { src: imgApresMidi, time: '14h30', label: 'En journée' },
  { src: imgVelo,      time: null,    label: null },
]
const TIMINGS = [1400, 2600, 3800, 5000]

const POINTS = [
  { icon: '◷',  text: 'Location de 2h à 14 jours selon vos envies' },
  { icon: '📞', text: 'Vérifiez les disponibilités et réservez par téléphone' },
  { icon: '🚲', text: 'Livraison dans Paris ou retrait sur place (10 rue Moreau, Paris 12e)' },
  { icon: '🔒', text: 'Antivol fourni avec chaque location' },
  { icon: '🗺', text: 'Découvrez Paris, faites des pauses, vivez à votre rythme' },
]

const TARIFS = [
  { prix: 25,  label: '2 heures',              detail: 'La balade express',          horaire: null,           img: imgMatin },
  { prix: 40,  label: 'Demi-journée · 4h',     detail: 'Matinée ou après-midi',      horaire: null,           img: imgApresMidi },
  { prix: 50,  label: 'Soirée',                detail: 'de 4 à 5h',                 horaire: null,           img: imgNuit },
  { prix: 55,  label: 'Journée',               detail: 'Matinée + après-midi',       horaire: null,           img: imgApresMidi },
  { prix: 80,  label: 'Journée + Soirée',      detail: 'La journée complète',        horaire: '8h → 00h',     img: imgVelo },
]

const STEPS = [
  { num: '01', icon: '📞', title: 'Réservation par téléphone', text: 'Appelez-nous pour vérifier les disponibilités et bloquer votre créneau en quelques minutes.' },
  { num: '02', icon: '🚲', title: 'On vous livre ou vous venez sur place', text: 'Livraison à votre adresse dans Paris, ou retrait directement au 10 rue Moreau, Paris 12ème.' },
  { num: '03', icon: '🪪', title: 'Caution et paiement', text: "Remettez votre pièce d'identité en guise de caution. Règlement par carte ou en espèces." },
  { num: '04', icon: '✨', title: 'Profitez de Paris', text: "Enfourchez votre fat bike biplace et partez explorer la capitale à votre rythme, sans contrainte." },
]

const FAQ_ITEMS = [
  {
    q: "Où louer un vélo électrique biplace à Paris ?",
    a: "Chez Bike in Paris ! Deux options : retrait gratuit au 10 rue Moreau (Paris 12ème) ou livraison à domicile dans tout Paris intra-muros pour +10€. Réservation par téléphone au 07 66 88 05 42, disponible 7j/7."
  },
  {
    q: "Quel est le prix de la location ?",
    a: "25€ pour 2 heures · 40€ demi-journée (4h) · 50€ soirée · 55€ journée complète · 80€ journée + soirée jusqu'à minuit. Livraison dans Paris +10€. Retrait au 10 rue Moreau gratuit."
  },
  {
    q: "Peut-on louer un vélo pour deux personnes à Paris ?",
    a: "C'est notre spécialité ! Le fat bike biplace est conçu pour rouler à deux. Idéal pour les couples, les amis ou les familles qui veulent découvrir Paris côte à côte le long de la Seine, à Montmartre ou dans le Marais."
  },
  {
    q: "Comment fonctionne le fat bike électrique biplace ?",
    a: "Notre vélo est équipé d'un moteur 400W et d'une batterie 22Ah pour une grande autonomie. L'assistance électrique rend la balade agréable même à deux, sans effort sur les ponts ou en montée."
  },
  {
    q: "La livraison à domicile est-elle possible ?",
    a: "Oui, nous livrons le fat bike à votre adresse dans tout Paris intra-muros pour +10€. Vous pouvez aussi venir le récupérer gratuitement au 10 rue Moreau, Paris 12ème."
  },
  {
    q: "Y a-t-il une assurance pour la location ?",
    a: "Nous proposons une assurance optionnelle via notre partenaire Laka pour 10€/jour. Elle couvre le vol, la casse accidentelle et l'assistance urgences jusqu'à 200€. Sans cette option, le locataire est responsable du matériel (valeur forfaitaire : 1 250€ en cas de vol)."
  },
  {
    q: "Puis-je tester le fat bike avant d'en acheter un ?",
    a: "Absolument — c'est même l'une de nos utilisations les plus fréquentes. Après votre test, on vous conseille objectivement sur votre achat : marques, puissance, autonomie, pièges à éviter. Le conseil est inclus."
  },
  {
    q: "Quelle zone de Paris peut-on couvrir avec le vélo ?",
    a: "Paris intra-muros et la petite couronne parisienne. Le vélo est équipé d'un GPS. C'est largement suffisant pour une belle journée : Seine, Bois de Vincennes, Montmartre, le Marais et bien plus encore."
  },
]

/* ── Hook mobile ── */
function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', h, { passive: true })
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return m
}

export default function Home() {
  const [phase, setPhase] = useState(0)
  const [heroReady, setHeroReady] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [btnHovered, setBtnHovered] = useState(false)
  const heroRef           = useRef(null)
  const sectionBiplaceRef = useRef(null)
  const section2Ref       = useRef(null)
  const section3Ref       = useRef(null)
  const section4Ref       = useRef(null)
  const section5Ref       = useRef(null)
  const navigate = useNavigate()

  const NAV_ITEMS = useMemo(() => [
    { label: 'Accueil',     ref: heroRef },
    { label: 'Expérience',  ref: sectionBiplaceRef },
    { label: 'Le Fat Bike', ref: section2Ref },
    { label: 'Tarifs',      ref: section3Ref },
    { label: 'Réserver',    ref: section4Ref },
    { label: 'Tester',      ref: section5Ref },
  ], [])

  const timersRef = useRef([])

  useEffect(() => {
    const mobile = window.innerWidth < 768
    const srcs = mobile
      ? [imgApresMidi, imgVelo]
      : [imgNuit, imgMatin, imgApresMidi, imgVelo]

    const preloads = srcs.map(src => new Promise(resolve => {
      const img = new Image()
      img.onload = resolve
      img.onerror = resolve
      img.src = src
    }))

    Promise.all(preloads).then(() => {
      if (mobile) {
        setPhase(2)
        timersRef.current = [
          setTimeout(() => setPhase(3), 1800),
          setTimeout(() => setHeroReady(true), 2800),
        ]
      } else {
        timersRef.current = [
          setTimeout(() => setPhase(1), TIMINGS[0]),
          setTimeout(() => setPhase(2), TIMINGS[1]),
          setTimeout(() => setPhase(3), TIMINGS[2]),
          setTimeout(() => setHeroReady(true), TIMINGS[3]),
        ]
      }
    })

    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  const isMobile = useIsMobile()

  const onMouseMove = (e) => {
    if (!heroRef.current) return
    const { clientWidth: w, clientHeight: h } = heroRef.current
    setMouse({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 })
  }

  return (
    <div style={{ background: '#FAF8F4' }}>

      {/* ══════════ NAVIGATION FIXE ══════════ */}
      <NavHeader items={NAV_ITEMS} />
      <MobileNav items={NAV_ITEMS} />

      {/* ══════════ SECTION 1 — HÉRO ══════════ */}
      <div ref={heroRef} onMouseMove={onMouseMove}
        style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#060606' }}
      >
        {FRAMES.slice(0, 3).map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: phase === i ? 1 : 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, backgroundImage: `url(${f.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
        <motion.div animate={{ opacity: phase === 3 ? 1 : 0 }} transition={{ duration: 2, ease: 'easeInOut' }} style={{ position: 'absolute', inset: 0 }}>
          <motion.div animate={{ x: mouse.x * -16, y: mouse.y * -10 }} transition={{ type: 'spring', stiffness: 35, damping: 22 }} style={{ position: 'absolute', inset: '-40px' }}>
            <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 24, ease: 'easeInOut', repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, backgroundImage: `url(${imgVelo})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </motion.div>
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.18) 28%, transparent 48%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(30,18,10,0.88) 0%, rgba(20,12,6,0.42) 22%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.38) 100%)' }} />

        <AnimatePresence>
          {phase < 3 && (
            <motion.div key="phrase" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 1.2 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', padding: '0 32px', textAlign: 'center' }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2rem,5vw,4rem)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.25, textShadow: '0 2px 40px rgba(0,0,0,0.7)' }}>Visiter Paris à vélo</p>
                <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 'clamp(1.4rem,3.2vw,2.6rem)', color: 'rgba(255,255,255,0.9)', marginTop: '4px', textShadow: '0 2px 30px rgba(0,0,0,0.6)', textDecoration: 'underline', textDecorationColor: 'rgba(200,136,58,0.85)', textUnderlineOffset: '6px', textDecorationThickness: '2px' }}>à toute heure</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {phase < 3 && FRAMES[phase].time && (
            <motion.div key={`c-${phase}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.65 }}
              style={{ position: 'absolute', top: '36px', right: '40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', pointerEvents: 'none' }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 200, fontSize: 'clamp(1.4rem,3.5vw,2rem)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.03em' }}>{FRAMES[phase].time}</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)', letterSpacing: '0.12em' }}>{FRAMES[phase].label}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {heroReady && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 'clamp(28px,5.5vh,58px)' }}>
              <motion.img src={logoVelo} alt="" initial={{ opacity: 0, y: -36, scale: 0.78 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}
                style={{ width: 'clamp(60px,8.5vw,96px)', marginBottom: '10px', filter: 'drop-shadow(0 0 32px rgba(200,136,58,0.28)) drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
              <motion.img src={logoEcriture} alt="Bike in Paris" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut', delay: 0.26 }}
                style={{ width: isMobile ? 'clamp(200px,62vw,260px)' : 'clamp(170px,22vw,290px)', filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.5))', marginBottom: '14px' }} />
              <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.9, delay: 0.55 }}
                style={{ width: 'clamp(48px,6vw,80px)', height: '1px', background: 'linear-gradient(to right, transparent, rgba(200,136,58,0.65), transparent)', marginBottom: '12px' }} />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.3, delay: 0.85 }}
                style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontWeight: 700, color: 'rgba(245,240,232,0.92)', fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', textShadow: '0 2px 20px rgba(0,0,0,0.6)', textDecoration: 'underline', textDecorationColor: 'rgba(200,136,58,0.85)', textUnderlineOffset: '6px', textDecorationThickness: '1.5px' }}>
                Paris s'explore autrement
              </motion.p>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {heroReady && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 'clamp(28px,7vh,60px)', gap: '14px' }}>
              <motion.button
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16,1,0.3,1], delay: 1.15 }}
                onClick={() => sectionBiplaceRef.current?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={() => setBtnHovered(true)} onMouseLeave={() => setBtnHovered(false)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                style={{
                  padding: 'clamp(13px,2vh,17px) clamp(44px,6vw,70px)', borderRadius: '50px',
                  background: btnHovered ? 'rgba(200,136,58,0.15)' : 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  border: `1.5px solid ${btnHovered ? 'rgba(200,136,58,1)' : 'rgba(200,136,58,0.75)'}`,
                  boxShadow: btnHovered ? '0 0 40px rgba(200,136,58,0.45),0 0 80px rgba(200,136,58,0.18)' : 'none',
                  cursor: 'pointer', transition: 'background .35s,border-color .35s,box-shadow .35s',
                  fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontWeight: 700,
                  fontSize: 'clamp(1rem,1.9vw,1.2rem)', color: 'rgba(255,255,255,0.95)', letterSpacing: '0.04em',
                  textShadow: btnHovered ? '0 0 20px rgba(200,136,58,0.5)' : '0 1px 8px rgba(0,0,0,0.4)',
                }}>Découvrir</motion.button>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.55 }}
                style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.78rem,1.3vw,0.95rem)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                Livraison à Paris · Retrait 12ème arrondissement
              </motion.p>
            </div>
          )}
        </AnimatePresence>
      </div>


      {/* ══════════ SECTION BIPLACE ══════════ */}
      <SectionBiplace sectionRef={sectionBiplaceRef} />
      <GoldenSep />

      {/* ══════════ SECTION 2 — FAT BIKE ══════════ */}
      <Section2 sectionRef={section2Ref} prixRef={section3Ref} />
      <GoldenSep />

      {/* ══════════ SECTION 3 — TARIFS ══════════ */}
      <Section3 sectionRef={section3Ref} />
      <GoldenSep />

      {/* ══════════ SECTION 4 — COMMENT RÉSERVER ══════════ */}
      <Section4 sectionRef={section4Ref} />
      <GoldenSep />

      {/* ══════════ SECTION 5 — TEST AVANT ACHAT ══════════ */}
      <Section5 sectionRef={section5Ref} />
      <GoldenSep />

      {/* ══════════ SECTION FAQ ══════════ */}
      <SectionFAQ />

      {/* ══════════ FOOTER LÉGAL ══════════ */}
      <footer style={{ background: '#1E1A15', borderTop: '1px solid rgba(200,136,58,0.2)', padding: 'clamp(36px,6vh,56px) clamp(24px,5vw,80px) 28px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Ligne principale */}
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row', justifyContent: isMobile ? 'flex-start' : 'space-between', gap: isMobile ? '24px' : '32px', marginBottom: '36px' }}>

            {/* Identité */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: '#F5F0E8', margin: 0 }}>Bike in Paris</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(245,240,232,0.35)', margin: 0, lineHeight: 1.6 }}>
                Location de vélo électrique bi-place<br />
                Paris — 07 66 88 05 42<br />
                abeldompnier@gmail.com
              </p>
            </div>

            {/* Liens légaux */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'rgba(200,136,58,0.6)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 4px' }}>Légal</p>
              {[
                ['Mentions légales', '/mentions-legales'],
                ['Conditions générales de vente', '/cgv'],
                ['Politique de confidentialité', '/confidentialite'],
              ].map(([label, href]) => (
                <a key={href} href={href}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: 'rgba(245,240,232,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,136,58,0.9)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.45)'}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Navigation rapide */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'rgba(200,136,58,0.6)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 4px' }}>Navigation</p>
              {[
                ['L\'expérience biplace', null],
                ['Tarifs', null],
                ['Réserver', 'tel:0766880542'],
              ].map(([label, href]) => (
                href
                  ? <a key={label} href={href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: 'rgba(30,26,21,0.45)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,136,58,0.9)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(30,26,21,0.45)'}>{label}</a>
                  : <span key={label} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: 'rgba(245,240,232,0.45)' }}>{label}</span>
              ))}
            </div>
          </div>

          {/* Bas de footer */}
          <div style={{ borderTop: '1px solid rgba(245,240,232,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: 'rgba(245,240,232,0.2)', margin: 0 }}>
              © {new Date().getFullYear()} Bike in Paris — Abel Dompnier · Tous droits réservés
            </p>
            {/* Accès interne discret */}
            <button
              onClick={() => navigate('/contrat')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.2, transition: 'opacity 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.2'}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(245,240,232,0.9)" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'rgba(245,240,232,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Accès interne</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  )
}


/* ─────────────────────────────────────────────
   SÉPARATEUR DORÉ
───────────────────────────────────────────── */
function GoldenSep() {
  return (
    <div style={{ position: 'relative', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(24px,5vw,80px)' }}>
      <div style={{ position: 'absolute', left: 'clamp(24px,5vw,80px)', right: 'clamp(24px,5vw,80px)', height: '1px', background: 'linear-gradient(to right, transparent, rgba(200,136,58,0.18) 12%, rgba(200,136,58,0.35) 50%, rgba(200,136,58,0.18) 88%, transparent)' }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '28px', height: '1px', background: 'linear-gradient(to left, rgba(200,136,58,0.4), transparent)' }} />
        <div style={{ width: '6px', height: '6px', transform: 'rotate(45deg)', border: '1px solid rgba(200,136,58,0.55)', background: 'rgba(200,136,58,0.08)' }} />
        <div style={{ width: '28px', height: '1px', background: 'linear-gradient(to right, rgba(200,136,58,0.4), transparent)' }} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SECTION FAQ
───────────────────────────────────────────── */
function SectionFAQ() {
  const innerRef = useRef(null)
  const isInView = useInView(innerRef, { once: true, margin: '-60px' })
  const [open, setOpen] = useState(null)

  return (
    <div style={{ background: 'linear-gradient(180deg, #F3EFE8 0%, #E8E3DB 100%)', padding: 'clamp(80px,12vh,120px) clamp(24px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse, rgba(200,130,40,0.09) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div ref={innerRef} style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vh,72px)' }}
        >
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.24em', marginBottom: '12px' }}>
            Questions fréquentes
          </p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#1E1A15', margin: 0 }}>
            Vous avez des <em style={{ color: 'rgba(200,136,58,0.9)' }}>questions ?</em>
          </h2>
        </motion.div>

        {/* Accordéon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.05 + i * 0.07 }}
                style={{
                  borderRadius: '16px',
                  border: `1px solid ${isOpen ? 'rgba(200,136,58,0.35)' : 'rgba(30,26,21,0.5)'}`,
                  background: isOpen ? 'rgba(200,136,58,0.05)' : 'rgba(30,26,21,0.04)',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, background 0.3s',
                }}
              >
                {/* Question */}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '16px', padding: '20px 24px',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 'clamp(0.95rem,1.6vw,1.1rem)', color: isOpen ? '#1E1A15' : 'rgba(30,26,21,0.8)', lineHeight: 1.3, transition: 'color 0.2s' }}>
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: isOpen ? 'rgba(200,136,58,0.18)' : 'rgba(30,26,21,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#C8883A' : 'rgba(30,26,21,0.45)'} strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </motion.div>
                </button>

                {/* Réponse */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 24px 22px', paddingLeft: '24px' }}>
                        <div style={{ height: '1px', background: 'rgba(200,136,58,0.15)', marginBottom: '16px' }} />
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(0.88rem,1.4vw,1rem)', color: 'rgba(30,26,21,0.65)', lineHeight: 1.75, margin: 0 }}>
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* CTA bas */}
        <motion.div
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.7 }}
          style={{ textAlign: 'center', marginTop: 'clamp(40px,7vh,64px)' }}
        >
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(30,26,21,0.4)', fontSize: '0.88rem', marginBottom: '18px' }}>
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <a
            href="tel:0766880542"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '13px 30px', borderRadius: '50px', background: 'rgba(200,136,58,0.1)', border: '1.5px solid rgba(200,136,58,0.4)', textDecoration: 'none', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,136,58,0.18)'; e.currentTarget.style.borderColor = 'rgba(200,136,58,0.7)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,136,58,0.1)'; e.currentTarget.style.borderColor = 'rgba(200,136,58,0.4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(200,136,58,0.9)" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '0.95rem', color: 'rgba(200,136,58,0.95)' }}>Appelez-nous — 07 66 88 05 42</span>
          </a>
        </motion.div>

      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   MOBILE NAV — Burger + drawer latéral
───────────────────────────────────────────── */
function MobileNav({ items }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    const update = () => {
      const dists = items.map(({ ref }) =>
        ref?.current ? Math.abs(ref.current.getBoundingClientRect().top) : Infinity
      )
      const nearest = Math.min(...dists)
      if (isFinite(nearest)) setActive(dists.indexOf(nearest))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [items])

  if (!isMobile) return null

  const handleNav = (ref) => {
    ref?.current?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      {/* Bouton hamburger */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label="Menu navigation"
        style={{
          position: 'fixed', top: '16px', right: '16px', zIndex: 200,
          width: '44px', height: '44px', borderRadius: '50%',
          background: open ? 'rgba(200,136,58,0.18)' : 'rgba(10,7,4,0.58)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: `1.5px solid ${open ? 'rgba(200,136,58,0.72)' : 'rgba(200,136,58,0.32)'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '5px', cursor: 'pointer', padding: 0,
          boxShadow: open ? '0 0 22px rgba(200,136,58,0.28)' : '0 4px 20px rgba(0,0,0,0.38)',
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0, y: open ? 6.5 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(245,240,232,0.92)', borderRadius: '1px', transformOrigin: 'center' }}
        />
        <motion.span
          animate={{ opacity: open ? 0 : 1, x: open ? 6 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'block', width: '12px', height: '1.5px', background: 'rgba(200,136,58,0.85)', borderRadius: '1px', marginLeft: '5px' }}
        />
        <motion.span
          animate={{ rotate: open ? -45 : 0, y: open ? -6.5 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(245,240,232,0.92)', borderRadius: '1px', transformOrigin: 'center' }}
        />
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            transition={{ duration: 0.3 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.54)', zIndex: 175, backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(78vw, 300px)',
              zIndex: 195,
              background: 'linear-gradient(158deg, #1D1508 0%, #0E0A05 100%)',
              borderLeft: '1px solid rgba(200,136,58,0.16)',
              boxShadow: '-24px 0 80px rgba(0,0,0,0.58)',
              display: 'flex', flexDirection: 'column',
              padding: '72px 28px 40px',
              overflow: 'hidden',
            }}
          >
            {/* Orbs ambre décoratifs */}
            <div style={{ position: 'absolute', top: '-15%', right: '-25%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(200,136,58,0.15) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '8%', left: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(200,100,30,0.09) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <img src={logoVelo} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain', opacity: 0.85 }} />
              <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '0.88rem', color: 'rgba(200,136,58,0.72)', letterSpacing: '0.06em' }}>Bike in Paris</span>
            </div>

            {/* Eyebrow */}
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.58rem', color: 'rgba(200,136,58,0.42)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '18px', margin: '0 0 18px' }}>
              Navigation
            </p>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              {items.map((item, i) => {
                const isActive = i === active
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.055, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleNav(item.ref)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '13px 14px', borderRadius: '12px', cursor: 'pointer',
                      background: isActive ? 'rgba(200,136,58,0.08)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(200,136,58,0.2)' : 'transparent'}`,
                      transition: 'all 0.22s',
                    }}
                  >
                    <div style={{
                      width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                      background: isActive ? '#C8883A' : 'rgba(200,136,58,0.2)',
                      boxShadow: isActive ? '0 0 10px rgba(200,136,58,0.65)' : 'none',
                      transition: 'all 0.22s',
                    }} />
                    <span style={{
                      fontFamily: isActive ? "'Playfair Display',serif" : "'DM Sans',sans-serif",
                      fontStyle: isActive ? 'italic' : 'normal',
                      fontWeight: isActive ? 700 : 400,
                      fontSize: isActive ? '1.08rem' : '0.9rem',
                      color: isActive ? '#C8883A' : 'rgba(245,240,232,0.46)',
                      transition: 'all 0.22s',
                    }}>
                      {item.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Footer téléphone */}
            <div style={{ borderTop: '1px solid rgba(200,136,58,0.1)', paddingTop: '22px' }}>
              <a href="tel:0766880542" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(200,136,58,0.1)', border: '1px solid rgba(200,136,58,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(200,136,58,0.8)" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: '0 0 3px', fontFamily: "'DM Sans',sans-serif", fontSize: '0.6rem', color: 'rgba(200,136,58,0.5)', textTransform: 'uppercase', letterSpacing: '0.18em', lineHeight: 1 }}>Réserver</p>
                  <p style={{ margin: 0, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '0.88rem', color: 'rgba(245,240,232,0.62)', letterSpacing: '0.04em' }}>07 66 88 05 42</p>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


/* ─────────────────────────────────────────────
   NAV HEADER — Ligne + cercles + logo glissant
───────────────────────────────────────────── */
function NavHeader({ items }) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const update = () => {
      const dists = items.map(({ ref }) =>
        ref?.current ? Math.abs(ref.current.getBoundingClientRect().top) : Infinity
      )
      const nearest = Math.min(...dists)
      if (isFinite(nearest)) setActive(dists.indexOf(nearest))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [items])

  if (isMobile) return null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: isMobile ? '0 0 10px' : '0 0 14px',
        height: isMobile ? '54px' : '70px',
        background: 'none',
        transition: 'none',
      }}
    >
      <div style={{ position: 'relative', width: 'min(820px, 90vw)' }}>

        {/* Ligne ambre horizontale */}
        <div style={{
          position: 'absolute',
          bottom: '13px',
          left: 0, right: 0,
          height: '1px',
          background: active > 0
            ? 'linear-gradient(to right, transparent, rgba(30,26,21,0.12) 8%, rgba(30,26,21,0.28) 50%, rgba(30,26,21,0.12) 92%, transparent)'
            : 'linear-gradient(to right, transparent, rgba(200,136,58,0.16) 8%, rgba(200,136,58,0.52) 50%, rgba(200,136,58,0.16) 92%, transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          {items.map((item, i) => {
            const isActive = i === active
            return (
              <div
                key={i}
                onClick={() => item.ref?.current?.scrollIntoView({ behavior: 'smooth' })}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
              >
                {/* Label — caché sur mobile */}
                {!isMobile && (
                  <motion.span
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.54rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: active > 0
                        ? (isActive ? '#C8883A' : 'rgba(30,26,21,0.5)')
                        : (isActive ? '#C8883A' : 'rgba(255,255,255,0.75)'),
                      fontWeight: isActive ? 700 : 400,
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                      lineHeight: 1,
                      display: 'block',
                      textShadow: active === 0 ? '0 1px 6px rgba(0,0,0,0.8)' : 'none',
                    }}
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Cercle */}
                <motion.div
                  animate={{
                    borderColor: active > 0
                      ? (isActive ? '#C8883A' : 'rgba(30,26,21,0.75)')
                      : (isActive ? '#C8883A' : 'rgba(200,136,58,0.28)'),
                    background: active > 0
                      ? (isActive ? '#C8883A' : '#1E1A15')
                      : (isActive ? 'rgba(200,136,58,0.13)' : 'rgba(255,255,255,0.08)'),
                    boxShadow: isActive
                      ? (active > 0 ? '0 0 12px rgba(200,136,58,0.4)' : '0 0 18px rgba(200,136,58,0.65), 0 0 0 4px rgba(200,136,58,0.1)')
                      : 'none',
                    scale: isActive ? 1.14 : (hovered ? 1.05 : 1),
                  }}
                  transition={{ duration: 0.38, ease: [0.16,1,0.3,1] }}
                  style={{
                    width: isMobile ? '32px' : '26px', height: isMobile ? '32px' : '26px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(200,136,58,0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, position: 'relative', zIndex: 1,
                  }}
                >
                  {/* Logo glissant — layoutId assure l'animation spring entre cercles */}
                  {isActive && (
                    <motion.img
                      layoutId="nav-velo"
                      src={logoVelo}
                      alt=""
                      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                      style={{ width: '14px', height: '14px', objectFit: 'contain', filter: active > 0 ? 'brightness(0) invert(1)' : 'none' }}
                    />
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   SECTION BIPLACE — DÉCOUVREZ PARIS CÔTE À CÔTE
───────────────────────────────────────────── */
function SectionBiplace({ sectionRef }) {
  const innerRef = useRef(null)
  const isInView = useInView(innerRef, { once: true, margin: '-80px' })
  const [cardFlipped, setCardFlipped] = useState(false)
  const isMobile = useIsMobile()

  const features = [
    { icon: '🛋️', label: 'Confortable', spec: null,    desc: 'Selle biplace ergonomique et amortissement optimal pour deux passagers.' },
    { icon: '⚡', label: 'Puissant',    spec: '400W',  desc: 'Moteur électrique haute performance pour gravir les côtes parisiennes sans effort.' },
    { icon: '🔋', label: 'Grande autonomie', spec: '22 Ah', desc: 'Batterie longue durée pour explorer Paris du matin jusqu\'au soir.' },
  ]

  return (
    <div ref={sectionRef} style={{ background: 'linear-gradient(180deg, #FAF8F4 0%, #F2EDE5 50%, #FAF8F4 100%)', padding: 'clamp(48px,8vh,80px) clamp(24px,5vw,80px)', overflow: 'hidden', position: 'relative' }}>

      {/* Lumière d'auberge — ambre chaud */}
      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '900px', height: '900px', background: 'radial-gradient(circle, rgba(200,130,40,0.22) 0%, rgba(170,95,25,0.09) 45%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '-8%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(160,85,25,0.18) 0%, rgba(110,55,15,0.07) 45%, transparent 70%)', filter: 'blur(65px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '1100px', height: '350px', background: 'radial-gradient(ellipse, rgba(200,130,40,0.07) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div ref={innerRef} style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Image + bullets ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(32px,6vw,96px)', alignItems: 'center' }}>

          {/* Image velo sur les quais — carte retournable */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16,1,0.3,1], delay: 0.18 }}
            style={{ position: 'relative' }}
          >
            {/* Aura ambre */}
            <div style={{ position: 'absolute', inset: '-20px', borderRadius: '32px', background: 'radial-gradient(ellipse, rgba(200,136,58,0.12) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

            {/* Zone 3D — events sur le wrapper fixe, pas sur l'élément qui tourne */}
            <div
              onMouseEnter={() => !isMobile && setCardFlipped(true)}
              onMouseLeave={() => !isMobile && setCardFlipped(false)}
              onClick={() => isMobile && setCardFlipped(f => !f)}
              style={{ perspective: '1400px', position: 'relative', zIndex: 1, cursor: 'pointer' }}
            >
              <motion.div
                animate={{ rotateY: cardFlipped ? 180 : 0 }}
                transition={{ duration: 0.78, ease: [0.16,1,0.3,1] }}
                style={{ position: 'relative', transformStyle: 'preserve-3d', width: '100%', aspectRatio: '4/3', pointerEvents: 'none' }}
              >

                {/* ── FACE AVANT — photo ── */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  borderRadius: '20px', overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(30,26,21,0.06)',
                }}>
                  <img src={imgVeloQuais} alt="Vélo biplace sur les quais de Paris"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>

                {/* ── FACE ARRIÈRE — texte carte ── */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '20px',
                  background: 'linear-gradient(145deg, #FAF8F4 0%, #F2EDE5 100%)',
                  border: '1.5px solid rgba(200,136,58,0.42)',
                  boxShadow: '0 0 0 6px rgba(200,136,58,0.05), inset 0 0 90px rgba(200,136,58,0.04), 0 30px 80px rgba(0,0,0,0.55)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: 'clamp(24px,4vw,40px) clamp(22px,4vw,36px)',
                }}>
                  {/* Coins dorés */}
                  {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
                    <div key={`${v}${h}`} style={{
                      position: 'absolute', [v]: '18px', [h]: '18px',
                      width: '28px', height: '28px',
                      borderTop:    v === 'top'    ? '1.5px solid rgba(200,136,58,0.72)' : 'none',
                      borderBottom: v === 'bottom' ? '1.5px solid rgba(200,136,58,0.72)' : 'none',
                      borderLeft:   h === 'left'   ? '1.5px solid rgba(200,136,58,0.72)' : 'none',
                      borderRight:  h === 'right'  ? '1.5px solid rgba(200,136,58,0.72)' : 'none',
                    }} />
                  ))}

                  {/* Ornement haut */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
                    <div style={{ height: '1px', width: '38px', background: 'linear-gradient(to left, rgba(200,136,58,0.6), transparent)' }} />
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(200,136,58,0.75)' }} />
                    <div style={{ height: '1px', width: '38px', background: 'linear-gradient(to right, rgba(200,136,58,0.6), transparent)' }} />
                  </div>

                  {/* Texte en italique */}
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.85rem, 1.2vw, 1.02rem)',
                    color: 'rgba(30,26,21,0.72)',
                    lineHeight: 1.92,
                    textAlign: 'center',
                    margin: 0,
                  }}>
                    Nos vélos électriques bi-places premium vous permettent de rouler, de discuter et de partager chaque panorama ensemble. C'est l'expérience parfaite pour se balader le long de la Seine, visiter le quartier de Montmartre et vivre la Ville Lumière en parfaite complicité.
                  </p>

                  {/* Ornement bas */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '22px' }}>
                    <div style={{ height: '1px', width: '38px', background: 'linear-gradient(to left, rgba(200,136,58,0.6), transparent)' }} />
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(200,136,58,0.75)' }} />
                    <div style={{ height: '1px', width: '38px', background: 'linear-gradient(to right, rgba(200,136,58,0.6), transparent)' }} />
                  </div>
                </div>

              </motion.div>
            </div>
          </motion.div>

          {/* Texte droite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.28 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.24em', marginBottom: '16px' }}>
                Notre vélo
              </p>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,3rem)', color: '#1E1A15', lineHeight: 1.2, margin: 0 }}>
                Découvrez Paris,<br /><span style={{ fontStyle: 'italic', color: 'rgba(200,136,58,0.9)' }}>côte à côte.</span>
              </h3>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.42 }}
              style={{ height: '1px', background: 'linear-gradient(to right, rgba(200,136,58,0.45), transparent)', transformOrigin: 'left' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.5 + i * 0.13 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(200,136,58,0.1)', border: '1px solid rgba(200,136,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    {feat.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.05rem', color: '#1E1A15', margin: '0 0 5px', lineHeight: 1.2 }}>
                      {feat.label}
                      {feat.spec && <span style={{ color: '#C8883A', marginLeft: '8px', fontStyle: 'normal' }}>{feat.spec}</span>}
                    </p>
                    {!isMobile && <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(30,26,21,0.52)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   SECTION 2 — PRÉSENTATION DU VÉLO
───────────────────────────────────────────── */
function Section2({ sectionRef, prixRef }) {
  const innerRef = useRef(null)
  const isInView = useInView(innerRef, { once: true, margin: '-80px' })
  const isMobile = useIsMobile()

  return (
    <div ref={sectionRef} style={{ minHeight: '100vh', position: 'relative', background: 'linear-gradient(160deg, #FAF8F4 0%, #F0ECE4 50%, #FAF8F4 100%)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '25%', left: '15%', width: '850px', height: '850px', background: 'radial-gradient(circle, rgba(200,130,40,0.07) 0%, rgba(160,90,20,0.04) 45%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '8%', right: '-8%', width: '550px', height: '550px', background: 'radial-gradient(circle, rgba(165,90,25,0.06) 0%, transparent 65%)', filter: 'blur(55px)', pointerEvents: 'none' }} />

      <div ref={innerRef} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: 'clamp(48px,8vh,88px) clamp(24px,5vw,80px)', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(32px,6vw,80px)', alignItems: 'center' }}>

        {/* Texte */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', order: isMobile ? 2 : 1 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.15 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(200,136,58,0.8)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '12px' }}>Notre offre</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,3rem)', color: '#1E1A15', lineHeight: 1.2, margin: 0 }}>
              Louer votre fat bike<br /><span style={{ fontStyle: 'italic', color: 'rgba(200,136,58,0.9)' }}>biplace</span>
            </h2>
          </motion.div>

          <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={isInView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ height: '1px', background: 'linear-gradient(to right, rgba(200,136,58,0.5), transparent)', transformOrigin: 'left' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {POINTS.map((pt, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.35 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(200,136,58,0.12)', border: '1px solid rgba(200,136,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', fontSize: '1rem' }}>{pt.icon}</div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(30,26,21,0.85)', fontSize: 'clamp(0.9rem,1.5vw,1.05rem)', lineHeight: 1.55, margin: 0, paddingTop: '6px' }}>{pt.text}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA : téléphone + voir les prix */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <a href="tel:0766880542" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '13px 26px', borderRadius: '50px', background: 'linear-gradient(135deg, rgba(200,136,58,0.18), rgba(200,136,58,0.08))', border: '1.5px solid rgba(200,136,58,0.6)', textDecoration: 'none' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(200,136,58,0.9)" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '1rem', color: 'rgba(200,136,58,0.95)', letterSpacing: '0.04em' }}>07 66 88 05 42</span>
            </a>

            <button
              onClick={() => prixRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '50px', background: 'rgba(30,26,21,0.06)', border: '1.5px solid rgba(30,26,21,0.2)', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,26,21,0.12)'; e.currentTarget.style.borderColor = 'rgba(30,26,21,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,26,21,0.06)'; e.currentTarget.style.borderColor = 'rgba(30,26,21,0.2)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(30,26,21,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M2 12h20"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: '0.95rem', color: 'rgba(30,26,21,0.75)' }}>Voir les prix</span>
            </button>
          </motion.div>

          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: 'rgba(30,26,21,0.3)', fontSize: '0.78rem', margin: 0 }}>
            Disponible 7j/7 pour réserver votre aventure
          </p>
        </div>

        {/* Vélo — droite (1er sur mobile) */}
        <motion.div initial={{ opacity: 0, x: isMobile ? 0 : 60 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', order: isMobile ? 1 : 2 }}>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '40px', background: 'radial-gradient(ellipse, rgba(200,136,58,0.22) 0%, transparent 70%)', filter: 'blur(12px)' }} />
          <motion.img src={veloFront} alt="Fat bike biplace" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
            style={{ width: '100%', maxWidth: '520px', filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(200,136,58,0.08))' }} />
        </motion.div>
      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   SECTION 3 — TARIFS
───────────────────────────────────────────── */
const FORMULES = [
  {
    label: '2 heures',
    prix: 25,
    img: imgMatin,
    desc: 'La balade express — idéale pour une découverte des quais ou du Marais.',
    horaire: 'Dès 9h du matin',
  },
  {
    label: 'Demi-journée',
    prix: 40,
    img: imgApresMidi,
    desc: 'Matinée / Après-midi / Soirée',
    horaire: '4 heures consécutives',
    popular: true,
  },
  {
    label: 'Journée',
    prix: 55,
    img: imgNuit,
    desc: 'Notre formule la plus complète.',
    horaire: '9h → 19h',
    midnight: true,
  },
]

function Section3({ sectionRef }) {
  const innerRef = useRef(null)
  const isInView = useInView(innerRef, { once: true, margin: '-60px' })
  const [selected, setSelected] = useState(1)
  const isMobile = useIsMobile()

  return (
    <div ref={sectionRef} style={{ background: '#EDEAE3', padding: 'clamp(70px,12vh,120px) clamp(24px,5vw,80px)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-12%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '550px', background: 'radial-gradient(ellipse, rgba(200,130,40,0.06) 0%, rgba(160,90,20,0.05) 50%, transparent 70%)', filter: 'blur(65px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '-8%', width: '550px', height: '450px', background: 'radial-gradient(ellipse, rgba(155,85,22,0.05) 0%, transparent 70%)', filter: 'blur(55px)', pointerEvents: 'none' }} />

      <div ref={innerRef} style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Titre */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(36px,6vh,52px)' }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.24em', marginBottom: '12px' }}>Tarifs</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#1E1A15', margin: '0 0 14px' }}>
            Choisissez votre <em style={{ color: 'rgba(200,136,58,0.9)' }}>moment</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(30,26,21,0.45)', fontSize: 'clamp(0.88rem,1.4vw,1rem)', margin: 0 }}>
            Louer de 9h à 0h00
          </p>
        </motion.div>

        {/* Sélecteur 3 pills */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: 'clamp(28px,5vh,44px)', flexWrap: 'wrap' }}>
          {FORMULES.map((f, i) => (
            <motion.button key={i} onClick={() => setSelected(i)}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
              style={{
                padding: '11px 30px', borderRadius: '50px',
                background: selected === i ? '#C8883A' : 'transparent',
                border: `1.5px solid ${selected === i ? '#C8883A' : 'rgba(200,136,58,0.45)'}`,
                color: selected === i ? '#fff' : 'rgba(30,26,21,0.65)',
                fontFamily: "'DM Sans',sans-serif", fontWeight: selected === i ? 700 : 400,
                fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.28s',
                letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '7px',
                boxShadow: selected === i ? '0 6px 24px rgba(200,136,58,0.35)' : 'none',
              }}>
              {f.label}
              {f.popular && <span style={{ fontSize: '0.6rem', opacity: 0.85 }}>★</span>}
              {f.midnight && <span style={{ fontSize: '0.75rem' }}>🌙</span>}
            </motion.button>
          ))}
        </motion.div>

        {/* Carte centrale */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.35, ease: [0.16,1,0.3,1] }}>
          <AnimatePresence mode="wait">
            <motion.div key={selected}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
              style={{
                position: 'relative', borderRadius: '28px', overflow: 'hidden',
                height: 'clamp(340px,46vh,500px)',
                boxShadow: '0 32px 90px rgba(0,0,0,0.48), 0 0 0 1px rgba(200,136,58,0.1)',
              }}>

              {/* Photo */}
              <img src={FORMULES[selected].img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.42) 100%)' }} />

              {/* Badge Le plus choisi */}
              {FORMULES[selected].popular && (
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                  style={{ position: 'absolute', top: '22px', left: '22px', padding: '7px 16px', borderRadius: '50px', background: 'rgba(200,136,58,0.18)', border: '1px solid rgba(200,136,58,0.55)', backdropFilter: 'blur(10px)' }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '0.7rem', color: 'rgba(200,136,58,1)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>★ Le plus choisi</span>
                </motion.div>
              )}

              {/* Badge 0h00 */}
              {FORMULES[selected].midnight && (
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                  style={{ position: 'absolute', top: '22px', right: '22px', padding: '8px 18px', borderRadius: '50px', background: 'rgba(10,6,2,0.82)', border: '1px solid rgba(200,136,58,0.55)', backdropFilter: 'blur(12px)', boxShadow: '0 0 20px rgba(200,136,58,0.2)' }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: '#C8883A', letterSpacing: '0.08em', display: 'block' }}>🌙 Jusqu'à 0h00</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: '0.65rem', color: 'rgba(200,136,58,0.65)', letterSpacing: '0.06em', display: 'block', marginTop: '2px' }}>moyennant un supplément</span>
                </motion.div>
              )}

              {/* Contenu centré */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
                  style={{ marginBottom: '18px', padding: '7px 20px', borderRadius: '50px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(255,255,255,0.92)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.12em' }}>
                    {FORMULES[selected].horaire}
                  </span>
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}
                  style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(5rem,12vw,8rem)', color: '#fff', lineHeight: 1, margin: 0, textAlign: 'center' }}>
                  {FORMULES[selected].prix}<span style={{ fontSize: '0.42em', color: 'rgba(200,136,58,0.9)', verticalAlign: 'super', marginLeft: '6px' }}>€</span>
                </motion.p>
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ width: '48px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(200,136,58,0.7), transparent)', margin: '16px 0', transformOrigin: 'center' }} />
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: 0.5 }}
                  style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontWeight: 700, color: 'rgba(255,255,255,0.88)', fontSize: 'clamp(1.05rem,2vw,1.3rem)', textAlign: 'center', margin: 0, maxWidth: '500px', lineHeight: 1.65 }}>
                  {FORMULES[selected].desc}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Badge minuit permanent — argument de vente */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.55 }}
          style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '9px',
            padding: '10px 26px', borderRadius: '50px',
            background: 'rgba(12,8,2,0.8)', border: '1px solid rgba(200,136,58,0.3)',
            boxShadow: '0 0 28px rgba(200,136,58,0.1)',
            fontFamily: "'DM Sans',sans-serif", fontSize: '0.82rem', color: 'rgba(245,240,232,0.78)', letterSpacing: '0.04em',
          }}>
            🌙 <span>Toutes nos formules disponibles <strong style={{ color: 'rgba(200,136,58,0.92)', fontWeight: 700 }}>jusqu'à 0h00</strong> · Possibilité de louer juste une soirée</span>
          </span>
        </motion.div>

        {/* Strip livraison · retrait · assurance */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.7 }}
          style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '10px', marginTop: '28px' }}>
          {[
            { icon: '🛵', label: 'Livraison Paris', detail: '+10 €', sub: 'À votre adresse', amber: true },
            { icon: '📍', label: 'Retrait sur place', detail: 'Gratuit', sub: '10 rue Moreau, 75012', amber: false },
            { icon: '🛡️', label: 'Assurance Laka', detail: '+10 €/j', sub: 'Vol & casse couverts', amber: true },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', textAlign: 'center',
              padding: '18px 14px', borderRadius: '16px',
              background: item.amber ? 'rgba(200,136,58,0.07)' : 'rgba(30,26,21,0.05)',
              border: `1px solid ${item.amber ? 'rgba(200,136,58,0.2)' : 'rgba(30,26,21,0.1)'}`,
            }}>
              <span style={{ fontSize: '1.35rem', marginBottom: '3px' }}>{item.icon}</span>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#1E1A15', margin: 0 }}>{item.label}</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1rem', color: item.amber ? '#C8883A' : '#1E1A15', margin: 0 }}>{item.detail}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: 'rgba(30,26,21,0.4)', margin: 0, lineHeight: 1.4 }}>{item.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Note bas */}
        <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.9 }}
          style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', textAlign: 'center', color: 'rgba(30,26,21,0.25)', fontSize: '0.82rem', marginTop: '22px', marginBottom: 0 }}>
          Antivol inclus · Casques disponibles sur demande · Chargeur fourni
        </motion.p>

      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   BOUTON TÉLÉPHONE PREMIUM
───────────────────────────────────────────── */
function PhoneBtn({ label = 'Réserver' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href="tel:0766880542"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '16px',
        padding: '16px 38px', borderRadius: '50px',
        background: hovered ? 'linear-gradient(135deg, #D4923E, #B8721E)' : 'linear-gradient(135deg, #C8883A, #A86C22)',
        border: '1.5px solid rgba(255,255,255,0.18)',
        boxShadow: hovered
          ? '0 0 52px rgba(200,136,58,0.55), 0 10px 36px rgba(160,100,20,0.45)'
          : '0 4px 24px rgba(160,100,20,0.35)',
        textDecoration: 'none', cursor: 'pointer',
        transition: 'border-color 0.35s, box-shadow 0.35s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Shimmer sweep */}
      <motion.div
        animate={hovered ? { x: ['−120%', '220%'] } : { x: '-120%' }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent 0%, rgba(200,136,58,0.18) 50%, transparent 100%)',
          width: '60%',
        }}
      />
      {/* Icône téléphone — vibre au hover */}
      <motion.div
        animate={hovered ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] } : { rotate: 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        style={{ flexShrink: 0 }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="2.2" strokeLinecap="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      </motion.div>
      {/* Texte deux lignes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 400, fontSize: '0.62rem', color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: '0.22em', lineHeight: 1 }}>
          {label}
        </span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '1.02rem', color: '#fff', letterSpacing: '0.06em', lineHeight: 1.2 }}>
          07 66 88 05 42
        </span>
      </div>
    </motion.a>
  )
}

/* ─────────────────────────────────────────────
   SECTION 4 — COMMENT RÉSERVER
───────────────────────────────────────────── */
function Section4({ sectionRef }) {
  const innerRef = useRef(null)
  const isInView = useInView(innerRef, { once: true, margin: '-60px' })

  return (
    <div ref={sectionRef} style={{ background: 'linear-gradient(180deg, #EDEAE3 0%, #FAF8F4 100%)', padding: 'clamp(70px,12vh,120px) clamp(24px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(200,136,58,0.06) 0%, rgba(200,136,58,0.02) 50%, transparent 70%)', filter: 'blur(55px)', pointerEvents: 'none' }} />
      <div ref={innerRef} style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Titre */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vh,80px)' }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.24em', marginBottom: '12px' }}>Simple & rapide</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#1E1A15', margin: 0 }}>
            Comment <em style={{ color: 'rgba(200,136,58,0.9)' }}>réserver</em>
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -14 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 + i * 0.15 }}
              style={{ display: 'flex', gap: 'clamp(24px,4vw,48px)', alignItems: 'flex-start', paddingBottom: i < STEPS.length - 1 ? '40px' : 0, position: 'relative' }}
            >
              {/* Ligne verticale entre les steps */}
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute', left: 'calc(clamp(24px,4vw,48px) / 2 + 22px)', top: '60px', bottom: 0, width: '1px', background: 'linear-gradient(to bottom, rgba(200,136,58,0.25), rgba(200,136,58,0.05))' }} />
              )}

              {/* Numéro + icône */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(200,136,58,0.12)', border: '1.5px solid rgba(200,136,58,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  {step.icon}
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '0.62rem', color: 'rgba(200,136,58,0.5)', letterSpacing: '0.1em' }}>{step.num}</span>
              </div>

              {/* Texte */}
              <div style={{ paddingTop: '6px' }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(1.1rem,2vw,1.4rem)', color: '#1E1A15', margin: '0 0 10px', lineHeight: 1.2 }}>{step.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(30,26,21,0.6)', fontSize: 'clamp(0.9rem,1.4vw,1.02rem)', lineHeight: 1.65, margin: 0 }}>{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA final */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: 'clamp(48px,8vh,80px)' }}>
          <PhoneBtn label="Réserver" />
        </motion.div>

      </div>
    </div>
  )
}


/* ─────────────────────────────────────────────
   SECTION 5 — TESTER AVANT D'ACHETER
───────────────────────────────────────────── */
function Section5({ sectionRef }) {
  const innerRef = useRef(null)
  const isInView = useInView(innerRef, { once: true, margin: '-80px' })
  const isMobile = useIsMobile()

  return (
    <div ref={sectionRef} style={{ position: 'relative', background: '#F3EFE8', overflow: 'hidden', padding: 'clamp(80px,14vh,140px) clamp(24px,5vw,80px)' }}>
      <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: '750px', height: '750px', background: 'radial-gradient(circle, rgba(200,130,40,0.07) 0%, rgba(155,85,20,0.04) 45%, transparent 70%)', filter: 'blur(65px)', pointerEvents: 'none' }} />

      {/* Vélo en filigrane — caché sur mobile */}
      {!isMobile && <img src={veloFront} alt="" aria-hidden style={{ position: 'absolute', right: '-4%', top: '50%', transform: 'translateY(-50%)', width: 'clamp(280px,36vw,520px)', opacity: 0.04, pointerEvents: 'none', userSelect: 'none' }} />}

      {/* Grand guillemet décoratif */}
      <div style={{ position: 'absolute', top: 'clamp(30px,6vh,60px)', left: 'clamp(24px,5vw,80px)', fontFamily: "'Playfair Display',serif", fontSize: 'clamp(80px,14vw,160px)', color: 'rgba(200,136,58,0.12)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>"</div>

      <div ref={innerRef} style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 6 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
          style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.24em', marginBottom: '20px' }}
        >Louer avant d'acheter</motion.p>

        {/* Titre */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1 }}
          style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 'clamp(1.9rem,4vw,3.2rem)', color: '#1E1A15', lineHeight: 1.18, margin: '0 0 clamp(32px,5vh,52px)' }}
        >
          Testez les sensations du Fat Bike<br />
          <em style={{ color: 'rgba(200,136,58,0.9)' }}>avant d'en acheter un !</em>
        </motion.h2>

        {/* Paragraphe 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.22 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '3px', flexShrink: 0, alignSelf: 'stretch', background: 'linear-gradient(to bottom, rgba(200,136,58,0.7), rgba(200,136,58,0.1))', borderRadius: '2px', marginTop: '4px' }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(30,26,21,0.75)', fontSize: 'clamp(0.95rem,1.5vw,1.1rem)', lineHeight: 1.75, margin: 0 }}>
              {isMobile
                ? <>Testez les vraies sensations du Fat Bike dans Paris avant d'acheter — <strong style={{ color: 'rgba(30,26,21,0.95)', fontWeight: 600 }}>c'est la meilleure façon d'être sûr de votre choix.</strong></>
                : <>Beaucoup de nos clients louent nos vélos pour quelques heures ou quelques jours dans un but précis : <strong style={{ color: 'rgba(30,26,21,0.95)', fontWeight: 600 }}>tester les vraies sensations du Fat Bike sur le terrain avant de franchir le pas de l'achat.</strong> C'est la meilleure manière d'être sûr de votre choix. Un essai de 10 minutes autour d'un magasin ne suffit pas pour valider votre futur investissement.</>
              }
            </p>
          </div>
        </motion.div>

        {/* Séparateur */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }} animate={isInView ? { scaleX: 1, opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.35 }}
          style={{ height: '1px', background: 'linear-gradient(to right, rgba(200,136,58,0.3), rgba(200,136,58,0.06), transparent)', transformOrigin: 'left', marginBottom: '32px' }}
        />

        {/* Paragraphe 2 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay: 0.45 }}
          style={{ marginBottom: 'clamp(40px,7vh,64px)' }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ width: '3px', flexShrink: 0, alignSelf: 'stretch', background: 'linear-gradient(to bottom, rgba(200,136,58,0.7), rgba(200,136,58,0.1))', borderRadius: '2px', marginTop: '4px' }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: 'rgba(30,26,21,0.75)', fontSize: 'clamp(0.95rem,1.5vw,1.1rem)', lineHeight: 1.75, margin: 0 }}>
              {isMobile
                ? <>On vous conseille ensuite objectivement : <strong style={{ color: 'rgba(30,26,21,0.95)', fontWeight: 600 }}>marques, puissance, autonomie, pièges à éviter</strong> — pour acheter le <em style={{ color: 'rgba(200,136,58,0.85)' }}>Fat Bike parfait.</em></>
                : <>En louant avec nous, vous profitez aussi de <strong style={{ color: 'rgba(30,26,21,0.95)', fontWeight: 600 }}>notre expertise</strong> : on vous conseille objectivement sur l'achat de votre futur vélo (marques, puissance, autonomie, pièges à éviter). On fait le point ensemble après votre test pour que vous achetiez le <em style={{ color: 'rgba(200,136,58,0.85)' }}>Fat Bike parfait pour votre quotidien à Paris.</em></>
              }
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.6 }}
          style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '14px' : '20px' }}
        >
          <PhoneBtn label="Réserver mon test" />
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: 'rgba(30,26,21,0.35)', fontSize: '0.82rem', margin: 0 }}>
            Conseil d'achat inclus après votre test
          </p>
        </motion.div>

      </div>
    </div>
  )
}
