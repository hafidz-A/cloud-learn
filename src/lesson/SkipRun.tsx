import { useState } from 'react'
import { findLesson } from '../content/course'
import { formatDuration } from '../lib/date'
import { leaveFlow } from '../lib/router'
import { prereqBranch } from '../lib/tree'
import type { Lesson } from '../lib/types'
import { useFollowCourse } from '../store/course'
import { useProgress } from '../store/progress'
import { Unavailable } from './LessonScreen'
import { Player } from './Player'
import { SKIP_PASS, skipPlan } from './plans'

function Run({ lessons }: { lessons: Lesson[] }) {
  useFollowCourse(lessons[0].id)
  const applySkip = useProgress((s) => s.applySkip)
  const [plan] = useState(() => skipPlan(lessons, `Tes lompat: ${lessons[0].title}`))

  return (
    <Player
      plan={plan}
      onFinish={(results, durationMs) => {
        const right = results.filter(Boolean).length
        const score = results.length ? right / results.length : 0
        const passed = score >= SKIP_PASS
        if (passed) applySkip(lessons.map((l) => l.id), score)
        return {
          heading: passed ? 'Prasyarat dilewati' : 'Belum bisa dilewati',
          subtitle: lessons.map((l) => l.title).join(', '),
          mood: passed ? 'gembira' : 'netral',
          celebrate: false,
          xp: 0,
          stats: [
            { kind: 'score', label: 'Benar', value: `${right}/${results.length}` },
            { kind: 'time', label: 'Waktu', value: formatDuration(durationMs) },
          ],
          note: passed
            ? 'Cabang prasyarat ini ditandai selesai, jadi lesson berikutnya di batang sudah terbuka. Hasil tes tidak masuk statistik.'
            : `Butuh minimal ${Math.round(SKIP_PASS * 100)}% benar. Kerjakan lesson prasyaratnya dulu; hasil tes ini tidak masuk statistik.`,
          primary: { label: 'Lanjut', onClick: () => leaveFlow() },
        }
      }}
    />
  )
}

/** The skip test of a prerequisite branch (LANGIT_CCNA_PLAN.md section 4.4). */
export function SkipRun({ lessonId }: { lessonId: string }) {
  const ref = findLesson(lessonId)
  const lessons = ref ? prereqBranch(ref.unit, lessonId) : undefined
  const playable = lessons?.filter((l) => l.items.some((i) => i.type !== 'learn' && i.type !== 'intro'))
  if (!lessons || !playable?.length) return <Unavailable title="Tes lompat tidak tersedia" body="Tes lompat hanya ada di lesson pertama sebuah cabang prasyarat." />
  return <Run lessons={lessons} />
}
