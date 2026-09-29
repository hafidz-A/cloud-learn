import { X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import { ProgressBar } from '../components/ProgressBar'
import { findLesson, playableExercises, type LessonRef } from '../content/course'
import { leaveLesson } from '../lib/router'
import { summarizeLesson, type LessonSummary } from '../lib/scoring'
import { useProgress } from '../store/progress'
import { ExerciseView } from './ExerciseView'
import { ExitSheet } from './ExitSheet'
import { FeedbackSheet } from './FeedbackSheet'
import { LessonComplete } from './LessonComplete'
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
  const exercises = useMemo(() => playableExercises(lesson), [lesson])
  const recordAnswer = useProgress((s) => s.recordAnswer)
  const completeLesson = useProgress((s) => s.completeLesson)

  const [startedAt] = useState(() => Date.now())
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [summary, setSummary] = useState<LessonSummary | null>(null)
  const [confirmExit, setConfirmExit] = useState(false)
  const [sheetHeight, setSheetHeight] = useState(0)
  const onSheetHeight = useCallback((px: number) => setSheetHeight(px), [])

  const exercise = exercises[index]

  const handleVerdict = (v: Verdict) => {
    if (verdict) return
    setVerdict(v)
    setResults((r) => [...r, v.correct])
    recordAnswer(exercise.concept, v.correct)
  }

  const handleContinue = () => {
    if (index + 1 < exercises.length) {
      setIndex(index + 1)
      setVerdict(null)
      window.scrollTo({ top: 0 })
      return
    }
    const s = summarizeLesson(lesson.id, results, Date.now() - startedAt)
    completeLesson(lesson.id, s.accuracy, s.xp)
    setSummary(s)
    window.scrollTo({ top: 0 })
  }

  const handleClose = () => (results.length === 0 ? leaveLesson() : setConfirmExit(true))

  if (summary) return <LessonComplete summary={summary} lessonTitle={lesson.title} />

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 flex items-center gap-3 bg-langit px-2 pb-2 pt-[calc(8px+env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Keluar dari lesson"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tinta-lembut"
        >
          <X size={28} strokeWidth={2.75} />
        </button>
        <ProgressBar value={results.length / exercises.length} label={`Progres lesson ${lesson.title}`} />
        <span className="w-11 shrink-0 text-center font-display text-15 font-semibold text-tinta-lembut">
          {Math.min(index + 1, exercises.length)}/{exercises.length}
        </span>
      </div>

      <main
        className="flex-1 px-4 pt-4"
        style={{ paddingBottom: Math.max(128, sheetHeight + 24) }}
        data-exercise-type={exercise.type}
        data-exercise-id={exercise.id}
      >
        <ExerciseView key={exercise.id} exercise={exercise} answered={verdict !== null} onVerdict={handleVerdict} />
      </main>

      <p className="sr-only" aria-live="assertive">
        {verdict ? `${verdict.correct ? 'Benar' : 'Kurang tepat'}. ${exercise.explanation}` : ''}
      </p>

      {verdict && (
        <FeedbackSheet
          key={exercise.id}
          verdict={verdict}
          explanation={exercise.explanation}
          onContinue={handleContinue}
          onHeight={onSheetHeight}
        />
      )}

      {confirmExit && <ExitSheet onStay={() => setConfirmExit(false)} onLeave={leaveLesson} />}
    </div>
  )
}

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const ref = findLesson(lessonId)
  if (!ref || playableExercises(ref.lesson).length === 0) return <LessonUnavailable />
  return <LessonPlayer lessonRef={ref} />
}
