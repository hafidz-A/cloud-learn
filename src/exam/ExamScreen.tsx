import { CircleAlert, CircleCheck, ClipboardCheck, History, Play, Timer } from 'lucide-react'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { LineChart } from '../charts/LineChart'
import { Button } from '../components/Button'
import { COURSES } from '../content/course'
import { hrefFor, navigate } from '../lib/router'
import type { CourseId, ExamMode, PathId } from '../lib/types'
import { useActiveCourse } from '../store/course'
import { useCourseProgress, useProgress } from '../store/progress'
import {
  EXAM_MODES,
  FULL_SPLIT,
  PASS_SCORES,
  READY_SCORES,
  createAttempt,
  formatClock,
  isAnswered,
  pickDomain,
  pickFull,
  pickWeak,
  readiness,
  weakestDomain,
} from './examLogic'
import { formatDate, modeLabel } from './format'
import { CASE_POOLS, EXAM_POOLS, examQuestion } from './pool'

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border-2 border-kabut bg-white p-4 ${className}`}>{children}</section>
}

/** True when every lesson of the path is finished in the journey. */
function useJourneyDone(course: CourseId): Record<PathId, boolean> {
  const done = useCourseProgress(course).lessonsDone
  const out = {} as Record<PathId, boolean>
  for (const p of COURSES[course].paths) out[p.id] = COURSES[course].units.filter((u) => u.path === p.id).every((u) => u.lessons.every((l) => done[l.id]))
  return out
}

/** A course code such as AZ-104, kept on one line instead of breaking at its hyphen. */
const Code = ({ course }: { course: CourseId }) => <span className="whitespace-nowrap">{COURSES[course].name}</span>

/** The exam page follows the active course: its questions, history, and readiness only (LANGIT_AZ104_PLAN.md section 9). */
export function ExamScreen() {
  const course = useActiveCourse()
  return <CourseExamScreen key={course} course={course} />
}

function CourseExamScreen({ course }: { course: CourseId }) {
  const { examHistory: history, conceptStats } = useCourseProgress(course)
  const active = useProgress((s) => s.activeExam)
  const startExam = useProgress((s) => s.startExam)
  const abandonExam = useProgress((s) => s.abandonExam)
  const journeyDone = useJourneyDone(course)
  const [domain, setDomain] = useState<PathId>(1)
  const [confirmAbandon, setConfirmAbandon] = useState(false)
  const paths = COURSES[course].paths
  const pool = EXAM_POOLS[course]
  const cases = CASE_POOLS[course]
  const modes = EXAM_MODES[course]

  const start = (mode: ExamMode) => {
    const questions =
      mode === 'full'
        ? pickFull(pool, history, Math.random, course, cases)
        : mode === 'domain'
          ? pickDomain(pool, domain, history, Math.random, course)
          : pickWeak(pool, conceptStats, Math.random, course).questions
    if (!questions.length) return
    startExam(createAttempt(mode, questions, mode === 'domain' ? domain : undefined, Math.random, course))
    navigate({ name: 'exam' })
  }

  const ready = readiness(history, course)
  const passScore = PASS_SCORES[course]
  const readyScore = READY_SCORES[course]
  const weakest = weakestDomain(history.slice(-5))
  const fullRuns = history.filter((a) => a.mode === 'full' && a.score !== undefined)
  const poolByPath = (p: PathId) => pool.filter((q) => q.path === p).length
  const weakFromStats = pickWeak(pool, conceptStats, Math.random, course).fromStats
  const activeCourse = active ? (active.course ?? 'az900') : course

  const warning = (paths: PathId[]) => {
    const open = paths.filter((p) => !journeyDone[p])
    if (!open.length) return null
    return (
      <p className="mt-2 flex items-start gap-1.5 text-13 text-tinta-lembut">
        <CircleAlert size={16} className="mt-px shrink-0" aria-hidden="true" />
        Journey jalur {open.join(', ')} belum selesai. Kamu tetap bisa mulai.
      </p>
    )
  }

  const modeCard = (mode: ExamMode, extra: ReactNode, paths: PathId[], note?: string) => {
    const m = modes[mode]
    return (
      <Card>
        <h2 className="font-display text-20 font-bold">{m.title}</h2>
        <p className="mt-1 flex items-center gap-3 text-15 text-tinta-lembut">
          <span className="flex items-center gap-1">
            <ClipboardCheck size={16} aria-hidden="true" />
            {m.count} soal
          </span>
          <span className="flex items-center gap-1">
            <Timer size={16} aria-hidden="true" />
            {m.minutes} menit
          </span>
        </p>
        <p className="mt-1 text-15">{m.blurb}</p>
        {extra}
        {note && <p className="mt-2 text-13 text-tinta-lembut">{note}</p>}
        {warning(paths)}
        <Button block className="mt-4" disabled={!!active || pool.length === 0} onClick={() => start(mode)}>
          Mulai
        </Button>
      </Card>
    )
  }

  return (
    <main className="space-y-4 px-4 pb-32 pt-6">
      <h1 className="font-display text-28 font-bold">Ujian</h1>
      <p className="text-15 text-tinta-lembut">
        Simulasi kondisi <Code course={course} /> asli: waktu terbatas, tanpa hearts, tanpa penjelasan sampai selesai. Bank soal: {pool.length} soal (
        {paths.map((p) => poolByPath(p.id)).join(' / ')} per domain){cases.length > 0 && `, ditambah ${cases.length} studi kasus`}.
      </p>

      {active && (
        <Card className="border-biru">
          <p className="font-display text-13 font-semibold text-tinta-lembut">
            Ujian <Code course={activeCourse} /> yang belum selesai
          </p>
          <h2 className="font-display text-20 font-bold">{modeLabel(active.mode, active.domain)}</h2>
          {activeCourse !== course && (
            <p className="mt-1 text-15 text-tinta-lembut">
              Hanya satu ujian yang bisa berjalan. Selesaikan atau buang ujian ini sebelum mulai ujian <Code course={course} />.
            </p>
          )}
          <p className="text-15 text-tinta-lembut">
            Sisa waktu {formatClock(active.timeLimitSec - active.elapsedSec)} ·{' '}
            {active.questionIds.filter((id) => {
              const q = examQuestion(id)
              return q && isAnswered(q.exercise, active.responses[id], active.optionOrder[id])
            }).length}{' '}
            dari {active.questionIds.length} dijawab
          </p>
          <Button block className="mt-4 flex items-center justify-center gap-2" onClick={() => navigate({ name: 'exam' })}>
            <Play size={20} className="fill-white" aria-hidden="true" />
            Lanjutkan
          </Button>
          {confirmAbandon ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button variant="putih" onClick={() => setConfirmAbandon(false)}>
                Batal
              </Button>
              <Button
                variant="koral"
                onClick={() => {
                  abandonExam()
                  setConfirmAbandon(false)
                }}
              >
                Buang ujian
              </Button>
            </div>
          ) : (
            <Button variant="putih" block className="mt-3" onClick={() => setConfirmAbandon(true)}>
              Buang ujian ini
            </Button>
          )}
        </Card>
      )}

      <Card className={ready.ready ? 'border-mint' : ''}>
        <h2 className="flex items-center gap-2 font-display text-17 font-bold">
          {ready.ready ? <CircleCheck size={20} className="text-mint-dalam" aria-hidden="true" /> : <CircleAlert size={20} className="text-tinta-lembut" aria-hidden="true" />}
          {ready.ready ? 'Siap ujian' : 'Belum siap ujian'}
        </h2>
        <p className="mt-1 text-15">
          {ready.fullCount < 3
            ? `Butuh 3 simulasi penuh dengan rata-rata minimal ${readyScore}. Sudah ${ready.fullCount}.`
            : `Rata-rata 3 simulasi penuh terakhir: ${ready.average}. ${ready.ready ? 'Mantap, pertahankan!' : `Target ${readyScore}.`}`}
        </p>
        {!ready.ready && weakest && (
          <p className="mt-2 text-15 text-tinta-lembut">
            Saran: latih jalur {weakest} ({paths[weakest - 1]?.title}), domain dengan skor terendahmu belakangan ini.
          </p>
        )}
      </Card>

      {modeCard(
        'full',
        null,
        paths.map((p) => p.id),
        `${paths.map((p) => `${FULL_SPLIT[course][p.id]} soal jalur ${p.id}`).join(', ')}${cases.length ? ', termasuk satu studi kasus di bagian akhir' : ''}.`,
      )}
      {modeCard(
        'domain',
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Pilih domain">
          {paths.map((p) => {
            const on = domain === p.id
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setDomain(p.id)}
                className={`btn-3d min-h-14 cursor-pointer rounded-xl border-2 px-2 py-1 text-13 font-bold ${on ? 'border-biru bg-biru-muda' : 'border-kabut bg-white'}`}
                style={{ '--edge': on ? 'var(--color-biru)' : 'var(--color-kabut)' } as CSSProperties}
              >
                Jalur {p.id}
                <span className="block font-semibold text-tinta-lembut">{p.short}</span>
              </button>
            )
          })}
        </div>,
        [domain],
      )}
      {modeCard('weak', null, [], weakFromStats ? undefined : 'Belum ada data latihan, jadi soal dipilih acak dulu.')}

      <Card>
        <h2 className="flex items-center gap-2 font-display text-17 font-bold">
          <History size={20} aria-hidden="true" />
          Riwayat
        </h2>
        {fullRuns.length >= 2 && (
          <div className="mt-3">
            <LineChart
              caption="Skor simulasi penuh dari waktu ke waktu"
              unit="poin"
              yMax={1000}
              references={[...(passScore === null ? [] : [{ value: passScore, label: 'Lulus' }]), { value: readyScore, label: 'Siap' }]}
              data={fullRuns.map((a, i) => ({ key: a.id, label: `#${i + 1}`, full: `Simulasi #${i + 1}, ${formatDate(a.startedAt)}`, value: a.score! }))}
            />
          </div>
        )}
        {history.length === 0 ? (
          <p className="mt-2 text-15 text-tinta-lembut">Belum ada ujian. Mulai dari mini ujian per domain kalau baru belajar.</p>
        ) : (
          <ul className="mt-3 divide-y-2 divide-kabut">
            {[...history].reverse().map((a) => (
              <li key={a.id}>
                <a href={hrefFor({ name: 'exam-result', attemptId: a.id })} className="flex min-h-14 items-center justify-between gap-3 py-2">
                  <span>
                    <span className="block font-display text-15 font-bold">{modeLabel(a.mode, a.domain)}</span>
                    <span className="block text-13 text-tinta-lembut">{formatDate(a.startedAt)}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-20 font-bold tabular-nums">{a.score}</span>
                    <span className="block text-13 text-tinta-lembut">{passScore === null ? 'dari 1.000' : (a.score ?? 0) >= passScore ? 'Lulus' : 'Belum lulus'}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  )
}
