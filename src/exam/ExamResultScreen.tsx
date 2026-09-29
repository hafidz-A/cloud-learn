import { CircleCheck, CircleX, Clock } from 'lucide-react'
import { Meter } from '../charts/Meter'
import { Button } from '../components/Button'
import { PATHS } from '../content/course'
import { leaveFlow, navigate } from '../lib/router'
import type { PathId } from '../lib/types'
import { useProgress } from '../store/progress'
import { PASS_SCORE, formatClock, scoreAttempt } from './examLogic'
import { formatDate, modeLabel } from './format'
import { examQuestion } from './pool'

/** Score, pass or fail, per-domain bars, and time used (plan section 12.5). No mascot, no celebration. */
export function ExamResultScreen({ attemptId }: { attemptId: string }) {
  const attempt = useProgress((s) => [...s.examHistory, ...(s.courses.az104?.examHistory ?? [])].find((a) => a.id === attemptId))

  if (!attempt || attempt.score === undefined) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-20 font-bold">Hasil ujian tidak ditemukan</h1>
        <Button className="mt-6" onClick={() => leaveFlow('ujian')}>
          Ke halaman Ujian
        </Button>
      </main>
    )
  }

  const passed = attempt.score >= PASS_SCORE
  const { results } = scoreAttempt(attempt, examQuestion)
  const wrong = Object.values(results).filter((r) => !r.correct).length
  const domains = ([1, 2, 3] as PathId[]).filter((p) => (attempt.domainScores?.[p]?.total ?? 0) > 0)

  return (
    <main className="space-y-4 px-4 pb-44 pt-[calc(24px+env(safe-area-inset-top))]">
      <p className="text-13 font-semibold text-tinta-lembut">
        {modeLabel(attempt.mode, attempt.domain)} · {formatDate(attempt.startedAt)}
      </p>
      <section className="rounded-2xl border-2 border-kabut bg-white p-5 text-center">
        <h1 className="font-display text-17 font-bold text-tinta-lembut">Skor kamu</h1>
        <p className="font-display text-[64px] font-bold leading-none">{attempt.score}</p>
        <p className="mt-1 text-15 text-tinta-lembut">dari 1.000 · lulus mulai {PASS_SCORE}</p>
        <p
          className={`mx-auto mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-display text-17 font-bold ${passed ? 'bg-mint-muda' : 'bg-koral-muda'}`}
        >
          {passed ? <CircleCheck size={20} className="text-mint-dalam" aria-hidden="true" /> : <CircleX size={20} className="text-koral-dalam" aria-hidden="true" />}
          {passed ? 'Lulus' : 'Belum lulus'}
        </p>
        <p className="mt-3 text-13 text-tinta-lembut">Skor ini perkiraan. Microsoft memakai skala skor sendiri yang tidak dipublikasikan.</p>
      </section>

      <section className="rounded-2xl border-2 border-kabut bg-white p-4">
        <h2 className="font-display text-17 font-bold">Skor per domain</h2>
        <ul className="mt-3 space-y-4">
          {domains.map((p) => {
            const d = attempt.domainScores![p]
            return (
              <li key={p}>
                <Meter
                  label={`Jalur ${p} · ${PATHS[p - 1].domain}`}
                  detail={`${d.right} dari ${d.total} poin`}
                  value={d.right / d.total}
                  valueText={`${Math.round((d.right / d.total) * 100)}%`}
                />
              </li>
            )
          })}
        </ul>
      </section>

      <section className="flex items-center gap-3 rounded-2xl border-2 border-kabut bg-white p-4">
        <Clock size={22} className="text-tinta-lembut" aria-hidden="true" />
        <p className="text-15">
          Waktu terpakai <span className="font-bold tabular-nums">{formatClock(attempt.elapsedSec)}</span> dari{' '}
          {formatClock(attempt.timeLimitSec)}
        </p>
      </section>

      {wrong > 0 && <p className="text-15 text-tinta-lembut">{wrong} soal yang salah sudah masuk antrean Latihan.</p>}

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[480px] border-t-2 border-kabut bg-langit px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-4">
        <Button block onClick={() => navigate({ name: 'exam-review', attemptId: attempt.id })}>
          Lihat pembahasan
        </Button>
        <Button variant="putih" block className="mt-3" onClick={() => leaveFlow('ujian')}>
          Kembali ke Ujian
        </Button>
      </div>
    </main>
  )
}
