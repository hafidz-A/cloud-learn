import { addDays } from './date'
import type { Progress } from './types'

// Mistake review from plan section 4: a missed exercise comes back after 1 day,
// then 3 days, then 7 days. Three right answers in a row take it off the queue.

export type ReviewEntry = Progress['review'][string]

const INTERVALS = [1, 3, 7]
export const REVIEW_STREAK_TO_CLEAR = 3

/** A miss (anywhere) puts the exercise at the start of the ladder, due tomorrow. */
export function missed(today: string): ReviewEntry {
  return { dueDay: addDays(today, INTERVALS[0]), correctStreak: 0 }
}

/** Result of answering a review item. Returns null when it leaves the queue. */
export function scheduleReview(entry: ReviewEntry | undefined, correct: boolean, today: string): ReviewEntry | null {
  if (!correct) return missed(today)
  const correctStreak = (entry?.correctStreak ?? 0) + 1
  if (correctStreak >= REVIEW_STREAK_TO_CLEAR) return null
  return { dueDay: addDays(today, INTERVALS[correctStreak]), correctStreak }
}

export function dueIds(review: Progress['review'], today: string): string[] {
  return Object.entries(review)
    .filter(([, e]) => e.dueDay <= today)
    .sort(([, a], [, b]) => a.dueDay.localeCompare(b.dueDay))
    .map(([id]) => id)
}
