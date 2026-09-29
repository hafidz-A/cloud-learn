import { Flame, Heart, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { useProgress, useXpToday } from '../store/progress'

function Stat({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-11 items-center gap-1.5 font-display text-17 font-bold" aria-label={label}>
      {icon}
      <span aria-hidden="true">{children}</span>
    </div>
  )
}

/** Header with streak, today's XP against the daily goal, and hearts. */
export function TopBar() {
  const streak = useProgress((s) => s.streak.current)
  const hearts = useProgress((s) => s.hearts)
  const goal = useProgress((s) => s.dailyGoal)
  const xpToday = useXpToday()

  return (
    <header className="sticky top-0 z-20 border-b-2 border-kabut bg-langit pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between px-5 py-1.5">
        <Stat label={`Streak ${streak} hari`} icon={<Flame size={24} className="fill-matahari text-matahari-dalam" strokeWidth={2.25} />}>
          {streak}
        </Stat>
        <Stat label={`XP hari ini ${xpToday} dari target ${goal}`} icon={<Zap size={24} className="fill-matahari text-matahari-dalam" strokeWidth={2.25} />}>
          {xpToday}
          <span className="text-tinta-lembut">/{goal}</span>
        </Stat>
        <Stat label={`${hearts} hearts`} icon={<Heart size={24} className="fill-koral text-koral-dalam" strokeWidth={2.25} />}>
          {hearts}
        </Stat>
      </div>
    </header>
  )
}
