import type { LessonItem } from '../lib/types'

// One run through a lesson (plan section 11.2): items play in order, a wrong
// answer puts the exercise back at the end of the queue, and the lesson only
// finishes once every exercise has been answered right at least once.

export type QueueEntry = { item: LessonItem; retry: boolean; key: string }

export type Session = {
  queue: QueueEntry[]
  pos: number
  /** Exercise id -> right on the first attempt. Drives accuracy and XP. */
  firstTry: Record<string, boolean>
  /** Items finished: intro cards read, exercises answered right. */
  cleared: string[]
  totalItems: number
}

export function startSession(items: LessonItem[]): Session {
  return {
    queue: items.map((item) => ({ item, retry: false, key: item.id })),
    pos: 0,
    firstTry: {},
    cleared: [],
    totalItems: items.length,
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

/** Records the answer to the current exercise; a wrong one is queued again at the end. */
export function answerCurrent(s: Session, correct: boolean): Session {
  const { item } = currentEntry(s)
  return {
    ...s,
    firstTry: isFirstAttempt(s) ? { ...s.firstTry, [item.id]: correct } : s.firstTry,
    cleared: correct ? clear(s, item.id) : s.cleared,
    queue: correct ? s.queue : [...s.queue, { item, retry: true, key: `${item.id}#${s.queue.length}` }],
  }
}

/** Marks the current intro card as read. */
export function readIntro(s: Session): Session {
  return { ...s, cleared: clear(s, currentEntry(s).item.id) }
}

/** Moves to the next queue entry, or returns null when the lesson is finished. */
export function advance(s: Session): Session | null {
  return s.pos + 1 < s.queue.length ? { ...s, pos: s.pos + 1 } : null
}

export function progressOf(s: Session): number {
  return s.totalItems === 0 ? 0 : s.cleared.length / s.totalItems
}

/** First-attempt results in lesson order, one per exercise. */
export function firstTryResults(s: Session): boolean[] {
  return s.queue.filter((e) => !e.retry && e.item.type !== 'intro').map((e) => s.firstTry[e.item.id] ?? false)
}
