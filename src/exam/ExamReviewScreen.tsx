import { ChevronLeft, CircleCheck, CircleMinus, CircleX, Flag } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { GlossaryText } from '../components/GlossaryText'
import { ExerciseInput } from '../exercises/ExerciseInput'
import { INSTRUCTIONS } from '../exercises/instructions'
import { correctAnswerText, type Response } from '../exercises/logic'
import { navigate } from '../lib/router'
import { useProgress } from '../store/progress'
import { scoreAttempt } from './examLogic'
import { examQuestion } from './pool'

type Filter = 'all' | 'wrong' | 'flagged'

/** Every question with the player's answer, the right answer, and the explanation (plan section 12.5). */
export function ExamReviewScreen({ attemptId }: { attemptId: string }) {
  const attempt = useProgress((s) => s.examHistory.find((a) => a.id === attemptId))
  const [filter, setFilter] = useState<Filter>('all')
  if (!attempt) return null

  const { results } = scoreAttempt(attempt, examQuestion)
  const items = attempt.questionIds.map((id, i) => ({ id, n: i + 1, q: examQuestion(id), r: results[id] }))
  const counts = {
    all: items.length,
    wrong: items.filter((x) => x.r && !x.r.correct).length,
    flagged: items.filter((x) => attempt.flagged.includes(x.id)).length,
  }
  const shown = items.filter((x) => filter === 'all' || (filter === 'wrong' ? x.r && !x.r.correct : attempt.flagged.includes(x.id)))
  const labels: Record<Filter, string> = { all: 'Semua', wrong: 'Salah saja', flagged: 'Ditandai' }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b-2 border-kabut bg-langit px-2 pb-3 pt-[calc(8px+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ name: 'exam-result', attemptId }, { replace: true })}
            aria-label="Kembali ke hasil"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
          >
            <ChevronLeft size={28} />
          </button>
          <h1 className="font-display text-20 font-bold">Pembahasan</h1>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 px-2" role="radiogroup" aria-label="Saring soal">
          {(Object.keys(labels) as Filter[]).map((f) => {
            const on = filter === f
            return (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setFilter(f)}
                className={`btn-3d min-h-11 cursor-pointer rounded-xl border-2 px-2 font-display text-15 font-bold ${on ? 'border-biru bg-biru-muda' : 'border-kabut bg-white'}`}
                style={{ '--edge': on ? 'var(--color-biru)' : 'var(--color-kabut)' } as CSSProperties}
              >
                {labels[f]} ({counts[f]})
              </button>
            )
          })}
        </div>
      </header>

      <main className="space-y-4 px-4 pb-16 pt-4">
        {shown.length === 0 && <p className="text-15 text-tinta-lembut">Tidak ada soal untuk saringan ini.</p>}
        {shown.map(({ id, n, q, r }) => {
          if (!q || !r) return null
          const answer = correctAnswerText(q.exercise)
          const status = !r.answered ? 'Tidak dijawab' : r.correct ? 'Benar' : 'Salah'
          return (
            <article
              key={id}
              className="rounded-2xl border-2 border-kabut bg-white p-4"
              aria-labelledby={`q-${id}`}
              data-result={r.correct ? 'correct' : r.answered ? 'wrong' : 'unanswered'}
            >
              <p className="flex items-center justify-between gap-2 text-13 font-semibold text-tinta-lembut">
                <span>
                  Soal {n} · Jalur {q.path}
                  {attempt.flagged.includes(id) && <Flag size={13} className="ml-1.5 inline fill-matahari text-matahari-dalam" aria-label="ditandai" />}
                </span>
                <span className={`flex items-center gap-1 rounded-lg px-2 py-0.5 font-display text-13 font-bold text-tinta ${r.correct ? 'bg-mint-muda' : r.answered ? 'bg-koral-muda' : 'bg-kabut'}`}>
                  {r.correct ? <CircleCheck size={14} className="text-mint-dalam" aria-hidden="true" /> : r.answered ? <CircleX size={14} className="text-koral-dalam" aria-hidden="true" /> : <CircleMinus size={14} aria-hidden="true" />}
                  {status}
                  {q.exercise.type === 'yesno' && ` · ${r.points}/${r.maxPoints}`}
                </span>
              </p>
              <p className="mt-2 font-display text-13 font-semibold text-tinta-lembut">{INSTRUCTIONS[q.exercise.type]}</p>
              <h2 id={`q-${id}`} lang="en" className="mt-1 text-17 font-bold">
                <GlossaryText text={q.exercise.prompt} />
              </h2>
              <div className="mt-4">
                <ExerciseInput
                  exercise={q.exercise}
                  response={attempt.responses[id] as Response}
                  onChange={() => {}}
                  layout={attempt.optionOrder[id] ?? []}
                  reveal
                />
              </div>
              {!r.correct && answer && (
                <p className="mt-4 text-15">
                  <span className="font-bold">Jawaban benar: </span>
                  <span lang="en">
                    <GlossaryText text={answer} />
                  </span>
                </p>
              )}
              <p className="mt-3 rounded-xl bg-langit p-3 text-15">
                <GlossaryText text={q.exercise.explanation} />
              </p>
            </article>
          )
        })}
      </main>
    </div>
  )
}
