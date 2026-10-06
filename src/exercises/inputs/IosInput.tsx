import { CornerDownLeft, Undo2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { promptOf, runSession, type TermLine } from '../../ios/engine'
import type { IosExercise } from '../../lib/types'
import { iosSetup, judgeIos } from '../logic'
import type { InputProps } from '../looks'

const MODEL_LABEL: Record<IosExercise['device']['model'], string> = {
  isr4331: 'ISR4331',
  c2960: 'Catalyst 2960',
  c3650: 'Catalyst 3650',
}

function Line({ line }: { line: TermLine }) {
  if (line.kind === 'in') {
    if (line.hidden) return null
    return (
      <div className="whitespace-pre-wrap wrap-anywhere">
        <span className="text-white/80">{line.prompt}</span>
        {line.text}
      </div>
    )
  }
  if (line.kind === 'langit')
    return (
      <div className="my-1 rounded-md bg-matahari-muda px-2 py-1 font-sans text-13 text-tinta" data-langit>
        {line.text}
      </div>
    )
  return <div className="whitespace-pre-wrap wrap-anywhere text-white/90">{line.text || ' '}</div>
}

/**
 * The IOS simulator terminal (LANGIT_CCNA_PLAN.md section 7). Every typed line is
 * kept, and the whole session is replayed from them, so the terminal, the judge,
 * and the exam all see the same thing. After "Periksa" it says which goals are
 * still missing and shows one way to reach them.
 */
export function IosInput({ exercise, response, onChange, reveal, locked }: InputProps<IosExercise, string[]>) {
  const isLocked = reveal || !!locked
  const session = useMemo(() => runSession(iosSetup(exercise), response), [exercise, response])
  const [draft, setDraft] = useState('')
  const [back, setBack] = useState(0)
  const screen = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const pending = session.state.pending?.kind
  const prompt = pending ? '' : promptOf(session.state)
  // History holds the commands typed at a prompt: not passwords, answers to questions, or banner text.
  const typed = useMemo(() => {
    const ins = session.transcript.filter((l): l is Extract<TermLine, { kind: 'in' }> => l.kind === 'in')
    return response.filter((_, i) => !ins[i]?.hidden && !!ins[i]?.prompt)
  }, [session, response])

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight })
  }, [session.transcript.length])

  const send = () => {
    if (isLocked) return
    onChange([...response, draft])
    setDraft('')
    setBack(0)
    input.current?.focus()
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    send()
  }

  // Up and Down walk through earlier commands, like the IOS history.
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const next = Math.max(0, Math.min(typed.length, back + (e.key === 'ArrowUp' ? 1 : -1)))
    setBack(next)
    setDraft(next === 0 ? '' : typed[typed.length - next])
  }

  const result = reveal ? judgeIos(exercise, response) : null

  return (
    <div>
      <div className={`overflow-hidden rounded-2xl border-2 bg-tinta ${reveal ? (result?.correct ? 'border-mint' : 'border-koral') : 'border-tinta'}`} lang="en">
        <div className="flex items-center gap-2 border-b border-white/15 px-3 py-1.5 text-13 font-semibold text-white">
          <span aria-hidden="true" className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-koral" />
            <span className="h-2 w-2 rounded-full bg-matahari" />
            <span className="h-2 w-2 rounded-full bg-mint" />
          </span>
          {exercise.device.hostname} · {MODEL_LABEL[exercise.device.model]} · console
        </div>
        <div
          ref={screen}
          role="log"
          aria-label={`Terminal ${exercise.device.hostname}`}
          className="max-h-80 min-h-32 overflow-y-auto px-3 py-2 font-mono text-13 leading-relaxed text-white"
          onClick={() => input.current?.focus()}
        >
          {session.transcript.map((line, i) => (
            <Line key={i} line={line} />
          ))}
          {!isLocked && (
            <form onSubmit={submit} className="flex items-baseline">
              <label htmlFor={`ios-${exercise.id}`} className="shrink-0 whitespace-pre text-white/80">
                {prompt}
                <span className="sr-only">{pending === 'password' ? 'Password' : `Perintah untuk ${exercise.device.hostname}`}</span>
              </label>
              <input
                ref={input}
                id={`ios-${exercise.id}`}
                type={pending === 'password' ? 'password' : 'text'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="send"
                className="min-w-0 flex-1 bg-transparent font-mono text-15 text-white caret-mint outline-none"
              />
            </form>
          )}
        </div>
      </div>

      {!isLocked && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={send}
            className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-kabut bg-white px-3 font-display text-15 font-semibold"
          >
            <CornerDownLeft size={18} aria-hidden="true" />
            Enter
          </button>
          <button
            type="button"
            disabled={response.length === 0}
            onClick={() => onChange(response.slice(0, -1))}
            className="flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-kabut bg-white px-3 font-display text-15 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Undo2 size={18} aria-hidden="true" />
            Batalkan baris terakhir
          </button>
        </div>
      )}
      {!isLocked && (
        <p className="mt-2 text-13 text-tinta-lembut">
          Setiap kata boleh disingkat selama unik, seperti di IOS asli: conf t, int g0/0/0, ip add, no shut, sh ip int br. Bantuan ? dan Tab tidak ada.
        </p>
      )}

      {reveal && result && (
        <div className="mt-4 space-y-3 text-15">
          {!result.correct && result.missing.length > 0 && (
            <div className="rounded-xl border-2 border-koral bg-koral-muda p-3">
              <p className="font-display font-bold">Belum terpenuhi</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 font-mono text-13" lang="en">
                {result.missing.map((m) => (
                  <li key={m} className="wrap-anywhere">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-xl border-2 border-kabut bg-white p-3">
            <p className="font-display font-bold">Contoh perintah yang benar</p>
            <pre className="mt-1 whitespace-pre-wrap font-mono text-13 wrap-anywhere" lang="en">
              {exercise.solution.join('\n')}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
