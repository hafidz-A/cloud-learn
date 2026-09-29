import { motion } from 'framer-motion'
import { BookOpen, X } from 'lucide-react'
import { useEffect, useEffectEvent, useRef } from 'react'
import { Button } from '../components/Button'
import type { TeachingCard } from '../lib/types'
import { TeachingCardContent } from './TeachingCardContent'

/**
 * Rereads learn cards without leaving the question ("Lihat materi" and
 * "Pelajari lagi", LANGIT_AZ900_PERBAIKAN_MATERI.md section 7). No penalty.
 */
export function MaterialSheet({
  cards,
  onClose,
  closeLabel = 'Kembali ke soal',
}: {
  cards: TeachingCard[]
  onClose: () => void
  closeLabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onKey = useEffectEvent((e: KeyboardEvent) => e.key === 'Escape' && onClose())
  useEffect(() => {
    // Focus the sheet itself so the first card is read first, not the button at the bottom.
    ref.current?.focus({ preventScroll: true })
    const listener = (e: KeyboardEvent) => onKey(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-tinta/40" onClick={onClose}>
      <motion.div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="material-sheet-title"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-white px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 outline-none"
      >
        <div className="flex items-center justify-between gap-2">
          <p id="material-sheet-title" className="flex items-center gap-1.5 font-display text-15 font-semibold text-tinta-lembut">
            <BookOpen size={18} aria-hidden="true" className="text-biru-dalam" />
            Materi
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup materi"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        {cards.map((card, i) => (
          <section key={card.id} aria-labelledby={`material-${card.id}`} className={i === 0 ? 'mt-1' : 'mt-6 border-t-2 border-kabut pt-6'}>
            <TeachingCardContent card={card} titleId={`material-${card.id}`} />
          </section>
        ))}
        <Button block className="mt-6" onClick={onClose}>
          {closeLabel}
        </Button>
      </motion.div>
    </div>
  )
}
