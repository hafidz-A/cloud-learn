import type { CourseId, Exercise, Fact, LearnCard, Lesson, LessonItem, PathId, TeachingCard, Unit } from '../lib/types'

// Every unit lives in its own JSON file: AZ-900 under ./units, AZ-104 under
// ./az104/units. New files are picked up automatically and sorted by id.
const byId = (modules: Record<string, Unit>) => Object.values(modules).sort((a, b) => a.id.localeCompare(b.id))

/** AZ-900 units. */
export const UNITS: Unit[] = byId(import.meta.glob<Unit>('./units/*.json', { eager: true, import: 'default' }))

/** AZ-104 units (LANGIT_AZ104_PLAN.md section 5). Every id starts with "az104-". */
export const AZ104_UNITS: Unit[] = byId(import.meta.glob<Unit>('./az104/units/*.json', { eager: true, import: 'default' }))

/** The units of both courses. Their ids never collide, because every AZ-104 id starts with "az104-". */
export const ALL_UNITS: Unit[] = [...UNITS, ...AZ104_UNITS]

export type PathInfo = { id: PathId; title: string; short: string; domain: string; weight: [number, number] }

/** The three AZ-900 learning paths, which are also the exam domains (plan section 12.3). */
export const PATHS: PathInfo[] = [
  { id: 1, title: 'Cloud concepts', short: 'Cloud', domain: 'Describe cloud concepts', weight: [25, 30] },
  { id: 2, title: 'Arsitektur dan layanan', short: 'Arsitektur', domain: 'Describe Azure architecture and services', weight: [35, 40] },
  { id: 3, title: 'Manajemen dan governance', short: 'Manajemen', domain: 'Describe Azure management and governance', weight: [30, 35] },
]

/** The five AZ-104 paths in learning order (LANGIT_AZ104_PLAN.md section 3), each tied to one exam domain. */
export const AZ104_PATHS: PathInfo[] = [
  { id: 1, title: 'Identitas dan governance', short: 'Identitas', domain: 'Manage Azure identities and governance', weight: [20, 25] },
  { id: 2, title: 'Jaringan', short: 'Jaringan', domain: 'Implement and manage virtual networking', weight: [15, 20] },
  { id: 3, title: 'Storage', short: 'Storage', domain: 'Implement and manage storage', weight: [15, 20] },
  { id: 4, title: 'Compute', short: 'Compute', domain: 'Deploy and manage Azure compute resources', weight: [20, 25] },
  { id: 5, title: 'Monitoring dan pemeliharaan', short: 'Monitoring', domain: 'Monitor and maintain Azure resources', weight: [10, 15] },
]

/** One checkpoint (boss lesson) closes every path. */
export type Checkpoint = { id: string; path: PathId; title: string; questionCount: number }

const checkpointsFor = (paths: PathInfo[], prefix: string): Checkpoint[] =>
  paths.map((p) => ({ id: `${prefix}cp${p.id}`, path: p.id, title: `Checkpoint jalur ${p.id}`, questionCount: 20 }))

export const CHECKPOINTS: Checkpoint[] = checkpointsFor(PATHS, '')
export const AZ104_CHECKPOINTS: Checkpoint[] = checkpointsFor(AZ104_PATHS, 'az104-')

export type Course = {
  id: CourseId
  /** Exam code shown in the course picker. */
  name: string
  title: string
  units: Unit[]
  paths: PathInfo[]
  checkpoints: Checkpoint[]
}

export const COURSES: Record<CourseId, Course> = {
  az900: { id: 'az900', name: 'AZ-900', title: 'Azure Fundamentals', units: UNITS, paths: PATHS, checkpoints: CHECKPOINTS },
  az104: { id: 'az104', name: 'AZ-104', title: 'Azure Administrator', units: AZ104_UNITS, paths: AZ104_PATHS, checkpoints: AZ104_CHECKPOINTS },
}

export const COURSE_IDS: CourseId[] = ['az900', 'az104']

/** The course an id (unit, lesson, exercise, checkpoint, or fact) belongs to. */
export function courseOf(id: string): CourseId {
  return id.startsWith('az104-') ? 'az104' : 'az900'
}

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
  for (const [unitIndex, unit] of COURSES[courseOf(lessonId)].units.entries()) {
    const lessonIndex = unit.lessons.findIndex((l) => l.id === lessonId)
    if (lessonIndex >= 0) return { unit, lesson: unit.lessons[lessonIndex], unitIndex, lessonIndex }
  }
  return undefined
}

export function findUnit(unitId: string): Unit | undefined {
  return ALL_UNITS.find((u) => u.id === unitId)
}

/** "Unit 4" style number taken from the unit id ("u04-core-architecture", "az104-u04-virtual-networks"). */
export function unitNumber(unit: Unit): number {
  return Number(/u(\d{2})/.exec(unit.id)?.[1] ?? 0)
}

export type ExerciseRef = { exercise: Exercise; unit: Unit; lesson: Lesson; path: PathId }

/** Every exercise of both courses by id, retired ones included, with where it lives. */
export const EXERCISES: ReadonlyMap<string, ExerciseRef> = new Map(
  ALL_UNITS.flatMap((unit) =>
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

/** Every fact of both courses by id, with the unit that lists it. */
export const FACTS: ReadonlyMap<string, { fact: Fact; unit: Unit }> = new Map(
  ALL_UNITS.flatMap((unit) => (unit.facts ?? []).map((fact) => [fact.id, { fact, unit }] as const)),
)

type PlacedCard = { card: TeachingCard; unit: Unit; lesson: Lesson; order: number }

/** Every learn and intro card in course order (AZ-900 first, then unit, lesson, and item order). */
export const TEACHING_CARDS: PlacedCard[] = (() => {
  const out: PlacedCard[] = []
  for (const unit of ALL_UNITS)
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

/** A course's lessons in order, with their unit. */
export function lessonsInOrder(course: CourseId): { unit: Unit; lesson: Lesson }[] {
  return COURSES[course].units.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })))
}

/** Active exercises of one path of a course, for its checkpoint. */
export function exercisesInPath(course: CourseId, path: PathId): Exercise[] {
  return [...EXERCISES.values()]
    .filter((r) => courseOf(r.unit.id) === course && r.path === path && isActive(r.exercise))
    .map((r) => r.exercise)
}

export function findCheckpoint(id: string): Checkpoint | undefined {
  return COURSES[courseOf(id)].checkpoints.find((c) => c.id === id)
}

/**
 * Per course, concept tag -> the title of the first card that is only about
 * that concept. Per course, because both courses may use the same tag (rbac).
 */
const CONCEPT_TITLES: Record<CourseId, ReadonlyMap<string, string>> = (() => {
  const maps: Record<CourseId, Map<string, string>> = { az900: new Map(), az104: new Map() }
  for (const { card, unit } of TEACHING_CARDS) {
    const concepts = cardConcepts(card)
    const map = maps[courseOf(unit.id)]
    if (concepts.length === 1 && !map.has(concepts[0])) map.set(concepts[0], card.title)
  }
  return maps
})()

/** Readable name for a concept tag: the title of the course's card about it, or the tag in words. */
export function conceptName(concept: string, course: CourseId = 'az900'): string {
  const title = CONCEPT_TITLES[course].get(concept)
  if (title) return title
  const words = concept.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Per course, the unit where a concept is first tested. */
export const UNIT_BY_CONCEPT: Record<CourseId, ReadonlyMap<string, Unit>> = (() => {
  const maps: Record<CourseId, Map<string, Unit>> = { az900: new Map(), az104: new Map() }
  for (const r of EXERCISES.values()) {
    const map = maps[courseOf(r.unit.id)]
    if (!map.has(r.exercise.concept)) map.set(r.exercise.concept, r.unit)
  }
  return maps
})()
