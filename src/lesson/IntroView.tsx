import { Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import type { VisualName } from '../content/visuals'
import type { IntroCard } from '../lib/types'
import { LessonFooter } from './LessonFooter'
import { useLessonKeys } from './useLessonKeys'
import { IntroVisual } from './visuals'

/** Intro card (plan section 11.1): one new concept, no answer, just "Lanjut". */
export function IntroView({ intro, onDone }: { intro: IntroCard; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

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
      <div className="flex flex-1 flex-col justify-center">
        <p className="flex items-center gap-1.5 font-display text-15 font-semibold text-tinta-lembut">
          <Sparkles size={18} aria-hidden="true" className="text-matahari-dalam" />
          Konsep baru
        </p>
        <div
          ref={ref}
          tabIndex={-1}
          aria-labelledby="intro-title"
          role="group"
          className="mt-3 rounded-3xl border-2 border-kabut bg-white p-6 shadow-[0_6px_0_var(--color-kabut)] outline-none"
        >
          <div className="flex items-center gap-3">
            <Mascot mood="netral" size={64} className="shrink-0" />
            <h2 id="intro-title" className="font-display text-28 font-bold">
              {intro.title}
            </h2>
          </div>
          {intro.visual && (
            <div className="mt-5">
              <IntroVisual name={intro.visual as VisualName} />
            </div>
          )}
          <p className="mt-5 text-17">{intro.body}</p>
        </div>
      </div>
      <LessonFooter>
        <Button block onClick={onDone}>
          Lanjut
        </Button>
      </LessonFooter>
    </>
  )
}
