import type { Exercise } from '../lib/types'

export type Verdict = {
  correct: boolean
  /** Shown as "Jawaban benar: ..." when the answer was wrong. */
  correctAnswer?: string
  /** Extra line for the feedback sheet, e.g. how many match mistakes. */
  note?: string
}

export type ExerciseProps<E extends Exercise = Exercise> = {
  exercise: E
  /** True once a verdict exists; the exercise must stop taking input. */
  answered: boolean
  onVerdict: (verdict: Verdict) => void
}
