import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'
import logoVelo from '../assets/logo-velo.png'

const MOT_DE_PASSE = 'Tobel331@@@@'

const TARIFS_PRESET = [
  { label: '2 heures',         prix: 25 },
  { label: 'Demi-journée · 4h', prix: 40 },
  { label: 'Soirée',           prix: 50 },
  { label: 'Journée',          prix: 55 },
  { label: 'Journée + Soirée', prix: 80 },
]

/* ── Signature Canvas ── */
function SignatureCanvas({ onSign }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [signed, setSigned] = useState(false)

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  const start = (e) => {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const pos = getPos(e, canvasRef.current)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    const pos = getPos(e, canvasRef.current)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setSigned(true)
    onSign(canvasRef.current.toDataURL())
  }

  const stop = () => { drawing.current = false }

  const clear = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setSigned(false)
    onSign(null)
  }

  return (
    <div>
      <div style={{ position: 'relative', borderRadius: '12px', border: '1.5px solid rgba(200,136,58,0.4)', background: '#fff', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={500} height={160}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
          style={{ width: '100%', height: '120px', display: 'block', touchAction: 'none', cursor: 'crosshair' }}
        />
        {!signed && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'rgba(0,0,0,0.2)', fontSize: '0.9rem' }}>Signez ici avec votre doigt ou votre souris</p>
          </div>
        )}
      </div>
      {signed && (
        <button onClick={clear} style={{ marginTop: '6px', background: 'none', border: 'none', color: 'rgba(200,136,58,0.8)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>
          Effacer la signature
        </button>
      )}
    </div>
  )
}

/* ── Page principale ── */
export default function ContratPage() {
  const navigate = useNavigate()
  const [pwd, setPwd] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)

  // Formulaire
  const [typeLocation, setTypeLocation] = useState(null)
  const [special, setSpecial] = useState({ duree: '', prix: '' })
  const [livraison, setLivraison] = useState(null)
  const [adresse, setAdresse] = useState('')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [signatureData, setSignatureData] = useState(null)
  const [dateContrat] = useState(() => new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))

  const check = () => {
    if (pwd === MOT_DE_PASSE) { setUnlocked(true); setError(false) }
    else { setError(true); setTimeout(() => setError(false), 1200) }
  }

  const lieuFinal = livraison === 'livraison' ? adresse : '10 rue Moreau, Paris'
  const locationLabel = typeLocation === 'special'
    ? `${special.duree} — ${special.prix}€`
    : TARIFS_PRESET.find(t => t.label === typeLocation)?.label ?? ''
  const prixFinal = typeLocation === 'special'
    ? special.prix
    : TARIFS_PRESET.find(t => t.label === typeLocation)?.prix ?? ''

  const canDownload = typeLocation && livraison && (livraison === 'place' || adresse.trim()) && prenom.trim() && nom.trim() && tel.trim() && signatureData

  /* ── Génération PDF ── */
  const downloadPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const W = 210
    const margin = 18
    let y = 20

    const addLine = (text, size = 10, bold = false, color = [30, 25, 50], indent = 0) => {
      doc.setFontSize(size)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setTextColor(...color)
      const lines = doc.splitTextToSize(text, W - margin * 2 - indent)
      doc.text(lines, margin + indent, y)
      y += lines.length * (size * 0.42) + 2
    }

    const gap = (mm = 4) => { y += mm }

    // En-tête
    doc.setFillColor(12, 11, 21)
    doc.rect(0, 0, W, 38, 'F')
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(200, 136, 58)
    doc.text('Bike in Paris', margin, 16)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(245, 240, 232)
    doc.text('Représenté par : Abel Dompnier', margin, 23)
    doc.text('Contact : 07 66 88 05 42  |  abeldompnier@gmail.com', margin, 29)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('CONTRAT DE LOCATION — FAT BIKE BIPLACE', W / 2, 35, { align: 'center' })

    y = 48

    // Infos contrat
    doc.setDrawColor(200, 136, 58)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, y, W - margin * 2, 32, 3, 3)
    y += 7
    addLine(`Date : ${dateContrat}`, 9, true, [80, 65, 40])
    addLine(`Locataire : ${prenom} ${nom.toUpperCase()}`, 9, false, [30, 25, 50])
    addLine(`Téléphone : ${tel}`, 9, false, [30, 25, 50])
    addLine(`Type de location : ${locationLabel}  —  Prix : ${prixFinal}€`, 9, false, [30, 25, 50])
    addLine(`Mode : ${livraison === 'livraison' ? `Livraison à — ${lieuFinal}` : `Retrait sur place — ${lieuFinal}`}`, 9, false, [30, 25, 50])
    gap(6)

    // Articles
    const articles = [
      {
        titre: 'Article 1 : Objet du contrat et Transfert de garde',
        corps: "Le Loueur met à disposition du Locataire un vélo électrique bi-place premium (Fat Bike) équipé de ses accessoires de sécurité (casques, antivol certifié, traquage GPS).\n\nDès la remise des clés et l'onboarding de 5 minutes effectué, le Locataire devient le gardien exclusif du véhicule (au sens de l'article 1242 alinéa 1 du Code Civil). Il assume la responsabilité totale des risques liés à l'utilisation, au stationnement, au vol ou à la destruction du matériel.",
      },
      {
        titre: 'Article 2 : Responsabilité financière TOTALE (Zéro Assurance)',
        corps: "Le matériel loué n'étant couvert par aucune police d'assurance optionnelle du Loueur pour le compte du Locataire, et aucun dépôt de garantie bancaire n'étant exigé à la signature, le Locataire accepte de prendre à sa charge exclusive l'intégralité des coûts en cas de sinistre ou de manquement :\n\n• En cas de vol, perte ou non-restitution du vélo : Le Locataire s'engage à rembourser immédiatement et intégralement au Loueur la valeur marchande du vélo électrique bi-place, fixée forfaitairement à 1 250 € (Mille deux cent cinquante euros).\n\n• En cas de dégradation ou casse partielle : Le Locataire s'engage à rembourser l'intégralité des frais réels de réparation, de transport du véhicule endommagé et des pièces de rechange sur présentation de la facture des réparations.",
      },
      {
        titre: 'Article 3 : Utilisation de l\'antivol et Sécurité (Clause Impérative)',
        corps: "Le Locataire s'engage à attacher systématiquement le vélo à un point d'attache fixe et solide à l'aide de l'antivol certifié fourni lors de chaque arrêt, même pour une courte durée. En cas de vol survenu alors que le vélo n'était pas attaché conformément aux instructions de sécurité données lors de l'onboarding, la responsabilité financière du Locataire reste entière et s'élève à 1 250 €.",
      },
      {
        titre: "Article 4 : Dépôt d'une pièce d'identité originale",
        corps: "En contrepartie de l'absence de caution bancaire, le Locataire accepte de confier volontairement au Loueur une pièce d'identité officielle originale (Carte Nationale d'Identité ou Passeport) en cours de validité. Ce document sera conservé en lieu sûr par le Loueur pendant toute la durée de la location et lui sera restitué en main propre immédiatement lors de la récupération du matériel, après vérification de l'état du vélo.",
      },
      {
        titre: 'Article 5 : Responsabilité Civile (Dommages aux tiers)',
        corps: "Le Loueur décline toute responsabilité pour les dommages corporels ou matériels causés par le Locataire à lui-même ou à des tiers (piétons, autres véhicules) durant la période de location. Le Locataire déclare être titulaire d'une assurance Responsabilité Civile (RC) personnelle en cours de validité pour couvrir l'intégralité des préjudices causés aux tiers.",
      },
    ]

    articles.forEach(a => {
      if (y > 250) { doc.addPage(); y = 20 }
      addLine(a.titre, 10, true, [170, 110, 40])
      gap(1)
      addLine(a.corps, 9, false, [40, 35, 55], 2)
      gap(5)
    })

    // Clause de consentement
    if (y > 240) { doc.addPage(); y = 20 }
    gap(3)
    doc.setFillColor(248, 244, 236)
    const boxH = 22
    doc.roundedRect(margin, y, W - margin * 2, boxH, 3, 3, 'F')
    doc.setDrawColor(200, 136, 58)
    doc.setLineWidth(0.4)
    doc.roundedRect(margin, y, W - margin * 2, boxH, 3, 3)
    y += 5
    addLine(
      '« Je reconnais avoir pris connaissance des conditions de location, avoir testé le vélo lors de l\'onboarding de 5 minutes, et j\'accepte ma responsabilité financière totale et immédiate à hauteur de 1 250 € en cas de perte, vol, dégradation ou non-restitution du vélo. Je consens à confier ma pièce d\'identité originale le temps de la location. »',
      8, false, [60, 50, 30], 2
    )

    gap(10)

    // Signatures côte à côte
    if (y > 230) { doc.addPage(); y = 20 }
    const colW = (W - margin * 2 - 10) / 2
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 25, 50)
    doc.text('Signature du Locataire :', margin, y)
    doc.text('Signature du Loueur (Bike in Paris — Abel) :', margin + colW + 10, y)
    y += 5

    // Signature locataire
    doc.setDrawColor(200, 136, 58)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, y, colW, 30, 2, 2)
    if (signatureData) {
      doc.addImage(signatureData, 'PNG', margin + 2, y + 2, colW - 4, 26)
    }

    // Zone signature loueur
    doc.roundedRect(margin + colW + 10, y, colW, 30, 2, 2)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 140, 100)
    doc.text('Abel Dompnier — Bike in Paris', margin + colW + 14, y + 14)

    y += 36
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(140, 130, 150)
    doc.text(`Document généré le ${dateContrat} — Bike in Paris`, W / 2, y, { align: 'center' })

    doc.save(`Contrat_BikeInParis_${nom}_${prenom}.pdf`)
  }

  /* ── Écran de verrouillage ── */
  if (!unlocked) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0B15', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
          style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}
        >
          <motion.div
            animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(200,136,58,0.1)', border: '1.5px solid rgba(200,136,58,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={error ? '#f87171' : '#C8883A'} strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '12px' }}>Accès interne</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '2rem', color: '#F5F0E8', marginBottom: '32px', lineHeight: 1.2 }}>
              Espace<br /><em style={{ color: '#C8883A' }}>contrats</em>
            </h1>

            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && check()}
              placeholder="Mot de passe"
              autoFocus
              style={{
                width: '100%', padding: '14px 18px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${error ? 'rgba(248,113,113,0.6)' : 'rgba(200,136,58,0.3)'}`,
                color: '#F5F0E8',
                fontFamily: "'DM Sans', sans-serif", fontSize: '1rem',
                outline: 'none', letterSpacing: '0.1em', marginBottom: '14px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'DM Sans', sans-serif", color: '#f87171', fontSize: '0.8rem', marginBottom: '12px' }}>
                Mot de passe incorrect
              </motion.p>
            )}

            <button
              onClick={check}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #C8883A, #A06A22)',
                color: '#0C0B15', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                boxShadow: '0 0 30px rgba(200,136,58,0.3)',
              }}
            >
              Accéder
            </button>
          </motion.div>

          <button onClick={() => navigate('/')} style={{ marginTop: '24px', background: 'none', border: 'none', color: 'rgba(245,240,232,0.3)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', cursor: 'pointer' }}>
            ← Retour au site
          </button>
        </motion.div>
      </div>
    )
  }

  /* ── Formulaire contrat ── */
  return (
    <div style={{ minHeight: '100vh', background: '#0C0B15', padding: 'clamp(32px,6vh,64px) clamp(20px,5vw,60px)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={logoVelo} alt="" style={{ width: '36px', filter: 'drop-shadow(0 0 8px rgba(200,136,58,0.4))' }} />
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.22em', margin: 0 }}>Bike in Paris</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: '#F5F0E8', margin: 0 }}>Espace contrats</p>
              </div>
            </div>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.35)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', cursor: 'pointer' }}>
              ← Retour
            </button>
          </div>
          <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(200,136,58,0.5), transparent)' }} />
        </motion.div>

        {/* Formulaire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

          {/* Type de location */}
          <Section title="Type de location">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {TARIFS_PRESET.map(t => (
                <button key={t.label} onClick={() => setTypeLocation(t.label)}
                  style={btnStyle(typeLocation === t.label)}>
                  {t.label} — {t.prix}€
                </button>
              ))}
              <button onClick={() => setTypeLocation('special')} style={btnStyle(typeLocation === 'special')}>
                ✏️ Location spéciale
              </button>
            </div>
            <AnimatePresence>
              {typeLocation === 'special' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', gap: '12px', marginTop: '14px', overflow: 'hidden' }}>
                  <input value={special.duree} onChange={e => setSpecial(s => ({ ...s, duree: e.target.value }))} placeholder="Durée (ex: 3h30)" style={inputStyle} />
                  <input value={special.prix} onChange={e => setSpecial(s => ({ ...s, prix: e.target.value }))} placeholder="Prix (€)" style={{ ...inputStyle, maxWidth: '120px' }} type="number" />
                </motion.div>
              )}
            </AnimatePresence>
          </Section>

          {/* Livraison */}
          <Section title="Mode de remise">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setLivraison('livraison')} style={btnStyle(livraison === 'livraison')}>
                🛵 Livraison
              </button>
              <button onClick={() => { setLivraison('place'); setAdresse('') }} style={btnStyle(livraison === 'place')}>
                📍 Sur place
              </button>
            </div>
            <AnimatePresence>
              {livraison === 'livraison' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: '14px', overflow: 'hidden' }}>
                  <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Adresse de livraison" style={inputStyle} />
                </motion.div>
              )}
              {livraison === 'place' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(200,136,58,0.8)', fontSize: '0.88rem', marginTop: '12px' }}>
                  📍 10 rue Moreau, Paris
                </motion.p>
              )}
            </AnimatePresence>
          </Section>

          {/* Infos locataire */}
          <Section title="Informations du locataire">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Prénom" style={inputStyle} />
                <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" style={inputStyle} />
              </div>
              <input value={tel} onChange={e => setTel(e.target.value)} placeholder="Numéro de téléphone" style={inputStyle} type="tel" />
            </div>
          </Section>

          {/* Récapitulatif */}
          <AnimatePresence>
            {typeLocation && livraison && (livraison === 'place' || adresse) && prenom && nom && tel && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Section title="Récapitulatif">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      ['Date', dateContrat],
                      ['Locataire', `${prenom} ${nom.toUpperCase()}`],
                      ['Téléphone', tel],
                      ['Location', `${locationLabel}  —  ${prixFinal}€`],
                      ['Mode', livraison === 'livraison' ? `Livraison → ${adresse}` : `Retrait — 10 rue Moreau`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(58,56,80,0.3)' }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(200,136,58,0.7)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', minWidth: '90px' }}>{k}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#F5F0E8', fontSize: '0.88rem' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Consulter le contrat */}
          <ConsulterContrat />

          {/* Signature */}
          <Section title="Signature du locataire">
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(245,240,232,0.45)', fontSize: '0.82rem', marginBottom: '14px', fontStyle: 'italic', lineHeight: 1.6 }}>
              « Je reconnais avoir pris connaissance des conditions de location, avoir testé le vélo lors de l'onboarding de 5 minutes, et j'accepte ma responsabilité financière totale et immédiate à hauteur de <strong style={{ color: '#C8883A' }}>1 250 €</strong> en cas de perte, vol, dégradation ou non-restitution du vélo. Je consens à confier ma pièce d'identité originale le temps de la location. »
            </p>
            <SignatureCanvas onSign={setSignatureData} />
          </Section>

          {/* Bouton téléchargement */}
          <motion.div style={{ paddingBottom: '40px' }}>
            <motion.button
              onClick={downloadPDF}
              disabled={!canDownload}
              whileHover={canDownload ? { scale: 1.02, boxShadow: '0 0 50px rgba(200,136,58,0.5)' } : {}}
              whileTap={canDownload ? { scale: 0.98 } : {}}
              style={{
                width: '100%', padding: '18px', borderRadius: '14px', border: 'none',
                background: canDownload ? 'linear-gradient(135deg, #C8883A, #A06A22)' : 'rgba(58,56,80,0.5)',
                cursor: canDownload ? 'pointer' : 'not-allowed',
                boxShadow: canDownload ? '0 0 35px rgba(200,136,58,0.35)' : 'none',
                transition: 'background 0.3s, box-shadow 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={canDownload ? '#0C0B15' : '#A09080'} strokeWidth="2.2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: canDownload ? '#0C0B15' : '#A09080' }}>
                  {canDownload ? 'Télécharger le contrat PDF' : 'Remplissez tous les champs + signez'}
                </span>
              </div>
            </motion.button>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

/* ── Consulter le contrat ── */
const ARTICLES_TEXTE = [
  {
    titre: 'Article 1 — Objet du contrat et Transfert de garde',
    corps: "Le Loueur met à disposition du Locataire un vélo électrique bi-place premium (Fat Bike) équipé de ses accessoires de sécurité (casques, antivol certifié, traquage GPS).\n\nDès la remise des clés et l'onboarding de 5 minutes effectué, le Locataire devient le gardien exclusif du véhicule (art. 1242 al. 1 du Code Civil). Il assume la responsabilité totale des risques liés à l'utilisation, au stationnement, au vol ou à la destruction du matériel.",
  },
  {
    titre: 'Article 2 — Responsabilité financière TOTALE (Zéro Assurance)',
    corps: "Le matériel loué n'est couvert par aucune police d'assurance du Loueur pour le compte du Locataire. Le Locataire accepte à sa charge exclusive :\n\n• Vol, perte ou non-restitution du vélo → remboursement immédiat de 1 250 €\n• Dégradation ou casse partielle → remboursement des frais réels de réparation sur facture.",
  },
  {
    titre: 'Article 3 — Antivol et Sécurité (Clause Impérative)',
    corps: "Le Locataire s'engage à attacher systématiquement le vélo à un point d'attache fixe à l'aide de l'antivol fourni, lors de chaque arrêt. En cas de vol survenu sans antivol en place, la responsabilité financière reste entière : 1 250 €.",
  },
  {
    titre: "Article 4 — Dépôt d'une pièce d'identité originale",
    corps: "En contrepartie de l'absence de caution bancaire, le Locataire confie volontairement au Loueur une pièce d'identité officielle originale (CNI ou Passeport) en cours de validité, conservée pendant toute la durée de la location et restituée à la récupération du matériel.",
  },
  {
    titre: 'Article 5 — Responsabilité Civile (Dommages aux tiers)',
    corps: "Le Loueur décline toute responsabilité pour les dommages causés par le Locataire à lui-même ou à des tiers. Le Locataire déclare être titulaire d'une assurance RC personnelle en cours de validité.",
  },
]

function ConsulterContrat() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: '8px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(200,136,58,0.07)',
          border: '1.5px solid rgba(200,136,58,0.25)',
          borderRadius: '12px', padding: '12px 20px',
          cursor: 'pointer', width: '100%', textAlign: 'left',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,136,58,0.12)'; e.currentTarget.style.borderColor = 'rgba(200,136,58,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,136,58,0.07)'; e.currentTarget.style.borderColor = 'rgba(200,136,58,0.25)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="1.8" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.88rem', color: '#C8883A', flex: 1 }}>
          Consulter le contrat
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2" strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '2px',
              borderRadius: '0 0 12px 12px',
              border: '1.5px solid rgba(200,136,58,0.18)',
              borderTop: 'none',
              background: 'rgba(8,7,16,0.6)',
              padding: '24px 22px',
              display: 'flex', flexDirection: 'column', gap: '22px',
            }}>
              {ARTICLES_TEXTE.map((a, i) => (
                <div key={i}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.88rem', color: '#C8883A', marginBottom: '8px', lineHeight: 1.3 }}>
                    {a.titre}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: 'rgba(245,240,232,0.65)', lineHeight: 1.75, whiteSpace: 'pre-line', margin: 0 }}>
                    {a.corps}
                  </p>
                  {i < ARTICLES_TEXTE.length - 1 && (
                    <div style={{ marginTop: '20px', height: '1px', background: 'rgba(58,56,80,0.4)' }} />
                  )}
                </div>
              ))}

              {/* Contact */}
              <div style={{ marginTop: '4px', padding: '14px 16px', borderRadius: '10px', background: 'rgba(200,136,58,0.08)', border: '1px solid rgba(200,136,58,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(200,136,58,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 2px' }}>Bike in Paris — Abel</p>
                  <a href="tel:0766880542" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', color: '#C8883A', textDecoration: 'none' }}>07 66 88 05 42</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


/* ── Helpers UI ── */
function Section({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(200,136,58,0.75)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '14px' }}>{title}</p>
      {children}
    </motion.div>
  )
}

const btnStyle = (active) => ({
  padding: '10px 20px', borderRadius: '50px', border: 'none', cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', fontWeight: active ? 600 : 400,
  background: active ? 'rgba(200,136,58,0.18)' : 'rgba(255,255,255,0.05)',
  border: active ? '1.5px solid rgba(200,136,58,0.7)' : '1.5px solid rgba(58,56,80,0.5)',
  color: active ? '#C8883A' : 'rgba(245,240,232,0.75)',
  boxShadow: active ? '0 0 18px rgba(200,136,58,0.2)' : 'none',
  transition: 'all 0.2s',
})

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: '12px', border: 'none',
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(58,56,80,0.6)',
  color: '#F5F0E8',
  fontFamily: "'DM Sans', sans-serif", fontSize: '0.93rem',
  outline: 'none', boxSizing: 'border-box',
}
