import { useCube } from './CubeTransition'
import { useNavigate } from 'react-router-dom'

export default function BackButton({ toHome = false }) {
  const cube = useCube()
  const navigate = useNavigate()

  const handleBack = () => {
    if (toHome) {
      navigate('/')
    } else if (cube && cube.currentIndex === 0) {
      navigate('/')
    } else if (cube) {
      cube.goPrev()
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      onClick={handleBack}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        color: '#A09080', background: 'none', border: 'none',
        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.88rem', transition: 'color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#F5F0E8'}
      onMouseLeave={e => e.currentTarget.style.color = '#A09080'}
    >
      <span style={{
        width: '32px', height: '32px', borderRadius: '50%',
        border: '1px solid rgba(58,56,80,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.2s',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      Retour
    </button>
  )
}
