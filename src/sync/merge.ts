import type { CourseProgress, ExamAttempt, PlacementResult, Progress } from '../lib/types'

// Merging two devices' progress (plan stage 8). The rules only ever keep the
// larger count, the union, or the newest change, so merging is safe to repeat:
// merge(a, b) === merge(b, a), and merging the result again changes nothing.

/**
 * Everything that syncs: the whole progress, including the running exam, so an exam
 * started on the phone can go on on the laptop (docs/AZ104_TAHAP1_RENCANA.md section 5).
 */
export type SyncData = Progress

/** Finished exams kept after a merge, like the store's own limit. */
const EXAM_HISTORY_LIMIT = 100

export const SYNC_KEYS = [
  'xp',
  'xpByDay',
  'dailyGoal',
  'streak',
  'hearts',
  'heartsDay',
  'heartsEnabled',
  'soundEnabled',
  'lessonsDone',
  'checkpoints',
  'unitLevel',
  'review',
  'conceptStats',
  'examHistory',
  'reviewRemoved',
  'settingsAt',
  'heartsAt',
  'resetAt',
  'courses',
  'activeExam',
  'activeExamAt',
] as const satisfies readonly (keyof SyncData)[]

export function toSyncData(p: Progress): SyncData {
  const out = {} as Record<(typeof SYNC_KEYS)[number], unknown>
  for (const key of SYNC_KEYS) out[key] = p[key]
  // null, never undefined: JSON drops undefined, and the server keeps a key that a push leaves out.
  out.activeExam = p.activeExam ?? null
  return out as SyncData
}

/** JSON with sorted keys, so equal progress always gives the same text. */
export function stableJson(value: unknown): string {
  return JSON.stringify(value, (_, v: unknown) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : v,
  )
}

const t = (time: string | undefined) => time ?? ''

/** Per key, the result of `pick` on both sides (or the only side that has the key). */
function mergeRecords<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a }
  for (const [key, value] of Object.entries(b)) out[key] = key in out ? pick(out[key], value) : value
  return out
}

type ReviewEntry = Progress['review'][string]

/** The later of two versions of the same review entry. */
function newerEntry(x: ReviewEntry, y: ReviewEntry): ReviewEntry {
  if (t(x.at) !== t(y.at)) return t(x.at) > t(y.at) ? x : y
  if (x.dueDay !== y.dueDay) return x.dueDay > y.dueDay ? x : y
  return x.correctStreak >= y.correctStreak ? x : y
}

/** Review queue: for each exercise, the newest of "in the queue" and "left the queue" wins. */
function mergeReview(a: CourseProgress, b: CourseProgress): Pick<CourseProgress, 'review' | 'reviewRemoved'> {
  const entries = mergeRecords(a.review, b.review, newerEntry)
  const removed = mergeRecords(a.reviewRemoved ?? {}, b.reviewRemoved ?? {}, (x, y) => (x > y ? x : y))
  const review: CourseProgress['review'] = {}
  const reviewRemoved: CourseProgress['reviewRemoved'] = {}
  for (const id of new Set([...Object.keys(entries), ...Object.keys(removed)])) {
    const entry = entries[id]
    const gone = removed[id]
    if (entry && (!gone || t(entry.at) > gone)) review[id] = entry
    else reviewRemoved[id] = gone
  }
  return { review, reviewRemoved }
}

function mergeExams(a: ExamAttempt[], b: ExamAttempt[]): ExamAttempt[] {
  const byId = new Map<string, ExamAttempt>()
  for (const attempt of [...a, ...b]) if (!byId.has(attempt.id)) byId.set(attempt.id, attempt)
  const when = (x: ExamAttempt) => x.finishedAt ?? x.startedAt
  return [...byId.values()]
    .sort((x, y) => (when(x) < when(y) ? -1 : when(x) > when(y) ? 1 : x.id < y.id ? -1 : 1))
    .slice(-EXAM_HISTORY_LIMIT)
}

const EMPTY_COURSE: CourseProgress = { lessonsDone: {}, checkpoints: {}, unitLevel: {}, review: {}, reviewRemoved: {}, conceptStats: {}, examHistory: [] }

/** One course's progress: the same rules for AZ-900 (top level) and AZ-104 (`courses.az104`). */
function mergeCourse(a: CourseProgress, b: CourseProgress): CourseProgress {
  return {
    lessonsDone: mergeRecords(a.lessonsDone, b.lessonsDone, (x, y) => ({
      bestAccuracy: Math.max(x.bestAccuracy, y.bestAccuracy),
      completedAt: x.completedAt > y.completedAt ? x.completedAt : y.completedAt,
      count: Math.max(x.count, y.count),
    })),
    checkpoints: mergeRecords(a.checkpoints, b.checkpoints, (x, y) => {
      const passed = [x.passedAt, y.passedAt].filter((d): d is string => !!d).sort()[0]
      return passed ? { bestScore: Math.max(x.bestScore, y.bestScore), passedAt: passed } : { bestScore: Math.max(x.bestScore, y.bestScore) }
    }),
    unitLevel: mergeRecords(a.unitLevel, b.unitLevel, (x, y) => (x >= y ? x : y)),
    conceptStats: mergeRecords(a.conceptStats, b.conceptStats, (x, y) => ({
      right: Math.max(x.right, y.right),
      wrong: Math.max(x.wrong, y.wrong),
    })),
    examHistory: mergeExams(a.examHistory, b.examHistory),
    ...mergeReview(a, b),
  }
}

/**
 * The running exam: the newest change (`activeExamAt`) wins, so submitting or
 * discarding on one device ends it everywhere. With equal stamps only the timer
 * differs, and the same exam keeps the side where more time has run. An exam that
 * is already in either course's history is over and never comes back.
 */
function mergeActiveExam(a: SyncData, b: SyncData, finished: Set<string>): Pick<SyncData, 'activeExam' | 'activeExamAt'> {
  const x = a.activeExam ?? null
  const y = b.activeExam ?? null
  const side =
    t(a.activeExamAt) !== t(b.activeExamAt)
      ? t(a.activeExamAt) > t(b.activeExamAt)
        ? a
        : b
      : !x
        ? b
        : !y
          ? a
          : x.id !== y.id
            ? x.id > y.id
              ? a
              : b
            : x.elapsedSec >= y.elapsedSec
              ? a
              : b
  const exam = side.activeExam ?? null
  return { activeExam: exam && !finished.has(exam.id) ? exam : null, activeExamAt: side.activeExamAt }
}

/** The AZ-104 placement result: the latest change (applied, else taken) wins. */
function newerPlacement(a?: PlacementResult | null, b?: PlacementResult | null): PlacementResult | null {
  if (!a || !b) return a ?? b ?? null
  const when = (p: PlacementResult) => p.appliedAt ?? p.takenAt
  return when(a) !== when(b) ? (when(a) > when(b) ? a : b) : stableJson(a) >= stableJson(b) ? a : b
}

/** A course's progress in sync data, with empty fields where older data has none. */
function az104(d: SyncData): CourseProgress {
  return { ...EMPTY_COURSE, ...d.courses?.az104 }
}

/**
 * `joining`: the first merge when a device connects to a code. Both sides are
 * kept even if one was reset before, so connecting never wipes anything.
 */
export function mergeProgress(a: SyncData, b: SyncData, { joining = false } = {}): SyncData {
  // After a reset, only what happened since then counts: the side with the newer reset is kept whole.
  if (!joining && t(a.resetAt) !== t(b.resetAt)) return t(a.resetAt) > t(b.resetAt) ? a : b

  const xpByDay = mergeRecords(a.xpByDay, b.xpByDay, Math.max)
  const xpFromDays = Object.values(xpByDay).reduce((sum, x) => sum + x, 0)

  // Settings and hearts: the newest change wins. Ties are settled the same way on every device.
  const settings =
    t(a.settingsAt) !== t(b.settingsAt)
      ? t(a.settingsAt) > t(b.settingsAt)
        ? a
        : b
      : `${a.dailyGoal}${a.heartsEnabled}${a.soundEnabled}` >= `${b.dailyGoal}${b.heartsEnabled}${b.soundEnabled}`
        ? a
        : b
  const hearts =
    a.heartsDay !== b.heartsDay
      ? a.heartsDay > b.heartsDay
        ? a
        : b
      : t(a.heartsAt) !== t(b.heartsAt)
        ? t(a.heartsAt) > t(b.heartsAt)
          ? a
          : b
        : a.hearts <= b.hearts
          ? a
          : b
  const streak =
    a.streak.lastDay !== b.streak.lastDay
      ? a.streak.lastDay > b.streak.lastDay
        ? a.streak
        : b.streak
      : a.streak.current >= b.streak.current
        ? a.streak
        : b.streak

  const az900 = mergeCourse(a, b)
  const placement = newerPlacement(a.courses?.az104?.placement, b.courses?.az104?.placement)
  const courses =
    a.courses?.az104 || b.courses?.az104 ? { az104: { ...mergeCourse(az104(a), az104(b)), ...(placement ? { placement } : {}) } } : {}
  const finished = new Set([...az900.examHistory, ...(courses.az104?.examHistory ?? [])].map((e) => e.id))

  return {
    xp: Math.max(a.xp, b.xp, xpFromDays),
    xpByDay,
    dailyGoal: settings.dailyGoal,
    heartsEnabled: settings.heartsEnabled,
    soundEnabled: settings.soundEnabled,
    settingsAt: settings.settingsAt,
    hearts: hearts.hearts,
    heartsDay: hearts.heartsDay,
    heartsAt: hearts.heartsAt,
    streak: { ...streak, best: Math.max(a.streak.best, b.streak.best, streak.current) },
    ...az900,
    resetAt: t(a.resetAt) >= t(b.resetAt) ? a.resetAt : b.resetAt,
    courses,
    ...mergeActiveExam(a, b, finished),
  }
}

/** Remote data from before this version may miss newer fields; fill them so merging never breaks. */
export function readSyncData(value: unknown, defaults: SyncData): SyncData | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const out = { ...defaults, ...(value as Partial<SyncData>) }
  if (typeof out.xp !== 'number' || typeof out.lessonsDone !== 'object' || !Array.isArray(out.examHistory)) return null
  if (!out.courses || typeof out.courses !== 'object' || Array.isArray(out.courses)) out.courses = {}
  if (out.activeExam && (typeof out.activeExam !== 'object' || !Array.isArray(out.activeExam.questionIds))) out.activeExam = null
  return out
}
