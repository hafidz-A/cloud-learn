import { Check, X } from 'lucide-react'
import { animate, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../../components/Button'
import type { TrueFalseExercise } from '../../lib/types'
import { ExerciseHeader } from '../ExerciseHeader'
import { LessonFooter } from '../LessonFooter'
import { useLessonKeys } from '../useLessonKeys'
import { SHAKE } from '../motion'
import type { ExerciseProps } from '../types'
import { GlossaryText } from '../../components/GlossaryText'

const SWIPE_DISTANCE = 90
const SWIPE_VELOCITY = 500

/** Quick warm-up: swipe right for true, left for false (or use the buttons / arrow keys). */
export function TrueFalseView({ exercise, answered, onVerdict }: ExerciseProps<TrueFalseExercise>) {
  const [choice, setChoice] = useState<boolean | null>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-10, 10])
  const falseHint = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0])
  const trueHint = useTransform(x, [20, SWIPE_DISTANCE], [0, 1])

  const answer = (value: boolean) => {
    if (answered || choice !== null) return
    setChoice(value)
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 26 })
    onVerdict({ correct: value === exercise.answer, correctAnswer: exercise.answer ? 'Benar' : 'Salah' })
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info
    if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) answer(true)
    else if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) answer(false)
  }

  useLessonKeys(!answered, (key) => {
    if (key === 'ArrowRight') answer(true)
    else if (key === 'ArrowLeft') answer(false)
    else return false
    return true
  })

  const correct = choice !== null && choice === exercise.answer
  const cardLook =
    choice === null ? 'border-kabut' : correct ? 'border-mint bg-mint-muda' : 'border-koral bg-koral-muda'

  return (
    <>
      <ExerciseHeader instruction="Benar atau salah?" verify={exercise.verify} />

      <motion.div
        drag={answered ? false : 'x'}
        dragSnapToOrigin
        dragElastic={0.9}
        onDragEnd={onDragEnd}
        style={{ x, rotate }}
        animate={choice !== null && !correct ? SHAKE : undefined}
        className={`relative mx-2 mt-8 flex min-h-56 touch-pan-y select-none flex-col justify-center rounded-3xl border-2 bg-white p-6 shadow-[0_6px_0_var(--color-kabut)] ${cardLook} ${
          answered ? '' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        <motion.span
          aria-hidden="true"
          style={{ opacity: trueHint }}
          className="pointer-events-none absolute left-4 top-4 -rotate-12 rounded-xl border-4 border-mint bg-mint-muda px-2 font-display text-20 font-bold text-tinta"
        >
          Benar
        </motion.span>
        <motion.span
          aria-hidden="true"
          style={{ opacity: falseHint }}
          className="pointer-events-none absolute right-4 top-4 rotate-12 rounded-xl border-4 border-koral bg-koral-muda px-2 font-display text-20 font-bold text-tinta"
        >
          Salah
        </motion.span>
        <h2 lang="en" className="text-20 font-bold">
          <GlossaryText text={exercise.prompt} />
        </h2>
        {choice !== null && (
          <p className="mt-4 font-display text-15 font-semibold text-tinta-lembut">
            Jawabanmu: {choice ? 'Benar' : 'Salah'}
          </p>
        )}
      </motion.div>

      <p className="mt-6 text-center text-13 text-tinta-lembut">Geser kanan kalau benar, geser kiri kalau salah.</p>

      <LessonFooter>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="koral" disabled={answered} onClick={() => answer(false)} className="flex items-center justify-center gap-2">
            <X size={24} strokeWidth={3} aria-hidden="true" />
            Salah
          </Button>
          <Button variant="mint" disabled={answered} onClick={() => answer(true)} className="flex items-center justify-center gap-2">
            <Check size={24} strokeWidth={3} aria-hidden="true" />
            Benar
          </Button>
        </div>
      </LessonFooter>
    </>
  )
}
