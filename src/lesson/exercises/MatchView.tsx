import { motion } from 'framer-motion'
import { useEffect, useEffectEvent, useState, type CSSProperties } from 'react'
import type { MatchExercise } from '../../lib/types'
import { ExerciseHeader } from '../ExerciseHeader'
import { CheckFooter } from '../LessonFooter'
import { clearFlash, createMatchState, isMatchDone, tapCard, type MatchCard } from '../match'
import { SHAKE } from '../motion'
import type { ExerciseProps } from '../types'
import { GlossaryText } from '../../components/GlossaryText'

const FLASH_MS = 500

type Look = 'idle' | 'selected' | 'right' | 'wrong' | 'done'

const LOOKS: Record<Look, { className: string; edge: string }> = {
  idle: { className: 'border-kabut bg-white', edge: 'var(--color-kabut)' },
  selected: { className: 'border-biru bg-biru-muda', edge: 'var(--color-biru)' },
  right: { className: 'border-mint bg-mint-muda', edge: 'var(--color-mint)' },
  wrong: { className: 'border-koral bg-koral-muda', edge: 'var(--color-koral)' },
  done: { className: 'border-kabut bg-langit text-tinta-lembut opacity-60', edge: 'transparent' },
}

/** Tap a card on the left, then its partner on the right (or the other way round). */
export function MatchView({ exercise, answered, onVerdict }: ExerciseProps<MatchExercise>) {
  const [state, setState] = useState(() => createMatchState(exercise.pairs))
  const done = isMatchDone(state)

  // Let the last right pair flash before the flash clears.
  useEffect(() => {
    if (!state.flash) return
    const t = setTimeout(() => setState(clearFlash), FLASH_MS)
    return () => clearTimeout(t)
  }, [state.flash])

  const finish = useEffectEvent(() => {
    const m = state.mistakes
    onVerdict({
      correct: m === 0,
      note: m === 0 ? undefined : `Kamu sempat salah mencocokkan ${m} kali sebelum semuanya pas.`,
    })
  })

  useEffect(() => {
    if (!done || answered) return
    const t = setTimeout(finish, FLASH_MS)
    return () => clearTimeout(t)
  }, [done, answered])

  const lookFor = (card: MatchCard): Look => {
    if (state.flash?.ids.includes(card.id)) return state.flash.ok ? 'right' : 'wrong'
    if (state.matched.includes(card.pair)) return 'done'
    return state.selected === card.id ? 'selected' : 'idle'
  }

  // Interleave the columns row by row so paired rows share one height.
  const rows = state.left.map((l, i) => [l, state.right[i]] as const)
  const announcement = state.flash ? (state.flash.ok ? 'Cocok.' : 'Belum cocok, coba lagi.') : ''

  return (
    <>
      <ExerciseHeader instruction="Cocokkan pasangannya" prompt={exercise.prompt} verify={exercise.verify} />
      <div className="mt-6 grid grid-cols-2 gap-3" lang="en">
        {rows.flat().map((card) => {
          const lookName = lookFor(card)
          const look = LOOKS[lookName]
          const locked = answered || lookName === 'done'
          return (
            <motion.div key={card.id} className="flex flex-col" animate={lookName === 'wrong' ? SHAKE : undefined}>
              <button
                type="button"
                aria-pressed={state.selected === card.id}
                aria-disabled={locked || undefined}
                onClick={() => !locked && setState((s) => tapCard(s, card.id))}
                className={`btn-3d flex min-h-16 flex-1 items-center justify-center rounded-2xl border-2 px-3 py-2 text-center text-15 font-bold hyphens-auto ${look.className} ${
                  locked ? '' : 'cursor-pointer'
                }`}
                style={{ '--edge': look.edge } as CSSProperties}
              >
                <GlossaryText text={card.text} />
              </button>
            </motion.div>
          )
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <CheckFooter disabled answered={answered} onCheck={() => {}} />
    </>
  )
}
