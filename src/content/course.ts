import type { Exercise, IntroCard, Lesson, LessonItem, PathId, Unit } from '../lib/types'

// Every unit lives in its own JSON file under ./units. New files are picked up
// automatically and sorted by id (u01, u02, ...).
const unitModules = import.meta.glob<Unit>('./units/*.json', { eager: true, import: 'default' })

export const UNITS: Unit[] = Object.values(unitModules).sort((a, b) => a.id.localeCompare(b.id))

/** The three learning paths, which are also the exam domains (plan section 12.3). */
export const PATHS: { id: PathId; title: string; short: string; domain: string; weight: [number, number] }[] = [
  { id: 1, title: 'Cloud concepts', short: 'Cloud', domain: 'Describe cloud concepts', weight: [25, 30] },
  { id: 2, title: 'Arsitektur dan layanan', short: 'Arsitektur', domain: 'Describe Azure architecture and services', weight: [35, 40] },
  { id: 3, title: 'Manajemen dan governance', short: 'Manajemen', domain: 'Describe Azure management and governance', weight: [30, 35] },
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

export function playableItems(lesson: Lesson): LessonItem[] {
  return lesson.items
}

/** A lesson is playable once it has at least one exercise. */
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

export type ExerciseRef = { exercise: Exercise; unit: Unit; lesson: Lesson; path: PathId }

/** Every exercise in the course by id, with where it lives. */
export const EXERCISES: ReadonlyMap<string, ExerciseRef> = new Map(
  UNITS.flatMap((unit) =>
    unit.lessons.flatMap((lesson) =>
      lesson.items.filter(isExercise).map((exercise) => [exercise.id, { exercise, unit, lesson, path: unit.path }] as const),
    ),
  ),
)

/** The first intro card for each concept, for the "Lihat konsep" button in practice. */
export const INTROS_BY_CONCEPT: ReadonlyMap<string, IntroCard> = (() => {
  const map = new Map<string, IntroCard>()
  for (const unit of UNITS)
    for (const lesson of unit.lessons)
      for (const item of lesson.items) if (item.type === 'intro' && !map.has(item.concept)) map.set(item.concept, item)
  return map
})()

/** All lessons in course order, with their unit. */
export const LESSONS_IN_ORDER: { unit: Unit; lesson: Lesson }[] = UNITS.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ unit, lesson })),
)

export function exercisesInPath(path: PathId): Exercise[] {
  return [...EXERCISES.values()].filter((r) => r.path === path).map((r) => r.exercise)
}

export function findCheckpoint(id: string): Checkpoint | undefined {
  return CHECKPOINTS.find((c) => c.id === id)
}

/** Readable name for a concept tag: its intro card title, or the tag in words. */
export function conceptName(concept: string): string {
  const intro = INTROS_BY_CONCEPT.get(concept)
  if (intro) return intro.title
  const words = concept.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** The unit where a concept is first tested. */
export const UNIT_BY_CONCEPT: ReadonlyMap<string, Unit> = (() => {
  const map = new Map<string, Unit>()
  for (const r of EXERCISES.values()) if (!map.has(r.exercise.concept)) map.set(r.exercise.concept, r.unit)
  return map
})()
