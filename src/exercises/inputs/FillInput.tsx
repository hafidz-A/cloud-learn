import { Fragment, type CSSProperties } from 'react'
import type { FillExercise } from '../../lib/types'
import { CARD_LOOKS, type InputProps } from '../looks'

/** Complete the sentence from the word bank: tap a word to fill the next blank, tap a blank to clear it. */
export function FillInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<FillExercise, (number | null)[]>) {
  const parts = exercise.sentence.split('___')
  const used = new Set(response.filter((r): r is number => r !== null))
  const isLocked = reveal || !!locked

  const put = (word: number) => {
    const slot = response.indexOf(null)
    if (slot >= 0) onChange(response.map((r, i) => (i === slot ? word : r)))
  }
  const clear = (slot: number) => onChange(response.map((r, i) => (i === slot ? null : r)))

  return (
    <div lang="en">
      <p className="rounded-2xl border-2 border-kabut bg-white p-4 text-17 font-semibold leading-[2.6]">
        {parts.map((part, i) => (
          <Fragment key={i}>
            {part}
            {i < parts.length - 1 &&
              (() => {
                const word = response[i]
                const look = !reveal
                  ? word === null
                    ? CARD_LOOKS.idle
                    : CARD_LOOKS.selected
                  : word !== null && exercise.bank[word] === exercise.answers[i]
                    ? CARD_LOOKS.right
                    : CARD_LOOKS.wrong
                return (
                  <button
                    type="button"
                    disabled={isLocked || word === null}
                    onClick={() => clear(i)}
                    aria-label={word === null ? `Kotak kosong ${i + 1}` : `Kotak ${i + 1}: ${exercise.bank[word]}, ketuk untuk menghapus`}
                    className={`mx-1 inline-flex min-h-10 min-w-20 items-center justify-center rounded-xl border-2 px-2 align-middle leading-tight ${look.className} ${
                      word === null ? 'border-dashed' : 'cursor-pointer'
                    }`}
                  >
                    {word === null ? ' ' : exercise.bank[word]}
                  </button>
                )
              })()}
          </Fragment>
        ))}
      </p>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Bank kata">
        {layout.map((word) => {
          const taken = used.has(word)
          const l = taken ? CARD_LOOKS.dim : CARD_LOOKS.idle
          return (
            <button
              key={word}
              type="button"
              disabled={isLocked || taken}
              onClick={() => put(word)}
              className={`btn-3d min-h-11 rounded-xl border-2 px-3 text-15 font-bold ${l.className} ${isLocked || taken ? '' : 'cursor-pointer'}`}
              style={{ '--edge': l.edge } as CSSProperties}
            >
              {exercise.bank[word]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
