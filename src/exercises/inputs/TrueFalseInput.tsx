import type { CSSProperties } from 'react'
import type { TrueFalseExercise } from '../../lib/types'
import { CARD_LOOKS, type InputProps } from '../looks'

/** Calm true/false for the exam and its review (the lesson uses the swipe card). */
export function TrueFalseInput({ exercise, response, onChange, reveal, locked }: InputProps<TrueFalseExercise, boolean | null>) {
  const disabled = reveal || !!locked
  return (
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map((value) => {
        const chosen = response === value
        const look = reveal
          ? value === exercise.answer
            ? CARD_LOOKS.right
            : chosen
              ? CARD_LOOKS.wrong
              : CARD_LOOKS.dim
          : chosen
            ? CARD_LOOKS.selected
            : CARD_LOOKS.idle
        return (
          <button
            key={String(value)}
            type="button"
            data-option
            aria-pressed={chosen}
            disabled={disabled}
            onClick={() => onChange(value)}
            className={`btn-3d min-h-14 rounded-2xl border-2 font-display text-20 font-bold ${look.className} ${disabled ? '' : 'cursor-pointer'}`}
            style={{ '--edge': look.edge } as CSSProperties}
          >
            {value ? 'Benar' : 'Salah'}
          </button>
        )
      })}
    </div>
  )
}
