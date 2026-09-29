import type { ExerciseType, Lesson, PathId, Unit } from '../lib/types'

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

/**
 * Exercise types the lesson player can render right now. Stage 3 of the plan
 * adds sort, order, fill, place, fix, and shell; until then those exercises
 * stay in the data but are skipped during play.
 */
export const PLAYABLE_TYPES: ReadonlySet<ExerciseType> = new Set(['choice', 'truefalse', 'match'])

export function playableExercises(lesson: Lesson) {
  return lesson.exercises.filter((e) => PLAYABLE_TYPES.has(e.type))
}

export function hasContent(lesson: Lesson): boolean {
  return playableExercises(lesson).length > 0
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
