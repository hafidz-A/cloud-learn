import { motion } from 'framer-motion'
import { useEffect, useEffectEvent } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import type { VisualName } from '../content/visuals'
import type { IntroCard } from '../lib/types'
import { IntroVisual } from './visuals'
import { GlossaryText } from '../components/GlossaryText'

/** Reopens a concept's intro card during practice ("Lihat konsep", plan section 11.1). */
export function ConceptSheet({ intro, onClose }: { intro: IntroCard; onClose: () => void }) {
  const onKey = useEffectEvent((e: KeyboardEvent) => e.key === 'Escape' && onClose())
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-tinta/40" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="concept-title"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-white px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-5"
      >
        <div className="flex items-center gap-3">
          <Mascot mood="netral" size={56} className="shrink-0" />
          <h2 id="concept-title" className="font-display text-20 font-bold">
            {intro.title}
          </h2>
        </div>
        {intro.visual && (
          <div className="mt-4">
            <IntroVisual name={intro.visual as VisualName} />
          </div>
        )}
        <p className="mt-4 text-17">
          <GlossaryText text={intro.body} />
        </p>
        <Button block className="mt-5" autoFocus onClick={onClose}>
          Tutup
        </Button>
      </motion.div>
    </div>
  )
}
