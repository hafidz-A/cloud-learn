import { CircleCheck, CircleX, Clock, ExternalLink } from 'lucide-react'
import { Meter } from '../charts/Meter'
import { Button } from '../components/Button'
import { CASE_STUDIES, COURSES } from '../content/course'
import { leaveFlow, navigate } from '../lib/router'
import { allExamHistory, useProgress } from '../store/progress'
import { PASS_SCORES, formatClock, scoreAttempt } from './examLogic'
import { CERTIFICATION_PAGES, formatDate, modeLabel } from './format'
import { examQuestion } from './pool'

/** Score, pass or fail (none for CCNA), per-domain bars, and time used (plan section 12.5). No mascot, no celebration. */
export function ExamResultScreen({ attemptId }: { attemptId: string }) {
  const attempt = useProgress((s) => allExamHistory(s).find((a) => a.id === attemptId))

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

  const course = attempt.course ?? 'az900'
  const paths = COURSES[course].paths
  const passScore = PASS_SCORES[course]
  const passed = passScore !== null && attempt.score >= passScore
  const { results } = scoreAttempt(attempt, examQuestion)
  // Only answered questions go to the review queue; unanswered ones say nothing about what the player knows.
  const toReview = Object.values(results).filter((r) => r.answered && !r.correct).length
  const domains = paths.map((p) => p.id).filter((p) => (attempt.domainScores?.[p]?.total ?? 0) > 0)
  const caseStudy = attempt.caseStudyId ? CASE_STUDIES.find((c) => c.id === attempt.caseStudyId) : undefined

  return (
    <main className="space-y-4 px-4 pb-44 pt-[calc(24px+env(safe-area-inset-top))]">
      <p className="text-13 font-semibold text-tinta-lembut">
        {modeLabel(attempt.mode, attempt.domain)} · {formatDate(attempt.startedAt)}
      </p>
      <section className="rounded-2xl border-2 border-kabut bg-white p-5 text-center">
        <h1 className="font-display text-17 font-bold text-tinta-lembut">Skor kamu</h1>
        <p className="font-display text-[64px] font-bold leading-none">{attempt.score}</p>
        <p className="mt-1 text-15 text-tinta-lembut">dari 1.000{passScore !== null && ` · lulus mulai ${passScore}`}</p>
        {passScore !== null && (
          <p
            className={`mx-auto mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-display text-17 font-bold ${passed ? 'bg-mint-muda' : 'bg-koral-muda'}`}
          >
            {passed ? <CircleCheck size={20} className="text-mint-dalam" aria-hidden="true" /> : <CircleX size={20} className="text-koral-dalam" aria-hidden="true" />}
            {passed ? 'Lulus' : 'Belum lulus'}
          </p>
        )}
        <p className="mt-3 text-13 text-tinta-lembut">
          {passScore === null
            ? 'Skor ini perkiraan. Cisco tidak memublikasikan nilai lulus CCNA, jadi tidak ada label lulus atau belum lulus.'
            : 'Skor ini perkiraan. Microsoft memakai skala skor sendiri yang tidak dipublikasikan.'}
        </p>
      </section>

      <section className="rounded-2xl border-2 border-kabut bg-white p-4">
        <h2 className="font-display text-17 font-bold">Skor per domain</h2>
        <ul className="mt-3 space-y-4">
          {domains.map((p) => {
            const d = attempt.domainScores![p]
            return (
              <li key={p}>
                <Meter
                  label={`Jalur ${p} · ${paths[p - 1].domain}`}
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

      {caseStudy && <p className="text-15 text-tinta-lembut">Studi kasus: {caseStudy.title}. Soalnya dihitung ke domain masing-masing.</p>}

      {toReview > 0 && <p className="text-15 text-tinta-lembut">{toReview} soal yang dijawab salah sudah masuk antrean Latihan.</p>}

      <a
        href={CERTIFICATION_PAGES[course]}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-kabut bg-white p-4 text-15"
      >
        <ExternalLink size={20} className="shrink-0 text-biru-dalam" aria-hidden="true" />
        <span>
          <span className="block font-display font-bold text-biru-dalam">Practice Assessment {COURSES[course].name} resmi</span>
          <span className="block text-13 text-tinta-lembut">Latihan gratis dari Microsoft, di halaman sertifikasi Microsoft Learn.</span>
        </span>
      </a>

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
