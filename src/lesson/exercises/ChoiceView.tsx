import { motion } from 'framer-motion'
import { useState, type CSSProperties } from 'react'
import { shuffle } from '../../lib/shuffle'
import type { ChoiceExercise } from '../../lib/types'
import { ExerciseHeader } from '../ExerciseHeader'
import { CheckFooter } from '../LessonFooter'
import { useLessonKeys } from '../useLessonKeys'
import { SHAKE } from '../motion'
import type { ExerciseProps } from '../types'

type Look = 'idle' | 'selected' | 'right' | 'wrong' | 'dim'

const LOOKS: Record<Look, { className: string; badge: string; edge: string }> = {
  idle: { className: 'border-kabut bg-white', badge: 'border-kabut text-tinta-lembut', edge: 'var(--color-kabut)' },
  selected: { className: 'border-biru bg-biru-muda', badge: 'border-biru-dalam bg-biru-dalam text-white', edge: 'var(--color-biru)' },
  right: { className: 'border-mint bg-mint-muda', badge: 'border-mint bg-mint text-tinta', edge: 'var(--color-mint)' },
  wrong: { className: 'border-koral bg-koral-muda', badge: 'border-koral bg-koral text-tinta', edge: 'var(--color-koral)' },
  dim: { className: 'border-kabut bg-white opacity-60', badge: 'border-kabut text-tinta-lembut', edge: 'var(--color-kabut)' },
}

/** Scenario question: pick 1 of 4. Options are shuffled every time. */
export function ChoiceView({ exercise, answered, onVerdict }: ExerciseProps<ChoiceExercise>) {
  const [order] = useState(() => shuffle(exercise.options.map((_, i) => i)))
  const [selected, setSelected] = useState<number | null>(null)

  const check = () => {
    if (selected === null || answered) return
    onVerdict({ correct: selected === exercise.answer, correctAnswer: exercise.options[exercise.answer] })
  }

  useLessonKeys(!answered, (key) => {
    const n = Number(key)
    if (Number.isInteger(n) && n >= 1 && n <= order.length) {
      setSelected(order[n - 1])
      return true
    }
  })

  const lookFor = (option: number): Look => {
    if (!answered) return option === selected ? 'selected' : 'idle'
    if (option === exercise.answer) return 'right'
    if (option === selected) return 'wrong'
    return 'dim'
  }

  return (
    <>
      <ExerciseHeader instruction="Pilih jawaban yang benar" prompt={exercise.prompt} verify={exercise.verify} />
      <ul className="mt-6 space-y-3" lang="en">
        {order.map((option, position) => {
          const look = LOOKS[lookFor(option)]
          return (
            <motion.li key={option} animate={answered && option === selected && option !== exercise.answer ? SHAKE : undefined}>
              <button
                type="button"
                data-option
                aria-pressed={option === selected}
                disabled={answered}
                onClick={() => setSelected(option)}
                className={`btn-3d flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-17 font-semibold ${look.className} ${
                  answered ? '' : 'cursor-pointer'
                }`}
                style={{ '--edge': look.edge } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 font-display text-13 font-bold ${look.badge}`}
                >
                  {position + 1}
                </span>
                {exercise.options[option]}
              </button>
            </motion.li>
          )
        })}
      </ul>
      <CheckFooter disabled={selected === null} answered={answered} onCheck={check} />
    </>
  )
}
