import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { COURSES, courseOf } from '../content/course'
import { dayKey } from '../lib/date'
import { missed, scheduleReview } from '../lib/review'
import { bumpStreak, liveStreak } from '../lib/streak'
import type { CourseId, CourseProgress, DailyGoal, ExamAttempt, PlacementResult, Progress } from '../lib/types'

export const MAX_HEARTS = 5
/** Finished exams kept in history (full simulations drive the readiness indicator). */
const EXAM_HISTORY_LIMIT = 100

export const initialProgress: Progress = {
  xp: 0,
  xpByDay: {},
  dailyGoal: 50,
  streak: { current: 0, best: 0, lastDay: '' },
  hearts: MAX_HEARTS,
  heartsDay: '',
  heartsEnabled: true,
  soundEnabled: true,
  lessonsDone: {},
  checkpoints: {},
  unitLevel: {},
  review: {},
  conceptStats: {},
  examHistory: [],
  activeExam: null,
  activeExamAt: undefined,
  reviewRemoved: {},
  settingsAt: undefined,
  heartsAt: undefined,
  resetAt: undefined,
  courses: {},
  ccna: null,
}

export const EMPTY_COURSE: CourseProgress = {
  lessonsDone: {},
  checkpoints: {},
  unitLevel: {},
  review: {},
  reviewRemoved: {},
  conceptStats: {},
  examHistory: [],
}

/**
 * One course's progress. AZ-900 keeps its fields at the top level (where they
 * were before AZ-104), AZ-104 lives in `courses.az104`, and CCNA in the top-level
 * key `ccna` (LANGIT_CCNA_PLAN.md section 3).
 */
export function courseProgress(s: Progress, course: CourseId): CourseProgress {
  if (course === 'az900') {
    const { lessonsDone, checkpoints, unitLevel, review, reviewRemoved, conceptStats, examHistory } = s
    return { lessonsDone, checkpoints, unitLevel, review, reviewRemoved, conceptStats, examHistory }
  }
  if (course === 'ccna') return { ...EMPTY_COURSE, ...s.ccna }
  return { ...EMPTY_COURSE, ...s.courses[course] }
}

/** The store update that writes `patch` into one course's progress and leaves the other courses alone. */
function withCourse(s: Progress, course: CourseId, patch: Partial<CourseProgress>): Partial<Progress> {
  if (course === 'az900') return patch
  if (course === 'ccna') return { ccna: { ...courseProgress(s, course), ...patch } }
  return { courses: { ...s.courses, [course]: { ...courseProgress(s, course), ...patch } } }
}

/** Finished exams of every course, for screens that open an attempt by id. */
export function allExamHistory(s: Progress): ExamAttempt[] {
  return [...s.examHistory, ...(s.courses.az104?.examHistory ?? []), ...(s.ccna?.examHistory ?? [])]
}

type Actions = {
  /** Hearts refill to full on a new day. Call on start and whenever the app comes back. */
  refreshDay: () => void
  /**
   * First attempt at an exercise in a lesson, checkpoint, or exam: updates the
   * concept stats, and a miss goes into the review queue.
   */
  recordAnswer: (exerciseId: string, concept: string, correct: boolean) => void
  /** Answer to an item from the review queue: stats plus the 1/3/7 day ladder. */
  recordReview: (exerciseId: string, concept: string, correct: boolean) => void
  loseHeart: () => void
  gainHeart: () => void
  /** Lesson finished. `unitLessonIds` lets the unit level (crown) be recomputed. */
  completeLesson: (lessonId: string, accuracy: number, xp: number, unitId: string, unitLessonIds: string[]) => void
  /** A practice (review) session finished; counts for XP and the streak. */
  completePractice: (xp: number) => void
  completeCheckpoint: (checkpointId: string, score: number, passed: boolean, xp: number) => void
  setDailyGoal: (goal: DailyGoal) => void
  setHeartsEnabled: (on: boolean) => void
  setSoundEnabled: (on: boolean) => void
  startExam: (attempt: ExamAttempt) => void
  /** An answer, flag, or move: stamps `activeExamAt`, which makes the running exam sync. */
  updateExam: (patch: Partial<ExamAttempt>) => void
  /** The countdown. It does not stamp `activeExamAt`, so a tick never starts a sync on its own. */
  tickExam: (elapsedSec: number) => void
  /** Moves a scored attempt into its course's history and clears the active exam. */
  finishExam: (attempt: ExamAttempt) => void
  abandonExam: () => void
  /** Stores the per-unit result of the AZ-104 placement test. */
  finishPlacement: (units: PlacementResult['units']) => void
  skipPlacement: () => void
  /** Marks every lesson of the chosen units done, without XP; an empty list just closes the offer. */
  applyPlacement: (unitIds: string[]) => void
  /**
   * A passed prerequisite skip test (LANGIT_CCNA_PLAN.md section 4.4): marks the
   * branch's lessons done without XP. Lessons already done keep their record.
   */
  applySkip: (lessonIds: string[], accuracy: number) => void
  resetProgress: () => void
}

export type ProgressStore = Progress & Actions

const now = () => new Date().toISOString()

function addXp(s: Progress, xp: number, today: string): Pick<Progress, 'xp' | 'xpByDay'> {
  return { xp: s.xp + xp, xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + xp } }
}

function bumpConcept(c: CourseProgress, concept: string, correct: boolean): CourseProgress['conceptStats'] {
  const prev = c.conceptStats[concept] ?? { right: 0, wrong: 0 }
  return {
    ...c.conceptStats,
    [concept]: correct ? { ...prev, right: prev.right + 1 } : { ...prev, wrong: prev.wrong + 1 },
  }
}

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      ...initialProgress,

      refreshDay: () =>
        set((s) => {
          const today = dayKey()
          // The refill carries no time, so a heart lost today on another device still wins in sync.
          return s.heartsDay === today ? s : { hearts: MAX_HEARTS, heartsDay: today, heartsAt: undefined }
        }),

      recordAnswer: (exerciseId, concept, correct) =>
        set((s) => {
          const course = courseOf(exerciseId)
          const c = courseProgress(s, course)
          if (correct) return withCourse(s, course, { conceptStats: bumpConcept(c, concept, correct) })
          const { [exerciseId]: _, ...reviewRemoved } = c.reviewRemoved
          return withCourse(s, course, {
            conceptStats: bumpConcept(c, concept, correct),
            review: { ...c.review, [exerciseId]: { ...missed(dayKey()), at: now() } },
            reviewRemoved,
          })
        }),

      recordReview: (exerciseId, concept, correct) =>
        set((s) => {
          const course = courseOf(exerciseId)
          const c = courseProgress(s, course)
          const next = scheduleReview(c.review[exerciseId], correct, dayKey())
          const review = { ...c.review }
          const reviewRemoved = { ...c.reviewRemoved }
          if (next) {
            review[exerciseId] = { ...next, at: now() }
            delete reviewRemoved[exerciseId]
          } else {
            delete review[exerciseId]
            reviewRemoved[exerciseId] = now()
          }
          return withCourse(s, course, { conceptStats: bumpConcept(c, concept, correct), review, reviewRemoved })
        }),

      loseHeart: () => set((s) => (s.heartsEnabled ? { hearts: Math.max(0, s.hearts - 1), heartsAt: now() } : s)),
      gainHeart: () => set((s) => (s.hearts < MAX_HEARTS ? { hearts: s.hearts + 1, heartsAt: now() } : s)),

      completeLesson: (lessonId, accuracy, xp, unitId, unitLessonIds) =>
        set((s) => {
          const today = dayKey()
          const course = courseOf(lessonId)
          const c = courseProgress(s, course)
          const prev = c.lessonsDone[lessonId]
          const lessonsDone = {
            ...c.lessonsDone,
            [lessonId]: {
              bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
              completedAt: new Date().toISOString(),
              count: (prev?.count ?? 0) + 1,
            },
          }
          // A unit's level is how many full rounds of all its lessons are done, up to 3.
          const rounds = Math.min(...unitLessonIds.map((id) => lessonsDone[id]?.count ?? 0))
          const level = Math.min(3, rounds) as 0 | 1 | 2 | 3
          return {
            ...addXp(s, xp, today),
            streak: bumpStreak(s.streak, today),
            ...withCourse(s, course, { lessonsDone, unitLevel: { ...c.unitLevel, [unitId]: level } }),
          }
        }),

      completePractice: (xp) =>
        set((s) => {
          const today = dayKey()
          return { ...addXp(s, xp, today), streak: bumpStreak(s.streak, today) }
        }),

      completeCheckpoint: (checkpointId, score, passed, xp) =>
        set((s) => {
          const today = dayKey()
          const course = courseOf(checkpointId)
          const c = courseProgress(s, course)
          const prev = c.checkpoints[checkpointId]
          return {
            ...addXp(s, xp, today),
            streak: bumpStreak(s.streak, today),
            ...withCourse(s, course, {
              checkpoints: {
                ...c.checkpoints,
                [checkpointId]: {
                  bestScore: Math.max(prev?.bestScore ?? 0, score),
                  passedAt: prev?.passedAt ?? (passed ? new Date().toISOString() : undefined),
                },
              },
            }),
          }
        }),

      setDailyGoal: (dailyGoal) => set({ dailyGoal, settingsAt: now() }),
      setHeartsEnabled: (heartsEnabled) => set({ heartsEnabled, settingsAt: now() }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled, settingsAt: now() }),

      // The running exam syncs (docs/AZ104_TAHAP1_RENCANA.md section 5). Submitting or
      // discarding writes null, not undefined: a key left out of a push stays on the server.
      startExam: (attempt) => set({ activeExam: attempt, activeExamAt: now() }),
      updateExam: (patch) => set((s) => (s.activeExam ? { activeExam: { ...s.activeExam, ...patch }, activeExamAt: now() } : s)),
      tickExam: (elapsedSec) => set((s) => (s.activeExam ? { activeExam: { ...s.activeExam, elapsedSec } } : s)),
      finishExam: (attempt) =>
        set((s) => {
          const course = attempt.course ?? 'az900'
          const examHistory = [...courseProgress(s, course).examHistory, attempt].slice(-EXAM_HISTORY_LIMIT)
          return { activeExam: null, activeExamAt: now(), ...withCourse(s, course, { examHistory }) }
        }),
      abandonExam: () => set({ activeExam: null, activeExamAt: now() }),

      finishPlacement: (units) => set((s) => withCourse(s, 'az104', { placement: { takenAt: now(), units } })),
      skipPlacement: () => set((s) => withCourse(s, 'az104', { placement: { takenAt: now(), skipped: true, units: {} } })),
      applyPlacement: (unitIds) =>
        set((s) => {
          const c = courseProgress(s, 'az104')
          if (!c.placement) return s
          const at = now()
          const lessonsDone = { ...c.lessonsDone }
          const unitLevel = { ...c.unitLevel }
          for (const unit of COURSES.az104.units.filter((u) => unitIds.includes(u.id))) {
            const score = c.placement.units[unit.id]
            const accuracy = score && score.total ? score.right / score.total : 1
            for (const lesson of unit.lessons) {
              const prev = lessonsDone[lesson.id]
              lessonsDone[lesson.id] = prev ?? { bestAccuracy: accuracy, completedAt: at, count: 1 }
            }
            unitLevel[unit.id] = Math.max(unitLevel[unit.id] ?? 0, 1) as 0 | 1 | 2 | 3
          }
          return withCourse(s, 'az104', { lessonsDone, unitLevel, placement: { ...c.placement, applied: unitIds, appliedAt: at } })
        }),

      applySkip: (lessonIds, accuracy) =>
        set((s) => {
          if (!lessonIds.length) return s
          const course = courseOf(lessonIds[0])
          const c = courseProgress(s, course)
          const at = now()
          const lessonsDone = { ...c.lessonsDone }
          for (const id of lessonIds) lessonsDone[id] ??= { bestAccuracy: accuracy, completedAt: at, count: 1 }
          return withCourse(s, course, { lessonsDone })
        }),

      resetProgress: () => set({ ...initialProgress, resetAt: now() }),
    }),
    {
      name: 'langit-progress',
      // v3 adds `courses` (AZ-104); the AZ-900 fields stay where they were.
      version: 3,
      storage: createJSONStorage(() => localStorage),
      // Persist only the Progress data, never the action functions.
      partialize: (s): Progress => {
        const data = {} as Record<keyof Progress, unknown>
        for (const key of Object.keys(initialProgress) as (keyof Progress)[]) data[key] = s[key]
        return data as Progress
      },
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<Progress>
        if (version < 2) {
          // v1 had no completion count; every finished lesson was finished once.
          const lessonsDone: Progress['lessonsDone'] = {}
          for (const [id, l] of Object.entries(old.lessonsDone ?? {})) lessonsDone[id] = { ...l, count: l.count ?? 1 }
          return { ...initialProgress, ...old, lessonsDone }
        }
        return { ...initialProgress, ...old }
      },
    },
  ),
)

/** One course's progress, re-rendering only when one of its fields changes. */
export function useCourseProgress(course: CourseId): CourseProgress {
  return useProgress(useShallow((s: Progress) => courseProgress(s, course)))
}

export function useXpToday(): number {
  return useProgress((s) => s.xpByDay[dayKey()] ?? 0)
}

export function useLiveStreak(): number {
  return useProgress((s) => liveStreak(s.streak, dayKey()))
}
