import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { dayKey } from '../lib/date'
import type { DailyGoal, Progress } from '../lib/types'

export const MAX_HEARTS = 5

export const initialProgress: Progress = {
  xp: 0,
  xpByDay: {},
  dailyGoal: 50,
  streak: { current: 0, best: 0, lastDay: '' },
  hearts: MAX_HEARTS,
  lessonsDone: {},
  unitLevel: {},
  review: {},
  conceptStats: {},
}

type Actions = {
  /** Records one answer for the per-concept mastery stats. */
  recordAnswer: (concept: string, correct: boolean) => void
  /** Adds the lesson's XP and remembers the best accuracy for that lesson. */
  completeLesson: (lessonId: string, accuracy: number, xp: number) => void
  setDailyGoal: (goal: DailyGoal) => void
  resetProgress: () => void
}

export type ProgressStore = Progress & Actions

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      ...initialProgress,

      recordAnswer: (concept, correct) =>
        set((s) => {
          const prev = s.conceptStats[concept] ?? { right: 0, wrong: 0 }
          return {
            conceptStats: {
              ...s.conceptStats,
              [concept]: correct
                ? { ...prev, right: prev.right + 1 }
                : { ...prev, wrong: prev.wrong + 1 },
            },
          }
        }),

      completeLesson: (lessonId, accuracy, xp) =>
        set((s) => {
          const today = dayKey()
          const prev = s.lessonsDone[lessonId]
          return {
            xp: s.xp + xp,
            xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + xp },
            lessonsDone: {
              ...s.lessonsDone,
              [lessonId]: {
                bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
                completedAt: new Date().toISOString(),
              },
            },
          }
        }),

      setDailyGoal: (dailyGoal) => set({ dailyGoal }),

      resetProgress: () => set({ ...initialProgress }),
    }),
    {
      name: 'langit-progress',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist only the Progress data, never the action functions.
      partialize: (s): Progress => {
        const data = {} as Record<keyof Progress, unknown>
        for (const key of Object.keys(initialProgress) as (keyof Progress)[]) data[key] = s[key]
        return data as Progress
      },
    },
  ),
)

export function useXpToday(): number {
  return useProgress((s) => s.xpByDay[dayKey()] ?? 0)
}
