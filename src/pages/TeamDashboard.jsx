import { useState } from 'react'
import { motion } from 'framer-motion'

const TEAM_PASSWORD = 'bikeparis2024'

const MOCK_RESERVATIONS = [
  { id: 1, name: 'Marie D.', start: '2025-06-10', end: '2025-06-12', type: 'delivery', price: 80, status: 'confirmed' },
  { id: 2, name: 'Thomas L.', start: '2025-06-14', end: '2025-06-14', type: 'pickup', price: 30, status: 'confirmed' },
]

function ReservationCard({ r }) {
  const typeLabel = r.type === 'delivery' ? '🚚 Livraison' : '📍 Retrait'
  return (
    <div className="bg-[#1C1B2E] rounded-xl p-4 border border-[#3A3850] flex flex-col gap-1">
      <div className="flex items-start justify-between">
        <p className="font-['DM_Sans'] font-semibold text-[#F5F0E8]">{r.name}</p>
        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full font-['DM_Sans']">Confirmée</span>
      </div>
      <p className="font-['DM_Sans'] text-[#A09080] text-xs">{typeLabel}</p>
      <p className="font-['DM_Sans'] text-[#A09080] text-xs">Du {r.start} au {r.end}</p>
      <p className="font-['Playfair_Display'] text-[#C8883A] font-bold">{r.price}€</p>
    </div>
  )
}

export default function TeamDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === TEAM_PASSWORD) {
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0F0E17] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <p className="font-['Playfair_Display'] font-bold text-2xl text-[#F5F0E8]">Espace équipe</p>
            <p className="font-['DM_Sans'] text-[#A09080] text-sm mt-1">Bike in Paris</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full py-4 px-5 bg-[#1C1B2E] border border-[#3A3850] rounded-xl text-[#F5F0E8] font-['DM_Sans'] placeholder:text-[#3A3850] focus:outline-none focus:border-[#C8883A] transition-colors"
            />
            {error && <p className="text-red-400 text-sm font-['DM_Sans'] text-center">Mot de passe incorrect</p>}
            <button
              type="submit"
              className="w-full py-4 bg-[#C8883A] hover:bg-[#C8883A] text-[#0F0E17] font-['DM_Sans'] font-semibold rounded-xl transition-all"
            >
              Accéder au planning
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0E17] px-5 py-8 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-['Playfair_Display'] font-bold text-2xl text-[#F5F0E8]">Planning équipe</p>
            <p className="font-['DM_Sans'] text-[#A09080] text-sm">Bike in Paris</p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-[#A09080] text-sm font-['DM_Sans'] hover:text-[#F5F0E8] transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Réservations', value: MOCK_RESERVATIONS.length },
            { label: 'Ce mois', value: '2' },
            { label: 'Revenus', value: '110€' },
            { label: 'Vélos actifs', value: '1' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1C1B2E] rounded-xl p-4 border border-[#3A3850] text-center">
              <p className="font-['Playfair_Display'] font-bold text-2xl text-[#C8883A]">{s.value}</p>
              <p className="font-['DM_Sans'] text-[#A09080] text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Réservations */}
        <div className="mb-6">
          <p className="font-['DM_Sans'] text-[#A09080] text-xs uppercase tracking-widest mb-4">Réservations à venir</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_RESERVATIONS.map((r) => <ReservationCard key={r.id} r={r} />)}
          </div>
        </div>

        {/* Mention Supabase */}
        <div className="bg-[#1C1B2E] rounded-xl p-4 border border-[#3A3850]">
          <p className="font-['DM_Sans'] text-[#A09080] text-xs text-center">
            Planning temps réel — synchronisation Supabase à connecter
          </p>
        </div>
      </div>
    </div>
  )
}
