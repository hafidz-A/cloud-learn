import { Heart, HeartCrack, Infinity as InfinityIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useProgress } from '../store/progress'

/** Hearts in the player header. Breaks with a small shake when one is lost. */
export function HeartsCounter() {
  const hearts = useProgress((s) => s.hearts)
  const enabled = useProgress((s) => s.heartsEnabled)
  const prev = useRef(hearts)
  const [breaking, setBreaking] = useState(0)

  useEffect(() => {
    if (hearts < prev.current) setBreaking((b) => b + 1)
    prev.current = hearts
  }, [hearts])

  if (!enabled) {
    return (
      <span className="flex items-center gap-1 font-display text-17 font-bold" aria-label="Hearts dimatikan">
        <Heart size={24} className="fill-koral text-koral-dalam" aria-hidden="true" />
        <InfinityIcon size={20} aria-hidden="true" />
      </span>
    )
  }

  return (
    <span className="relative flex items-center gap-1 font-display text-17 font-bold" aria-label={`${hearts} hearts`}>
      <motion.span key={breaking} animate={breaking ? { rotate: [0, -18, 16, -10, 0], scale: [1, 1.3, 0.9, 1] } : undefined} transition={{ duration: 0.5 }}>
        <Heart size={24} className="fill-koral text-koral-dalam" aria-hidden="true" />
      </motion.span>
      <AnimatePresence>
        {breaking > 0 && (
          <motion.span
            key={`crack-${breaking}`}
            aria-hidden="true"
            className="absolute -left-1 -top-3 text-koral-dalam"
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -16, scale: 1.2 }}
            transition={{ duration: 0.8 }}
          >
            <HeartCrack size={18} />
          </motion.span>
        )}
      </AnimatePresence>
      <span aria-hidden="true">{hearts}</span>
    </span>
  )
}
