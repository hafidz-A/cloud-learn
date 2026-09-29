import { Flame, Heart, Infinity as InfinityIcon, Settings, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { hrefFor } from '../lib/router'
import { useLiveStreak, useProgress, useXpToday } from '../store/progress'

function Stat({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-11 items-center gap-1.5 font-display text-17 font-bold" aria-label={label}>
      {icon}
      <span aria-hidden="true" className="flex items-center">
        {children}
      </span>
    </div>
  )
}

/** Header with streak, today's XP against the daily goal, hearts, and settings. */
export function TopBar() {
  const streak = useLiveStreak()
  const hearts = useProgress((s) => s.hearts)
  const heartsOn = useProgress((s) => s.heartsEnabled)
  const goal = useProgress((s) => s.dailyGoal)
  const xpToday = useXpToday()

  return (
    <header className="sticky top-0 z-20 border-b-2 border-kabut bg-langit pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between gap-2 py-1.5 pl-5 pr-2">
        <Stat label={`Streak ${streak} hari`} icon={<Flame size={24} className="fill-matahari text-matahari-dalam" strokeWidth={2.25} />}>
          {streak}
        </Stat>
        <Stat label={`XP hari ini ${xpToday} dari target ${goal}`} icon={<Zap size={24} className="fill-matahari text-matahari-dalam" strokeWidth={2.25} />}>
          {xpToday}
          <span className="text-tinta-lembut">/{goal}</span>
        </Stat>
        <Stat
          label={heartsOn ? `${hearts} hearts` : 'Hearts dimatikan'}
          icon={<Heart size={24} className="fill-koral text-koral-dalam" strokeWidth={2.25} />}
        >
          {heartsOn ? hearts : <InfinityIcon size={20} />}
        </Stat>
        <a
          href={hrefFor({ name: 'tab', tab: 'pengaturan' })}
          aria-label="Pengaturan"
          className="flex h-11 w-11 items-center justify-center rounded-full text-tinta-lembut"
        >
          <Settings size={24} aria-hidden="true" />
        </a>
      </div>
    </header>
  )
}
