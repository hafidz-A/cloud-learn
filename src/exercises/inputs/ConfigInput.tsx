import { Minus, Plus } from 'lucide-react'
import { useId } from 'react'
import type { ConfigExercise, ConfigValue } from '../../lib/types'
import { configValueText, judgeConfig } from '../logic'
import type { InputProps } from '../looks'

/**
 * A pretend Azure portal form. Selects, switches, numbers, and text boxes keep
 * their native controls, so they work with a keyboard and a screen reader. After
 * "Periksa", each judged field shows right or wrong, with the expected value.
 */
export function ConfigInput({ exercise, response, onChange, reveal, locked }: InputProps<ConfigExercise, (ConfigValue | null)[]>) {
  const baseId = useId()
  const disabled = reveal || !!locked
  const set = (i: number, v: ConfigValue | null) => onChange(response.map((old, j) => (j === i ? v : old)))
  const verdicts = reveal ? judgeConfig(exercise, response) : []
  const verdictOf = (i: number) => verdicts.find((v) => v.field === i)

  return (
    <figure lang="en" className="overflow-hidden rounded-2xl border-2 border-kabut bg-white">
      <div className="flex items-center gap-2 bg-tinta px-4 py-2 text-13 font-semibold text-white">
        <span aria-hidden="true" className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-white/60" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
          <span className="h-2 w-2 rounded-full bg-white/60" />
        </span>
        Microsoft Azure portal
      </div>
      <figcaption className="border-b-2 border-kabut px-4 py-2 font-display text-17 font-bold">{exercise.blade}</figcaption>
      <div className="divide-y divide-kabut">
        {exercise.fields.map((f, i) => {
          const id = `${baseId}-f${i}`
          const value = response[i]
          const verdict = verdictOf(i)
          const border = verdict ? (verdict.ok ? 'border-l-mint bg-mint-muda' : 'border-l-koral bg-koral-muda') : 'border-l-transparent'
          const expected = verdict && !verdict.ok ? exercise.answer[f.label] : undefined
          const off = disabled || f.readOnly
          const control =
            f.kind === 'select' ? (
              <select
                id={id}
                value={value === null || value === undefined ? '' : String(value)}
                disabled={off}
                onChange={(e) => set(i, e.target.value || null)}
                className="min-h-11 w-full rounded-lg border-2 border-kabut-dalam bg-white px-2 text-15 disabled:bg-langit"
              >
                <option value="">Select…</option>
                {f.choices.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : f.kind === 'toggle' ? (
              <button
                id={id}
                type="button"
                role="switch"
                aria-checked={value === true}
                disabled={off}
                onClick={() => set(i, !(value === true))}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-3 font-semibold disabled:cursor-default ${value === true ? 'border-biru-dalam bg-biru-muda' : 'border-kabut-dalam bg-white'}`}
              >
                <span aria-hidden="true" className={`relative h-5 w-9 rounded-full ${value === true ? 'bg-biru-dalam' : 'bg-kabut-dalam'}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${value === true ? 'left-4.5' : 'left-0.5'}`} />
                </span>
                {value === true ? 'On' : 'Off'}
              </button>
            ) : f.kind === 'number' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Kurangi ${f.label}`}
                  disabled={off}
                  onClick={() => set(i, Math.max(f.min ?? -Infinity, Number(value ?? 0) - (f.step ?? 1)))}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border-2 border-kabut-dalam disabled:cursor-default"
                >
                  <Minus size={18} aria-hidden="true" />
                </button>
                <input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  value={value === null || value === undefined ? '' : String(value)}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  disabled={off}
                  onChange={(e) => set(i, e.target.value === '' ? null : Number(e.target.value))}
                  className="min-h-11 w-24 rounded-lg border-2 border-kabut-dalam px-2 text-center text-15 disabled:bg-langit"
                />
                <button
                  type="button"
                  aria-label={`Tambah ${f.label}`}
                  disabled={off}
                  onClick={() => set(i, Math.min(f.max ?? Infinity, Number(value ?? 0) + (f.step ?? 1)))}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border-2 border-kabut-dalam disabled:cursor-default"
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <input
                id={id}
                type="text"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={value === null || value === undefined ? '' : String(value)}
                disabled={off}
                onChange={(e) => set(i, e.target.value)}
                className="min-h-11 w-full rounded-lg border-2 border-kabut-dalam px-2 font-mono text-15 disabled:bg-langit"
              />
            )
          return (
            <div key={f.label} className={`border-l-4 px-4 py-3 ${border}`}>
              <label htmlFor={id} className="mb-1.5 block text-13 font-semibold text-tinta-lembut">
                {f.label}
              </label>
              {control}
              {expected !== undefined && (
                <p className="mt-1.5 text-13 font-semibold">
                  Seharusnya: <span className="font-mono">{configValueText(expected)}</span>
                </p>
              )}
            </div>
          )
        })}
      </div>
    </figure>
  )
}
