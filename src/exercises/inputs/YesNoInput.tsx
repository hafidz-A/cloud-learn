import { GlossaryText } from '../../components/GlossaryText'
import type { CSSProperties } from 'react'
import type { YesNoExercise } from '../../lib/types'
import { CARD_LOOKS, type InputProps } from '../looks'

/** A scenario and three statements, each answered Yes or No. */
export function YesNoInput({ exercise, response, onChange, reveal, locked }: InputProps<YesNoExercise, (boolean | null)[]>) {
  const set = (i: number, value: boolean) => onChange(response.map((r, j) => (j === i ? value : r)))
  const disabled = reveal || !!locked
  return (
    <div className="space-y-4" lang="en">
      <p className="rounded-2xl border-2 border-kabut bg-white p-4 text-15">
        <GlossaryText text={exercise.scenario} />
      </p>
      <ol className="space-y-3">
        {exercise.statements.map((st, i) => {
          const picked = response[i]
          const rowLook = !reveal ? 'idle' : picked === st.answer ? 'right' : 'wrong'
          return (
            <li key={i} className={`rounded-2xl border-2 p-3 ${CARD_LOOKS[rowLook].className}`}>
              <p className="text-15 font-semibold">
                {i + 1}. <GlossaryText text={st.text} />
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label={`Pernyataan ${i + 1}`}>
                {[true, false].map((value) => {
                  const chosen = picked === value
                  const look = reveal
                    ? value === st.answer
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
                      aria-pressed={chosen}
                      disabled={disabled}
                      onClick={() => set(i, value)}
                      className={`btn-3d min-h-11 rounded-xl border-2 font-display text-17 font-bold ${look.className} ${disabled ? '' : 'cursor-pointer'}`}
                      style={{ '--edge': look.edge } as CSSProperties}
                    >
                      {value ? 'Yes' : 'No'}
                    </button>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
