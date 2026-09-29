import type { LessonItem } from '../lib/types'

const isCard = (item: LessonItem) => item.type === 'learn' || item.type === 'intro'

// One run through a lesson, practice, or checkpoint (plan section 11.2): items
// play in order; with `retryWrong`, a wrong answer puts the exercise back at
// the end, and the run only finishes once every exercise was answered right.

export type QueueEntry = {
  item: LessonItem
  retry: boolean
  key: string
  /** "Ulangan": an old exercise mixed in at the end (section 11.2, stage 6). */
  refresher: boolean
  /** The exercise is in the review queue, so its answer moves the 1/3/7 day ladder. */
  fromReview: boolean
}

export type Session = {
  queue: QueueEntry[]
  pos: number
  retryWrong: boolean
  /** Exercise id -> right on the first attempt. Drives accuracy, XP, and scores. */
  firstTry: Record<string, boolean>
  /** Items finished: learn and intro cards read, exercises answered right (or answered at all without retries). */
  cleared: string[]
  totalItems: number
}

export type SessionItem = { item: LessonItem; refresher?: boolean; fromReview?: boolean }

export function startSession(items: (LessonItem | SessionItem)[], { retryWrong = true } = {}): Session {
  const entries = items.map((i) => ('item' in i ? i : { item: i }))
  return {
    queue: entries.map(({ item, refresher = false, fromReview = false }) => ({
      item,
      retry: false,
      key: item.id,
      refresher,
      fromReview,
    })),
    pos: 0,
    retryWrong,
    firstTry: {},
    cleared: [],
    totalItems: entries.length,
  }
}

export function currentEntry(s: Session): QueueEntry {
  return s.queue[s.pos]
}

export function isFirstAttempt(s: Session): boolean {
  return !(currentEntry(s).item.id in s.firstTry)
}

function clear(s: Session, id: string): string[] {
  return s.cleared.includes(id) ? s.cleared : [...s.cleared, id]
}

/** Records the answer to the current exercise; with retries on, a wrong one is queued again at the end. */
export function answerCurrent(s: Session, correct: boolean): Session {
  const entry = currentEntry(s)
  const { item } = entry
  const requeue = !correct && s.retryWrong
  return {
    ...s,
    firstTry: isFirstAttempt(s) ? { ...s.firstTry, [item.id]: correct } : s.firstTry,
    cleared: correct || !s.retryWrong ? clear(s, item.id) : s.cleared,
    queue: requeue ? [...s.queue, { ...entry, retry: true, key: `${item.id}#${s.queue.length}` }] : s.queue,
  }
}

/** Marks the current learn or intro card as read. */
export function readCard(s: Session): Session {
  return { ...s, cleared: clear(s, currentEntry(s).item.id) }
}

/** Moves to the next queue entry, or returns null when the run is finished. */
export function advance(s: Session): Session | null {
  return s.pos + 1 < s.queue.length ? { ...s, pos: s.pos + 1 } : null
}

export function progressOf(s: Session): number {
  return s.totalItems === 0 ? 0 : s.cleared.length / s.totalItems
}

/** First-attempt results in run order, one per exercise. */
export function firstTryResults(s: Session): boolean[] {
  return s.queue.filter((e) => !e.retry && !isCard(e.item)).map((e) => s.firstTry[e.item.id] ?? false)
}
