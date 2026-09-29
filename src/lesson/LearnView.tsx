import { BookOpen } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import type { LearnCard } from '../lib/types'
import { LessonFooter } from './LessonFooter'
import { TeachingCardContent } from './TeachingCardContent'
import { useLessonKeys } from './useLessonKeys'

/**
 * A learn card in a lesson (LANGIT_AZ900_PERBAIKAN_MATERI.md section 3): a big
 * card that scrolls with the page when it is long, and "Paham, lanjut". No
 * answer, no XP, no hearts.
 */
export function LearnView({ card, onDone }: { card: LearnCard; onDone: () => void }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [])

  useLessonKeys(true, (key) => {
    if (key !== 'Enter') return
    onDone()
    return true
  })

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="my-auto">
          <div className="flex items-center gap-2">
            <Mascot mood="netral" size={44} className="shrink-0" />
            <p className="flex items-center gap-1.5 font-display text-15 font-semibold text-tinta-lembut">
              <BookOpen size={18} aria-hidden="true" className="text-biru-dalam" />
              Materi baru
            </p>
          </div>
          <article
            ref={ref}
            tabIndex={-1}
            aria-labelledby="learn-title"
            className="mt-3 rounded-3xl border-2 border-kabut bg-white p-5 shadow-[0_6px_0_var(--color-kabut)] outline-none"
          >
            <TeachingCardContent card={card} titleId="learn-title" />
          </article>
        </div>
      </div>
      <LessonFooter>
        <Button block onClick={onDone}>
          Paham, lanjut
        </Button>
      </LessonFooter>
    </>
  )
}
