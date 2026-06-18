import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Home from './pages/Home'
import TunnelWrapper from './pages/tunnel/TunnelWrapper'
import Payment from './pages/Payment'
import TeamDashboard from './pages/TeamDashboard'
import ContratPage from './pages/ContratPage'
import MentionsLegales from './pages/legal/MentionsLegales'
import CGV from './pages/legal/CGV'
import Confidentialite from './pages/legal/Confidentialite'
import CookieBanner from './components/CookieBanner'

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tunnel/*" element={<TunnelWrapper />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/equipe" element={<TeamDashboard />} />
        <Route path="/contrat" element={<ContratPage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
    </LanguageProvider>
  )
}
