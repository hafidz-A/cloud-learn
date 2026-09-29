import { ChevronRight, Dumbbell, Flame, Zap } from 'lucide-react'
import { CoursePicker } from '../components/CoursePicker'
import { GoalRing } from '../components/GoalRing'
import { COURSES } from '../content/course'
import { dayKey } from '../lib/date'
import { dueIds } from '../lib/review'
import { hrefFor } from '../lib/router'
import { useActiveCourse } from '../store/course'
import { useCourseProgress, useLiveStreak, useProgress, useXpToday } from '../store/progress'
import { PathMap } from './PathMap'

function DailyCard() {
  const goal = useProgress((s) => s.dailyGoal)
  const xpToday = useXpToday()
  const streak = useLiveStreak()
  const due = dueIds(useCourseProgress(useActiveCourse()).review, dayKey()).length
  const left = Math.max(0, goal - xpToday)

  return (
    <section aria-label="Target harian" className="mx-4 mt-4 rounded-2xl border-2 border-kabut bg-white p-4 shadow-[0_4px_0_var(--color-kabut)]">
      <div className="flex items-center gap-4">
        <div className="relative">
          <GoalRing value={xpToday / goal} />
          <Zap size={22} className="absolute inset-0 m-auto fill-matahari text-matahari-dalam" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-17 font-bold">
            Target harian {xpToday}/{goal} XP
          </p>
          <p className="text-15 text-tinta-lembut">{left === 0 ? 'Target hari ini tercapai!' : `Tinggal ${left} XP lagi hari ini.`}</p>
          <p className="mt-1 flex items-center gap-1 text-13 text-tinta-lembut">
            <Flame size={14} className="fill-matahari text-matahari-dalam" aria-hidden="true" />
            {streak > 0 ? `Streak ${streak} hari` : 'Selesaikan satu lesson untuk memulai streak'}
          </p>
        </div>
      </div>
      {due > 0 && (
        <a
          href={hrefFor({ name: 'tab', tab: 'latihan' })}
          className="mt-3 flex min-h-11 items-center gap-2 rounded-xl bg-koral-muda px-3 font-display text-15 font-semibold"
        >
          <Dumbbell size={18} aria-hidden="true" />
          {due} soal menunggu di Latihan
          <ChevronRight size={18} className="ml-auto" aria-hidden="true" />
        </a>
      )}
    </section>
  )
}

export function HomeScreen() {
  const course = useActiveCourse()
  return (
    <main>
      <h1 className="sr-only">Langit: jalur belajar {COURSES[course].name}</h1>
      <CoursePicker />
      <DailyCard />
      <PathMap key={course} course={course} />
    </main>
  )
}
