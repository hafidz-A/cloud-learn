import { useState } from 'react'
import { formatDuration } from '../lib/date'
import { leaveFlow } from '../lib/router'
import { XP_PER_LESSON } from '../lib/scoring'
import { useCourse } from '../store/course'
import { courseProgress, useProgress } from '../store/progress'
import { Unavailable } from './LessonScreen'
import { Player } from './Player'
import { practicePlan } from './plans'

/** A practice session: review queue first, then exercises from finished lessons. */
export function PracticeRun() {
  const completePractice = useProgress((s) => s.completePractice)
  const [plan] = useState(() => {
    const course = useCourse.getState().active
    return practicePlan(course, courseProgress(useProgress.getState(), course))
  })

  if (plan.items.length === 0) {
    return <Unavailable title="Belum ada yang bisa dilatih" body="Selesaikan satu lesson dulu, lalu soalnya bisa dilatih ulang di sini." />
  }

  return (
    <Player
      plan={plan}
      onFinish={(results, durationMs) => {
        const right = results.filter(Boolean).length
        completePractice(XP_PER_LESSON)
        return {
          heading: 'Latihan selesai!',
          subtitle: `${results.length} soal dilatih ulang`,
          mood: 'gembira',
          celebrate: true,
          xp: XP_PER_LESSON,
          stats: [
            { kind: 'xp', label: 'XP', value: `+${XP_PER_LESSON}` },
            { kind: 'accuracy', label: 'Akurasi', value: `${Math.round((right / Math.max(1, results.length)) * 100)}%` },
            { kind: 'time', label: 'Waktu', value: formatDuration(durationMs) },
          ],
          note: 'Setiap jawaban benar di percobaan pertama mengisi 1 heart.',
          primary: { label: 'Lanjut', onClick: () => leaveFlow('latihan') },
        }
      }}
    />
  )
}
