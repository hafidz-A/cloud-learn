import { RotateCcw, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { findLesson, hasContent, playableItems, type LessonRef } from '../content/course'
import { leaveLesson } from '../lib/router'
import { summarizeLesson, type LessonSummary } from '../lib/scoring'
import { useProgress } from '../store/progress'
import { ExerciseView } from './ExerciseView'
import { ExitSheet } from './ExitSheet'
import { FeedbackSheet } from './FeedbackSheet'
import { IntroView } from './IntroView'
import { LessonComplete } from './LessonComplete'
import {
  advance,
  answerCurrent,
  currentEntry,
  firstTryResults,
  isFirstAttempt,
  progressOf,
  readIntro,
  startSession,
  type Session,
} from './session'
import type { Verdict } from './types'

function LessonUnavailable() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Mascot mood="sedih" size={120} />
      <h1 className="mt-4 font-display text-20 font-bold">Lesson ini belum tersedia</h1>
      <p className="mt-1 text-15 text-tinta-lembut">Soalnya masih disiapkan. Coba lesson lain dulu, ya.</p>
      <Button className="mt-6" onClick={leaveLesson}>
        Kembali ke home
      </Button>
    </main>
  )
}

function LessonPlayer({ lessonRef }: { lessonRef: LessonRef }) {
  const { lesson } = lessonRef
  const recordAnswer = useProgress((s) => s.recordAnswer)
  const completeLesson = useProgress((s) => s.completeLesson)

  const [startedAt] = useState(() => Date.now())
  const [session, setSession] = useState(() => startSession(playableItems(lesson)))
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [summary, setSummary] = useState<LessonSummary | null>(null)
  const [confirmExit, setConfirmExit] = useState(false)
  const [sheetHeight, setSheetHeight] = useState(0)
  const onSheetHeight = useCallback((px: number) => setSheetHeight(px), [])

  const entry = currentEntry(session)
  const { item } = entry

  const handleVerdict = (v: Verdict) => {
    if (verdict || item.type === 'intro') return
    // Concept stats count first attempts only; a retry right after the explanation is not mastery.
    if (isFirstAttempt(session)) recordAnswer(item.concept, v.correct)
    setVerdict(v)
    setSession((s) => answerCurrent(s, v.correct))
  }

  const goNext = (from: Session) => {
    window.scrollTo({ top: 0 })
    const next = advance(from)
    if (next) {
      setSession(next)
      setVerdict(null)
      return
    }
    const s = summarizeLesson(lesson.id, firstTryResults(from), Date.now() - startedAt)
    completeLesson(lesson.id, s.accuracy, s.xp)
    setSummary(s)
  }

  const handleClose = () =>
    Object.keys(session.firstTry).length === 0 && session.pos === 0 ? leaveLesson() : setConfirmExit(true)

  if (summary) return <LessonComplete summary={summary} lessonTitle={lesson.title} />

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-langit pb-2 pl-2 pr-5 pt-[calc(8px+env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Keluar dari lesson"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
        >
          <X size={28} strokeWidth={2.75} />
        </button>
        <ProgressBar value={progressOf(session)} label={`Progres lesson ${lesson.title}`} />
      </div>

      <main
        className="flex flex-1 flex-col px-4 pt-4"
        style={{ paddingBottom: Math.max(128, sheetHeight + 24) }}
        data-step={session.pos}
        data-item-id={item.id}
        data-item-type={item.type}
        data-retry={entry.retry || undefined}
      >
        {entry.retry && (
          <p className="mb-3 flex items-center gap-1.5 self-start rounded-lg bg-koral-muda px-2 py-1 font-display text-13 font-semibold">
            <RotateCcw size={14} strokeWidth={2.75} aria-hidden="true" />
            Soal yang tadi salah
          </p>
        )}
        {item.type === 'intro' ? (
          <IntroView key={entry.key} intro={item} onDone={() => goNext(readIntro(session))} />
        ) : (
          <ExerciseView key={entry.key} exercise={item} answered={verdict !== null} onVerdict={handleVerdict} />
        )}
      </main>

      <p className="sr-only" aria-live="assertive">
        {verdict && item.type !== 'intro' ? `${verdict.correct ? 'Benar' : 'Kurang tepat'}. ${item.explanation}` : ''}
      </p>

      {verdict && item.type !== 'intro' && (
        <FeedbackSheet
          key={entry.key}
          verdict={verdict}
          explanation={item.explanation}
          retryNext={!verdict.correct}
          onContinue={() => goNext(session)}
          onHeight={onSheetHeight}
        />
      )}

      {confirmExit && <ExitSheet onStay={() => setConfirmExit(false)} onLeave={leaveLesson} />}
    </div>
  )
}

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const ref = findLesson(lessonId)
  if (!ref || !hasContent(ref.lesson)) return <LessonUnavailable />
  return <LessonPlayer lessonRef={ref} />
}
