import { COURSES, EXERCISES, activeExercise, caseStudyOf, courseOf, exercisesInPath, isActive, isExercise, lessonsInOrder, playableItems, type Checkpoint, type LessonRef } from '../content/course'
import { dayKey } from '../lib/date'
import { dueIds } from '../lib/review'
import { shuffle } from '../lib/shuffle'
import type { CourseId, CourseProgress } from '../lib/types'
import type { RunPlan } from './Player'
import type { SessionItem } from './session'

const REFRESHERS_PER_LESSON = 2
export const PRACTICE_SIZE = 10
const PRACTICE_MIN = 6

/**
 * Lesson items plus "Ulangan" (section 11.2, stage 6): up to 2 due review
 * items from other lessons, or else 1 exercise from the previous finished lesson.
 */
export function lessonPlan(ref: LessonRef, progress: Pick<CourseProgress, 'review' | 'lessonsDone'>, random = Math.random): RunPlan {
  const { lesson } = ref
  const items: SessionItem[] = playableItems(lesson).map((item) => ({ item }))
  const own = new Set(lesson.items.map((i) => i.id))

  const due = dueIds(progress.review, dayKey()).filter((id) => !own.has(id) && activeExercise(id))
  if (due.length) {
    for (const id of due.slice(0, REFRESHERS_PER_LESSON)) {
      items.push({ item: EXERCISES.get(id)!.exercise, refresher: true, fromReview: true })
    }
  } else {
    const order = lessonsInOrder(courseOf(lesson.id))
    const at = order.findIndex((l) => l.lesson.id === lesson.id)
    const previous = at > 0 ? order[at - 1].lesson : undefined
    if (previous && progress.lessonsDone[previous.id]) {
      const pool = previous.items.filter(isExercise).filter(isActive)
      if (pool.length) items.push({ item: pool[Math.floor(random() * pool.length)], refresher: true })
    }
  }
  return { kind: 'lesson', title: lesson.title, items }
}

/**
 * Due review items first. A short session is topped up with mistakes that are
 * not due yet (played as plain practice, so their 1/3/7 day ladder stays put),
 * then exercises from finished lessons. The mistakes keep practice open to
 * refill hearts even before the first lesson is finished.
 */
export function practicePlan(course: CourseId, progress: Pick<CourseProgress, 'review' | 'lessonsDone'>, random = Math.random): RunPlan {
  const inCourse = (id: string) => courseOf(id) === course && activeExercise(id)
  const due = dueIds(progress.review, dayKey()).filter(inCourse).slice(0, PRACTICE_SIZE)
  const items: SessionItem[] = due.map((id) => ({ item: EXERCISES.get(id)!.exercise, fromReview: true }))
  if (items.length < PRACTICE_MIN) {
    const taken = new Set(due)
    const mistakes = Object.keys(progress.review).filter((id) => inCourse(id) && !taken.has(id))
    for (const id of mistakes) taken.add(id)
    const finished = [...EXERCISES.values()].filter((r) => inCourse(r.exercise.id) && progress.lessonsDone[r.lesson.id] && !taken.has(r.exercise.id))
    const pool = [...shuffle(mistakes, random).map((id) => EXERCISES.get(id)!.exercise), ...shuffle(finished, random).map((r) => r.exercise)]
    for (const ex of pool.slice(0, PRACTICE_MIN - items.length)) items.push({ item: ex })
  }
  return { kind: 'practice', title: 'Latihan', items }
}

/** Questions per unit in the AZ-104 placement test: 15 units, 30 questions (LANGIT_AZ104_PLAN.md section 3). */
export const PLACEMENT_PER_UNIT = 2

/**
 * The AZ-104 placement test: 2 exam-ready questions from every unit, in course
 * order. True/false is used only when a unit has too few other questions, since
 * a guess would pass it half the time.
 */
export function placementPlan(random = Math.random): RunPlan {
  const items: SessionItem[] = []
  for (const unit of COURSES.az104.units) {
    const pool = unit.lessons.flatMap((l) => l.items.filter(isExercise).filter((e) => isActive(e) && e.examReady && !caseStudyOf(e.id)))
    const ordered = [...shuffle(pool.filter((e) => e.type !== 'truefalse'), random), ...shuffle(pool.filter((e) => e.type === 'truefalse'), random)]
    for (const item of ordered.slice(0, PLACEMENT_PER_UNIT)) items.push({ item })
  }
  return { kind: 'placement', title: 'Placement test AZ-104', items }
}

/** 20 mixed exercises from the whole path, no intro cards. */
export function checkpointPlan(cp: Checkpoint, random = Math.random): RunPlan {
  const pool = shuffle(exercisesInPath(courseOf(cp.id), cp.path), random).slice(0, cp.questionCount)
  return { kind: 'checkpoint', title: cp.title, items: pool.map((item) => ({ item })) }
}
