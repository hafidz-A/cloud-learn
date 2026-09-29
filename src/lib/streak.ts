import { addDays } from './date'
import type { Progress } from './types'

type Streak = Progress['streak']

/** Called when a lesson (or practice session) is finished on `today`. */
export function bumpStreak(streak: Streak, today: string): Streak {
  if (streak.lastDay === today) return streak
  const current = streak.lastDay === addDays(today, -1) ? streak.current + 1 : 1
  return { current, best: Math.max(streak.best, current), lastDay: today }
}

/** The streak as it stands today: it is broken once a whole day was skipped. */
export function liveStreak(streak: Streak, today: string): number {
  return streak.lastDay === today || streak.lastDay === addDays(today, -1) ? streak.current : 0
}
