import type { CSSProperties } from 'react'
import { useState } from 'react'
import type { MatchExercise } from '../../lib/types'
import { BADGE_LOOKS, CARD_LOOKS, type InputProps, type Look } from '../looks'
import { GlossaryText } from '../../components/GlossaryText'

/**
 * Match without instant feedback, for the exam and its review: tap a term,
 * then its meaning. A number badge shows which cards belong together.
 */
export function MatchInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<MatchExercise, (number | null)[]>) {
  const [selected, setSelected] = useState<number | null>(null)
  const isLocked = reveal || !!locked

  const pairNumber = (left: number) => left + 1
  const leftFor = (right: number) => response.indexOf(right)

  const tapRight = (right: number) => {
    if (selected === null) return
    // A meaning belongs to one term only: take it away from any other term first.
    onChange(response.map((r, i) => (i === selected ? right : r === right ? null : r)))
    setSelected(null)
  }

  const leftLook = (i: number): Look =>
    reveal ? (response[i] === i ? 'right' : 'wrong') : selected === i ? 'selected' : response[i] !== null ? 'selected' : 'idle'
  const rightLook = (r: number): Look => {
    const left = leftFor(r)
    if (reveal) return left === r ? 'right' : left >= 0 ? 'wrong' : 'dim'
    return left >= 0 ? 'selected' : 'idle'
  }

  const card = (key: string, text: string, look: Look, badge: number | null, onClick: () => void, pressed: boolean) => {
    const l = CARD_LOOKS[look]
    return (
      <button
        key={key}
        type="button"
        aria-pressed={pressed}
        disabled={isLocked}
        onClick={onClick}
        className={`btn-3d flex min-h-16 w-full items-center gap-2 rounded-2xl border-2 px-3 py-2 text-left text-15 font-bold ${l.className} ${isLocked ? '' : 'cursor-pointer'}`}
        style={{ '--edge': l.edge } as CSSProperties}
      >
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 font-display text-13 ${BADGE_LOOKS[badge === null ? 'idle' : look === 'dim' ? 'idle' : look]}`}
        >
          {badge ?? ''}
        </span>
        <span>
          <GlossaryText text={text} />
        </span>
      </button>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3" lang="en">
      <div className="space-y-3">
        {exercise.pairs.map(([left], i) =>
          card(`L${i}`, left, leftLook(i), response[i] !== null ? pairNumber(i) : null, () => setSelected(selected === i ? null : i), selected === i),
        )}
      </div>
      <div className="space-y-3">
        {layout.map((r) => {
          const left = leftFor(r)
          return card(`R${r}`, exercise.pairs[r][1], rightLook(r), left >= 0 ? pairNumber(left) : null, () => tapRight(r), left >= 0)
        })}
      </div>
      {reveal && (
        <ul className="col-span-2 space-y-1 text-13 text-tinta-lembut">
          {exercise.pairs.map(([l, r], i) => (
            <li key={i}>
              <span className="font-bold text-tinta">{l}</span> → {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
