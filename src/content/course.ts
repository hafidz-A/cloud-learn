import type { Exercise, Fact, LearnCard, Lesson, LessonItem, PathId, TeachingCard, Unit } from '../lib/types'

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

export function isTeachingCard(item: LessonItem): item is TeachingCard {
  return item.type === 'learn' || item.type === 'intro'
}

export function isExercise(item: LessonItem): item is Exercise {
  return !isTeachingCard(item)
}

/** A retired exercise stays in the data (saved progress may point at it) but is never played again. */
export function isActive(exercise: Exercise): boolean {
  return !exercise.retired
}

/** The concept tags a teaching card is about. */
export function cardConcepts(card: TeachingCard): string[] {
  return card.type === 'learn' ? card.concepts : [card.concept]
}

/** What a lesson plays: its cards and its exercises that are not retired. */
export function playableItems(lesson: Lesson): LessonItem[] {
  return lesson.items.filter((item) => !isExercise(item) || isActive(item))
}

/** A lesson is playable once it has at least one active exercise. */
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

export function findUnit(unitId: string): Unit | undefined {
  return UNITS.find((u) => u.id === unitId)
}

/** "Unit 4" style number taken from the unit id ("u04-core-architecture"). */
export function unitNumber(unit: Unit): number {
  return Number(unit.id.slice(1, 3))
}

export type ExerciseRef = { exercise: Exercise; unit: Unit; lesson: Lesson; path: PathId }

/** Every exercise in the course by id, retired ones included, with where it lives. */
export const EXERCISES: ReadonlyMap<string, ExerciseRef> = new Map(
  UNITS.flatMap((unit) =>
    unit.lessons.flatMap((lesson) =>
      lesson.items.filter(isExercise).map((exercise) => [exercise.id, { exercise, unit, lesson, path: unit.path }] as const),
    ),
  ),
)

/** The exercise with this id, unless it is unknown or retired. */
export function activeExercise(id: string): ExerciseRef | undefined {
  const ref = EXERCISES.get(id)
  return ref && isActive(ref.exercise) ? ref : undefined
}

/** Every fact in the course by id, with the unit that lists it. */
export const FACTS: ReadonlyMap<string, { fact: Fact; unit: Unit }> = new Map(
  UNITS.flatMap((unit) => (unit.facts ?? []).map((fact) => [fact.id, { fact, unit }] as const)),
)

type PlacedCard = { card: TeachingCard; unit: Unit; lesson: Lesson; order: number }

/** Every learn and intro card in course order (unit, lesson, then item order). */
export const TEACHING_CARDS: PlacedCard[] = (() => {
  const out: PlacedCard[] = []
  for (const unit of UNITS)
    for (const lesson of unit.lessons)
      for (const item of lesson.items) if (isTeachingCard(item)) out.push({ card: item, unit, lesson, order: out.length })
  return out
})()

const PLACE_OF_CARD = new Map(TEACHING_CARDS.map((p) => [p.card.id, p]))

/** Fact id -> the learn cards that teach it, earliest first. */
export const TEACHERS: ReadonlyMap<string, LearnCard[]> = (() => {
  const map = new Map<string, LearnCard[]>()
  for (const { card } of TEACHING_CARDS) {
    if (card.type !== 'learn') continue
    for (const fact of card.teaches) map.set(fact, [...(map.get(fact) ?? []), card])
  }
  return map
})()

/**
 * The cards to reread for an exercise ("Lihat materi", "Pelajari lagi"): the
 * first learn card for each fact it requires, closest ones first (same lesson,
 * then same unit, then the rest in course order). Exercises without requires
 * fall back to the cards about their concept.
 */
export function materialFor(exercise: Exercise): TeachingCard[] {
  const ref = EXERCISES.get(exercise.id)
  const cards = new Set<TeachingCard>()
  for (const fact of exercise.requires ?? []) {
    const first = TEACHERS.get(fact)?.[0]
    if (first) cards.add(first)
  }
  if (cards.size === 0) {
    for (const { card } of TEACHING_CARDS) if (cardConcepts(card).includes(exercise.concept)) cards.add(card)
  }
  const rank = (card: TeachingCard) => {
    const place = PLACE_OF_CARD.get(card.id)!
    const distance = place.lesson === ref?.lesson ? 0 : place.unit === ref?.unit ? 1 : 2
    return distance * 100000 + place.order
  }
  return [...cards].sort((a, b) => rank(a) - rank(b))
}

/** The learn and intro cards of a unit, per lesson, for the unit guide. */
export function cardsByLesson(unit: Unit): { lesson: Lesson; cards: TeachingCard[] }[] {
  return unit.lessons.map((lesson) => ({ lesson, cards: lesson.items.filter(isTeachingCard) }))
}

/** All lessons in course order, with their unit. */
export const LESSONS_IN_ORDER: { unit: Unit; lesson: Lesson }[] = UNITS.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ unit, lesson })),
)

/** Active exercises of a path, for its checkpoint. */
export function exercisesInPath(path: PathId): Exercise[] {
  return [...EXERCISES.values()].filter((r) => r.path === path && isActive(r.exercise)).map((r) => r.exercise)
}

export function findCheckpoint(id: string): Checkpoint | undefined {
  return CHECKPOINTS.find((c) => c.id === id)
}

/** Concept tag -> the title of the first card that is only about that concept. */
const CONCEPT_TITLES: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>()
  for (const { card } of TEACHING_CARDS) {
    const concepts = cardConcepts(card)
    if (concepts.length === 1 && !map.has(concepts[0])) map.set(concepts[0], card.title)
  }
  return map
})()

/** Readable name for a concept tag: the title of the card about it, or the tag in words. */
export function conceptName(concept: string): string {
  const title = CONCEPT_TITLES.get(concept)
  if (title) return title
  const words = concept.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** The unit where a concept is first tested. */
export const UNIT_BY_CONCEPT: ReadonlyMap<string, Unit> = (() => {
  const map = new Map<string, Unit>()
  for (const r of EXERCISES.values()) if (!map.has(r.exercise.concept)) map.set(r.exercise.concept, r.unit)
  return map
})()
