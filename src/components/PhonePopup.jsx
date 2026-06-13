import { motion, AnimatePresence } from 'framer-motion'

export default function PhonePopup({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          className="relative z-10 bg-[#1C1B2E] border border-[#C8883A]/40 rounded-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-[#C8883A]/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8883A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.62 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.53 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 5.37 5.37l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
            </svg>
          </div>
          <p className="text-[#A09080] text-sm font-['DM_Sans']">Appelez-nous directement</p>
          <a
            href="tel:0766880542"
            className="text-3xl font-['Playfair_Display'] font-semibold text-[#F5F0E8] tracking-wide hover:text-[#C8883A] transition-colors"
          >
            07 66 88 05 42
          </a>
          <p className="text-[#A09080] text-xs text-center">Disponible tous les jours · Réponse rapide</p>
          <button
            onClick={onClose}
            className="mt-2 text-[#A09080] text-sm hover:text-[#F5F0E8] transition-colors underline underline-offset-2"
          >
            Fermer
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
