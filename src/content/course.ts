import type { Exercise, Lesson, LessonItem, PathId, Unit } from '../lib/types'

// Every unit lives in its own JSON file under ./units. New files are picked up
// automatically and sorted by id (u01, u02, ...).
const unitModules = import.meta.glob<Unit>('./units/*.json', { eager: true, import: 'default' })

export const UNITS: Unit[] = Object.values(unitModules).sort((a, b) => a.id.localeCompare(b.id))

export const PATHS: { id: PathId; title: string }[] = [
  { id: 1, title: 'Cloud concepts' },
  { id: 2, title: 'Arsitektur dan layanan' },
  { id: 3, title: 'Manajemen dan governance' },
]

/** One checkpoint (boss lesson) closes every path. */
export type Checkpoint = { id: string; path: PathId; title: string; questionCount: number }

export const CHECKPOINTS: Checkpoint[] = PATHS.map((p) => ({
  id: `cp${p.id}`,
  path: p.id,
  title: `Checkpoint jalur ${p.id}`,
  questionCount: 20,
}))

export function isExercise(item: LessonItem): item is Exercise {
  return item.type !== 'intro'
}

/**
 * Item types the lesson player can show right now: intro cards plus the stage 2
 * exercise types (plan section 11.4). Stage 3 adds sort, order, fill, place,
 * fix, and shell; until then those exercises stay in the data but are skipped.
 */
export const PLAYABLE_TYPES: ReadonlySet<LessonItem['type']> = new Set(['intro', 'choice', 'truefalse', 'match'])

export function playableItems(lesson: Lesson): LessonItem[] {
  return lesson.items.filter((item) => PLAYABLE_TYPES.has(item.type))
}

/** A lesson is playable once it has at least one exercise the player supports. */
export function hasContent(lesson: Lesson): boolean {
  return playableItems(lesson).some(isExercise)
}

export type LessonRef = { unit: Unit; lesson: Lesson; unitIndex: number; lessonIndex: number }

export function findLesson(lessonId: string): LessonRef | undefined {
  for (const [unitIndex, unit] of UNITS.entries()) {
    const lessonIndex = unit.lessons.findIndex((l) => l.id === lessonId)
    if (lessonIndex >= 0) return { unit, lesson: unit.lessons[lessonIndex], unitIndex, lessonIndex }
  }
  return undefined
}

/** "Unit 4" style number taken from the unit id ("u04-core-architecture"). */
export function unitNumber(unit: Unit): number {
  return Number(unit.id.slice(1, 3))
}
