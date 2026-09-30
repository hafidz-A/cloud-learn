import type { CSSProperties } from 'react'
import type { KqlExercise } from '../../lib/types'
import { CARD_LOOKS, type InputProps } from '../looks'

/**
 * A pretend Log Analytics query editor: build the KQL query from tokens (a pipe
 * "|" starts a new line, as KQL is usually written). Tap a typed token to take
 * it back. Once the query is right, the pretend result table appears.
 */
export function KqlInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<KqlExercise, number[]>) {
  const isLocked = reveal || !!locked
  const typed = response.map((i) => exercise.tokens[i]).join(' ')
  const right = typed === exercise.answer.join(' ')
  const [header, ...rows] = exercise.sampleResult
  return (
    <div lang="en">
      <div className={`overflow-hidden rounded-2xl border-2 bg-white ${reveal ? (right ? 'border-mint' : 'border-koral') : 'border-kabut'}`}>
        <div className="flex items-center justify-between bg-tinta px-3 py-1.5 text-13 font-semibold text-white">
          <span>Log Analytics workspace · Logs</span>
          <span aria-hidden="true" className="rounded bg-biru px-2 py-0.5">▶ Run</span>
        </div>
        <div className="min-h-24 px-3 py-3 font-mono text-15 leading-relaxed">
          {response.length === 0 && !isLocked && <span className="text-tinta-lembut">Ketuk potongan query di bawah</span>}
          {response.map((token, i) => {
            const text = exercise.tokens[token]
            return (
              <span key={`${token}-${i}`}>
                {text === '|' && i > 0 && <br />}
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => onChange(response.filter((_, j) => j !== i))}
                  aria-label={`Hapus ${text}`}
                  className={`mr-1.5 rounded px-0.5 ${text === '|' ? 'font-bold text-biru-dalam' : ''} ${isLocked ? '' : 'cursor-pointer underline decoration-kabut-dalam underline-offset-4'}`}
                >
                  {text}
                </button>
              </span>
            )
          })}
          {reveal && !right && (
            <p className="mt-2 text-13">
              <span className="font-semibold text-mint-dalam">Benar:</span> {exercise.answer.join(' ')}
            </p>
          )}
        </div>
        {reveal && right && (
          <div className="overflow-x-auto border-t-2 border-kabut" tabIndex={0} role="region" aria-label="Hasil query">
            <table className="w-full border-collapse text-left text-13">
              <thead>
                <tr className="bg-biru-muda">
                  {header.map((h) => (
                    <th key={h} scope="col" className="whitespace-nowrap px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, r) => (
                  <tr key={r} className="border-t border-kabut">
                    {row.map((cell, c) => (
                      <td key={c} className="whitespace-nowrap px-3 py-2 font-mono">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Potongan query">
        {layout.map((token) => {
          const taken = response.includes(token)
          const l = taken ? CARD_LOOKS.dim : CARD_LOOKS.idle
          return (
            <button
              key={token}
              type="button"
              disabled={isLocked || taken}
              onClick={() => onChange([...response, token])}
              className={`btn-3d min-h-11 rounded-xl border-2 px-3 font-mono text-15 font-semibold ${l.className} ${isLocked || taken ? '' : 'cursor-pointer'}`}
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
