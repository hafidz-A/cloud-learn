import { useState } from 'react'
import { Button } from '../components/Button'
import { Mascot } from '../components/Mascot'
import { courseOf, findLesson, hasContent, type LessonRef } from '../content/course'
import { tipFor } from '../content/practice'
import { formatDuration } from '../lib/date'
import { leaveFlow } from '../lib/router'
import { summarizeLesson, XP_FLAWLESS_BONUS } from '../lib/scoring'
import { useFollowCourse } from '../store/course'
import { courseProgress, useProgress } from '../store/progress'
import { Player } from './Player'
import { lessonPlan } from './plans'

export function Unavailable({ title, body }: { title: string; body: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Mascot mood="sedih" size={120} />
      <h1 className="mt-4 font-display text-20 font-bold">{title}</h1>
      <p className="mt-1 text-15 text-tinta-lembut">{body}</p>
      <Button className="mt-6" onClick={() => leaveFlow()}>
        Kembali ke home
      </Button>
    </main>
  )
}

function LessonRun({ lessonRef }: { lessonRef: LessonRef }) {
  const { lesson, unit } = lessonRef
  useFollowCourse(lesson.id)
  const completeLesson = useProgress((s) => s.completeLesson)
  const [plan] = useState(() => lessonPlan(lessonRef, courseProgress(useProgress.getState(), courseOf(lesson.id))))

  return (
    <Player
      plan={plan}
      onFinish={(results, durationMs) => {
        const s = summarizeLesson(lesson.id, results, durationMs)
        completeLesson(lesson.id, s.accuracy, s.xp, unit.id, unit.lessons.map((l) => l.id))
        const flawless = s.correct === s.total
        return {
          heading: 'Lesson selesai!',
          subtitle: lesson.title,
          mood: 'gembira',
          celebrate: true,
          xp: s.xp,
          stats: [
            { kind: 'xp', label: 'XP', value: `+${s.xp}` },
            { kind: 'accuracy', label: 'Akurasi', value: `${Math.round(s.accuracy * 100)}%` },
            { kind: 'time', label: 'Waktu', value: formatDuration(durationMs) },
          ],
          note: flawless
            ? `Tanpa kesalahan! Termasuk bonus +${XP_FLAWLESS_BONUS} XP.`
            : `${s.correct} dari ${s.total} soal benar di percobaan pertama.`,
          primary: { label: 'Lanjut', onClick: () => leaveFlow() },
          tip: tipFor(lesson.id),
        }
      }}
    />
  )
}

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const ref = findLesson(lessonId)
  if (!ref || !hasContent(ref.lesson)) {
    return <Unavailable title="Lesson ini belum tersedia" body="Soalnya masih disiapkan. Coba lesson lain dulu, ya." />
  }
  return <LessonRun lessonRef={ref} />
}
