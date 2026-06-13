import { useState, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CubeContext = createContext(null)
export const useCube = () => useContext(CubeContext)

const variants = {
  enterForward:  { rotateY: -90, opacity: 0, x: '100%' },
  centerForward: { rotateY: 0,   opacity: 1, x: '0%'   },
  exitForward:   { rotateY: 90,  opacity: 0, x: '-100%' },
  enterBackward: { rotateY: 90,  opacity: 0, x: '-100%' },
  centerBackward:{ rotateY: 0,   opacity: 1, x: '0%'   },
  exitBackward:  { rotateY: -90, opacity: 0, x: '100%'  },
}

export function CubeProvider({ children, steps }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState('forward')

  const goNext = useCallback(() => {
    if (currentIndex < steps.length - 1) {
      setDirection('forward')
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, steps.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('backward')
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const CurrentStep = steps[currentIndex]

  return (
    <CubeContext.Provider value={{ currentIndex, goNext, goPrev, total: steps.length }}>
      <div className="relative w-full min-h-screen overflow-hidden" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={direction === 'forward' ? variants.enterForward : variants.enterBackward}
            animate={direction === 'forward' ? variants.centerForward : variants.centerBackward}
            exit={direction === 'forward' ? variants.exitForward : variants.exitBackward}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="w-full min-h-screen"
            style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
          >
            <CurrentStep />
          </motion.div>
        </AnimatePresence>
      </div>
    </CubeContext.Provider>
  )
}
