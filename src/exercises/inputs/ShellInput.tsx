import type { CSSProperties } from 'react'
import type { ShellExercise } from '../../lib/types'
import { CARD_LOOKS, type InputProps } from '../looks'

/** A pretend Cloud Shell: build the command from word tokens. Tap a typed token to take it back. */
export function ShellInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<ShellExercise, number[]>) {
  const isLocked = reveal || !!locked
  const typed = response.map((i) => exercise.tokens[i]).join(' ')
  const right = typed === exercise.answer.join(' ')
  return (
    <div>
      <div
        className={`overflow-hidden rounded-2xl border-2 bg-tinta ${reveal ? (right ? 'border-mint' : 'border-koral') : 'border-tinta'}`}
        lang="en"
      >
        <div className="flex items-center gap-2 border-b border-white/15 px-3 py-1.5 text-13 font-semibold text-white">
          <span aria-hidden="true" className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-koral" />
            <span className="h-2 w-2 rounded-full bg-matahari" />
            <span className="h-2 w-2 rounded-full bg-mint" />
          </span>
          Azure Cloud Shell (Bash)
        </div>
        <div className="min-h-24 px-3 py-3 font-mono text-15 leading-relaxed text-white wrap-anywhere">
          <span className="text-mint">langit@Azure</span>:<span className="text-matahari">~</span>$
          {response.map((token, i) => (
            <button
              key={`${token}-${i}`}
              type="button"
              disabled={isLocked}
              onClick={() => onChange(response.filter((_, j) => j !== i))}
              aria-label={`Hapus ${exercise.tokens[token]}`}
              className={`ml-1.5 max-w-full rounded px-1 text-left ${isLocked ? '' : 'cursor-pointer underline decoration-white/30 underline-offset-4'}`}
            >
              {exercise.tokens[token]}
            </button>
          ))}
          {!isLocked && <span aria-hidden="true" className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-white/80 motion-safe:animate-pulse" />}
          {reveal && !right && (
            <p className="mt-2 text-13 text-white/85">
              <span className="text-mint">Benar:</span> {exercise.answer.join(' ')}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Potongan perintah">
        {layout.map((token) => {
          const taken = response.includes(token)
          const l = taken ? CARD_LOOKS.dim : CARD_LOOKS.idle
          return (
            <button
              key={token}
              type="button"
              disabled={isLocked || taken}
              onClick={() => onChange([...response, token])}
              className={`btn-3d min-h-11 max-w-full rounded-xl border-2 px-3 text-left font-mono text-15 font-semibold wrap-anywhere ${l.className} ${isLocked || taken ? '' : 'cursor-pointer'}`}
              style={{ '--edge': l.edge } as CSSProperties}
            >
              {exercise.tokens[token]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
