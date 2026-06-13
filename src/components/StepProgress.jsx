export default function StepProgress({ current, total }) {
  const labels = ['Calendrier', 'Livraison', 'Récapitulatif']

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className={`rounded-full transition-all duration-500 ${
              i < current
                ? 'w-2 h-2 bg-[#C8883A]'
                : i === current
                ? 'w-2.5 h-2.5 bg-[#C8883A] shadow-[0_0_8px_rgba(200,136,58,0.7)]'
                : 'w-2 h-2 bg-[#3A3850]'
            }`} />
            <span className={`font-['DM_Sans'] text-xs hidden md:block transition-colors duration-300 ${
              i === current ? 'text-[#F5F0E8]' : i < current ? 'text-[#C8883A]' : 'text-[#3A3850]'
            }`}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`h-px w-4 md:w-8 transition-all duration-500 ${i < current ? 'bg-[#C8883A]/60' : 'bg-[#3A3850]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
