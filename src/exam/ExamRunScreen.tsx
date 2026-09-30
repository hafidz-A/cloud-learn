import { ChevronLeft, ChevronRight, Flag, LayoutGrid, Lock, Timer, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { GlossaryText } from '../components/GlossaryText'
import { CASE_STUDIES, COURSES } from '../content/course'
import { ExerciseInput } from '../exercises/ExerciseInput'
import { INSTRUCTIONS } from '../exercises/instructions'
import type { Response } from '../exercises/logic'
import { useLessonKeys } from '../lesson/useLessonKeys'
import { leaveFlow } from '../lib/router'
import { useProgress } from '../store/progress'
import { CaseScenario } from './CaseScenario'
import { formatClock, isAnswered, openRange } from './examLogic'
import { examQuestion, submitExam } from './pool'

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-tinta/40" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85dvh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-white px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-5"
      >
        <h2 className="font-display text-20 font-bold">{title}</h2>
        {children}
      </motion.div>
    </div>
  )
}

/**
 * The running exam: calm colors, countdown, question grid, flags (AZ-900 plan
 * section 12.2). An AZ-104 full simulation ends with a case study section; once
 * the player moves on to it, the questions before it are locked (AZ-104 plan 9.2).
 */
export function ExamRunScreen() {
  const attempt = useProgress((s) => s.activeExam)
  const updateExam = useProgress((s) => s.updateExam)
  const [sheet, setSheet] = useState<'grid' | 'submit' | 'exit' | 'section' | null>(null)
  const [view, setView] = useState<'question' | 'scenario'>('question')

  // Countdown. It only runs while the app is on screen; a closed app keeps its remaining time.
  useEffect(() => {
    const tick = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      const a = useProgress.getState().activeExam
      if (!a) return
      const elapsedSec = a.elapsedSec + 1
      if (elapsedSec >= a.timeLimitSec) submitExam({ ...a, elapsedSec: a.timeLimitSec })
      else useProgress.getState().tickExam(elapsedSec)
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const total = attempt?.questionIds.length ?? 0
  const [lo, hi] = attempt ? openRange(attempt) : [0, 0]
  const index = Math.min(hi - 1, Math.max(lo, attempt?.current ?? 0))
  const go = (i: number) => {
    if (!attempt) return
    updateExam({ current: Math.min(hi - 1, Math.max(lo, i)) })
    window.scrollTo({ top: 0 })
  }

  useLessonKeys(!!attempt && sheet === null, (key) => {
    if (key === 'ArrowRight') go(index + 1)
    else if (key === 'ArrowLeft') go(index - 1)
    else return false
    return true
  })

  if (!attempt) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-20 font-bold">Tidak ada ujian yang sedang berjalan</h1>
        <Button className="mt-6" onClick={() => leaveFlow('ujian')}>
          Ke halaman Ujian
        </Button>
      </main>
    )
  }

  const id = attempt.questionIds[index]
  const q = examQuestion(id)
  const paths = COURSES[attempt.course ?? 'az900'].paths
  const remaining = attempt.timeLimitSec - attempt.elapsedSec
  const flagged = attempt.flagged.includes(id)
  const answered = attempt.questionIds.map((qid) => {
    const x = examQuestion(qid)
    return !!x && isAnswered(x.exercise, attempt.responses[qid], attempt.optionOrder[qid])
  })
  const unanswered = answered.filter((a) => !a).length
  const caseStudy = attempt.caseStudyId ? CASE_STUDIES.find((c) => c.id === attempt.caseStudyId) : undefined
  // The main section before a case study: its end leads into the case study instead of "Kumpulkan".
  const beforeCase = attempt.caseStart !== undefined && !attempt.caseEntered
  const inCase = attempt.caseStart !== undefined && !!attempt.caseEntered
  const openIds = attempt.questionIds.slice(lo, hi)
  const openUnanswered = answered.slice(lo, hi).filter((a) => !a).length
  const openFlagged = openIds.filter((qid) => attempt.flagged.includes(qid)).length
  const enterCase = () => {
    updateExam({ caseEntered: true, current: attempt.caseStart })
    setView('scenario')
    setSheet(null)
    window.scrollTo({ top: 0 })
  }

  const setResponse = (r: Response) => updateExam({ responses: { ...attempt.responses, [id]: r } })
  const toggleFlag = () => updateExam({ flagged: flagged ? attempt.flagged.filter((f) => f !== id) : [...attempt.flagged, id] })

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b-2 border-kabut bg-langit pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2 px-2 py-2">
          <button
            type="button"
            onClick={() => setSheet('exit')}
            aria-label="Keluar dari ujian"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
          <p className="flex-1 font-display text-17 font-bold">
            Soal {index + 1}
            <span className="text-tinta-lembut">/{total}</span>
          </p>
          <p
            className={`flex min-h-10 items-center gap-1.5 rounded-xl px-3 font-display text-17 font-bold tabular-nums ${remaining <= 300 ? 'bg-koral-muda' : 'bg-white'}`}
            role="timer"
            aria-label={`Sisa waktu ${formatClock(remaining)}`}
          >
            <Timer size={18} aria-hidden="true" />
            {formatClock(remaining)}
          </p>
          <button
            type="button"
            onClick={() => setSheet('grid')}
            aria-label="Daftar nomor soal"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
          >
            <LayoutGrid size={24} />
          </button>
        </div>
        <div className="h-1 bg-kabut" aria-hidden="true">
          <div className="h-full bg-tinta-lembut" style={{ width: `${((total - unanswered) / total) * 100}%` }} />
        </div>
      </header>

      <main className="flex-1 px-4 pb-40 pt-4 select-none [-webkit-touch-callout:none]" data-exam-question={id} data-exam-section={inCase ? 'case' : 'main'}>
        {inCase && caseStudy && (
          <div className="mb-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label={`Studi kasus ${caseStudy.title}`}>
            {(['question', 'scenario'] as const).map((v) => {
              const on = view === v
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setView(v)}
                  className={`btn-3d min-h-11 cursor-pointer rounded-xl border-2 px-2 font-display text-15 font-bold ${on ? 'border-biru bg-biru-muda' : 'border-kabut bg-white'}`}
                  style={{ '--edge': on ? 'var(--color-biru)' : 'var(--color-kabut)' } as CSSProperties}
                >
                  {v === 'question' ? 'Soal' : 'Skenario'}
                </button>
              )
            })}
          </div>
        )}
        {inCase && caseStudy && view === 'scenario' ? (
          <CaseScenario caseStudy={caseStudy} />
        ) : q ? (
          <>
            <p className="flex items-center justify-between gap-2 text-13 font-semibold text-tinta-lembut">
              <span>
                {inCase && caseStudy ? `Studi kasus · ${caseStudy.title}` : `Jalur ${q.path} · ${paths[q.path - 1]?.domain ?? ''}`}
              </span>
              <button
                type="button"
                aria-pressed={flagged}
                onClick={toggleFlag}
                className={`flex min-h-10 cursor-pointer items-center gap-1 rounded-lg border-2 px-2 font-display ${flagged ? 'border-matahari-dalam bg-matahari-muda text-tinta' : 'border-kabut bg-white'}`}
              >
                <Flag size={16} className={flagged ? 'fill-matahari text-matahari-dalam' : ''} aria-hidden="true" />
                {flagged ? 'Ditandai' : 'Tandai'}
              </button>
            </p>
            <p className="mt-3 font-display text-15 font-semibold text-tinta-lembut">{INSTRUCTIONS[q.exercise.type]}</p>
            <h2 lang="en" className={`mt-2 font-bold ${q.exercise.prompt.length < 90 ? 'text-20' : 'text-17'}`}>
              <GlossaryText text={q.exercise.prompt} />
            </h2>
            <div className="mt-5">
              <ExerciseInput
                key={id}
                exercise={q.exercise}
                response={attempt.responses[id] as Response}
                onChange={setResponse}
                layout={attempt.optionOrder[id] ?? []}
                reveal={false}
              />
            </div>
          </>
        ) : (
          <p className="text-15 text-tinta-lembut">Soal ini tidak ditemukan di bank soal.</p>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto grid max-w-[480px] grid-cols-2 gap-3 border-t-2 border-kabut bg-langit px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-4">
        <Button variant="putih" disabled={index === lo} onClick={() => go(index - 1)} className="flex items-center justify-center gap-1">
          <ChevronLeft size={22} aria-hidden="true" />
          Sebelumnya
        </Button>
        {index < hi - 1 ? (
          <Button onClick={() => go(index + 1)} className="flex items-center justify-center gap-1">
            Berikutnya
            <ChevronRight size={22} aria-hidden="true" />
          </Button>
        ) : beforeCase ? (
          <Button onClick={() => setSheet('section')}>Ke studi kasus</Button>
        ) : (
          <Button onClick={() => setSheet('submit')}>Kumpulkan</Button>
        )}
      </div>

      {sheet === 'grid' && (
        <Sheet title={inCase ? 'Nomor soal · studi kasus' : 'Nomor soal'} onClose={() => setSheet(null)}>
          <ol className="mt-4 grid grid-cols-6 gap-2" start={lo + 1}>
            {openIds.map((qid, k) => {
              const i = lo + k
              const isFlagged = attempt.flagged.includes(qid)
              const state = answered[i] ? 'sudah dijawab' : 'belum dijawab'
              return (
                <li key={qid}>
                  <button
                    type="button"
                    onClick={() => {
                      go(i)
                      setSheet(null)
                    }}
                    aria-label={`Soal ${i + 1}, ${state}${isFlagged ? ', ditandai' : ''}`}
                    aria-current={i === index ? 'step' : undefined}
                    className={`relative flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border-2 font-display text-15 font-bold ${
                      answered[i] ? 'border-tinta-lembut bg-kabut' : 'border-kabut bg-white'
                    } ${i === index ? 'ring-4 ring-biru/40' : ''}`}
                  >
                    {i + 1}
                    {isFlagged && <Flag size={12} className="absolute -right-1 -top-1 fill-matahari text-matahari-dalam" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ol>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-13 text-tinta-lembut">
            <li className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded border-2 border-kabut bg-white" aria-hidden="true" />
              Belum dijawab ({openUnanswered})
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded border-2 border-tinta-lembut bg-kabut" aria-hidden="true" />
              Sudah dijawab ({openIds.length - openUnanswered})
            </li>
            <li className="flex items-center gap-1.5">
              <Flag size={14} className="fill-matahari text-matahari-dalam" aria-hidden="true" />
              Ditandai ({openFlagged})
            </li>
          </ul>
          {beforeCase && caseStudy && (
            <p className="mt-4 text-15 text-tinta-lembut">
              Berikutnya: studi kasus {caseStudy.title}, {total - attempt.caseStart!} soal. Setelah masuk ke sana, soal 1–{attempt.caseStart} tidak bisa dibuka lagi.
            </p>
          )}
          {inCase && (
            <p className="mt-4 flex items-start gap-1.5 text-15 text-tinta-lembut">
              <Lock size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              Soal 1–{attempt.caseStart} sudah terkunci.
            </p>
          )}
          <Button block className="mt-5" onClick={() => setSheet(beforeCase ? 'section' : 'submit')}>
            {beforeCase ? 'Ke studi kasus' : 'Kumpulkan'}
          </Button>
        </Sheet>
      )}

      {sheet === 'section' && (
        <Sheet title="Lanjut ke studi kasus?" onClose={() => setSheet(null)}>
          <ul className="mt-3 space-y-1 text-17">
            <li>
              <span className="font-bold">{openUnanswered}</span> soal di bagian ini belum dijawab
            </li>
            <li>
              <span className="font-bold">{openFlagged}</span> soal di bagian ini ditandai untuk ditinjau
            </li>
          </ul>
          <p lang="en" className="mt-3 rounded-xl bg-matahari-muda p-3 font-display text-15 font-bold">
            You can&apos;t return to this section after you continue.
          </p>
          <p className="mt-2 text-15 text-tinta-lembut">
            Seperti ujian asli: setelah lanjut, soal 1–{attempt.caseStart} terkunci. Jawabannya tetap dinilai, tapi tidak bisa dibuka atau diubah lagi.
          </p>
          <Button block className="mt-5" onClick={enterCase}>
            Lanjut ke studi kasus
          </Button>
          <Button variant="putih" block className="mt-3" onClick={() => setSheet(null)}>
            Kembali ke soal
          </Button>
        </Sheet>
      )}

      {sheet === 'submit' && (
        <Sheet title="Kumpulkan ujian?" onClose={() => setSheet(null)}>
          <ul className="mt-3 space-y-1 text-17">
            <li>
              <span className="font-bold">{unanswered}</span> soal belum dijawab
            </li>
            <li>
              <span className="font-bold">{attempt.flagged.length}</span> soal ditandai untuk ditinjau
            </li>
          </ul>
          <p className="mt-2 text-15 text-tinta-lembut">Setelah dikumpulkan, jawaban tidak bisa diubah lagi.</p>
          <Button block className="mt-5" onClick={() => submitExam(useProgress.getState().activeExam!)}>
            Kumpulkan sekarang
          </Button>
          <Button variant="putih" block className="mt-3" onClick={() => setSheet(null)}>
            Kembali ke soal
          </Button>
        </Sheet>
      )}

      {sheet === 'exit' && (
        <Sheet title="Keluar dari ujian?" onClose={() => setSheet(null)}>
          <p className="mt-2 text-15 text-tinta-lembut">
            Jawaban dan sisa waktu ({formatClock(remaining)}) tersimpan. Lanjutkan kapan saja dari halaman Ujian.
          </p>
          <Button block className="mt-5" onClick={() => setSheet(null)}>
            Lanjut mengerjakan
          </Button>
          <Button variant="putih" block className="mt-3" onClick={() => leaveFlow('ujian')}>
            Keluar
          </Button>
        </Sheet>
      )}
    </div>
  )
}
