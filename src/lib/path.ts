import { COURSES, exercisesInPath, hasContent, isRequiredLesson, type Checkpoint, type PathInfo } from '../content/course'
import type { CourseId, CourseProgress, PathId, Unit } from './types'

/**
 * done:   finished at least once (checkpoint: passed)
 * active: the next required lesson to play (bounces on the map)
 * open:   playable but not the next one (an optional branch, or a path opened by passing its checkpoint early)
 * locked: finish the lesson it grows from or the previous lesson, the prerequisites
 *         before it, or pass the previous path's checkpoint first
 * soon:   no exercises yet (for a checkpoint: none in its whole path)
 */
export type NodeState = 'done' | 'active' | 'open' | 'locked' | 'soon'

export type PathStates = {
  lessons: Record<string, NodeState>
  checkpoints: Record<string, NodeState>
  /** A path opens when the checkpoint before it is passed. */
  pathOpen: Record<number, boolean>
}

export type CourseShape = {
  paths: PathInfo[]
  units: Unit[]
  checkpoints: Checkpoint[]
  /** Whether a path has exercises for its checkpoint. */
  hasExercises: (path: PathId) => boolean
}

/**
 * The state of every lesson and checkpoint. Trunk lessons (every lesson of the
 * Azure courses) go in order: one opens when the trunk lesson before it and every
 * prerequisite branch since then are done. A branch opens once the lesson it grows
 * from is done (LANGIT_CCNA_PLAN.md section 4.3). A lesson without exercises
 * ("soon") never holds up the ones after it.
 */
export function shapeStates(shape: CourseShape, progress: Pick<CourseProgress, 'lessonsDone' | 'checkpoints'>): PathStates {
  const lessons: Record<string, NodeState> = {}
  const checkpoints: Record<string, NodeState> = {}
  const pathOpen: Record<number, boolean> = {}
  const passed = new Set<string>()
  let activeFound = false

  shape.paths.forEach((path, pi) => {
    const prevCheckpoint = pi === 0 ? undefined : shape.checkpoints[pi - 1]
    const open = !prevCheckpoint || !!progress.checkpoints[prevCheckpoint.id]?.passedAt
    pathOpen[path.id] = open
    // The first trunk lesson of an open path is playable; after that, the trunk waits
    // for the trunk lesson before it and for the prerequisites that grew since.
    let gate = true

    for (const unit of shape.units.filter((u) => u.path === path.id)) {
      for (const lesson of unit.lessons) {
        const done = !!progress.lessonsDone[lesson.id]
        const soon = !hasContent(lesson)
        const playable = open && (lesson.branch ? passed.has(lesson.branch.from) : gate)
        const required = isRequiredLesson(lesson)
        let state: NodeState
        if (soon) state = 'soon'
        else if (done) state = 'done'
        else if (playable) state = required && !activeFound ? 'active' : 'open'
        else state = 'locked'
        if (state === 'active') activeFound = true
        lessons[lesson.id] = state
        if (done || soon) passed.add(lesson.id)

        if (!lesson.branch) gate = done || soon
        else if (lesson.branch.kind === 'prereq') gate = gate && (done || soon)
      }
    }

    const cp = shape.checkpoints[pi]
    const isPassed = !!progress.checkpoints[cp.id]?.passedAt
    // A checkpoint can be tried as soon as its path is open (passing it early
    // skips ahead); it becomes "active" once the path's trunk and prerequisites are
    // done. With no exercises in its path yet there is nothing to ask, so it waits
    // like a lesson without exercises.
    if (isPassed) checkpoints[cp.id] = 'done'
    else if (!shape.hasExercises(path.id)) checkpoints[cp.id] = 'soon'
    else if (!open) checkpoints[cp.id] = 'locked'
    else checkpoints[cp.id] = gate && !activeFound ? 'active' : 'open'
    if (checkpoints[cp.id] === 'active') activeFound = true
  })

  return { lessons, checkpoints, pathOpen }
}

export function pathStates(course: CourseId, progress: Pick<CourseProgress, 'lessonsDone' | 'checkpoints'>): PathStates {
  const { paths, units, checkpoints } = COURSES[course]
  return shapeStates({ paths, units, checkpoints, hasExercises: (path) => exercisesInPath(course, path).length > 0 }, progress)
}

/** Why a locked lesson is locked, in words for its popover. */
export function lockReason(unit: Unit, lessonId: string, states: PathStates, pathIsOpen: boolean): string {
  if (!pathIsOpen) return 'Lulus checkpoint jalur sebelumnya dulu untuk membuka jalur ini.'
  const lesson = unit.lessons.find((l) => l.id === lessonId)
  if (lesson?.branch) {
    const parent = unit.lessons.find((l) => l.id === lesson.branch!.from)
    return `Selesaikan "${parent?.title ?? 'lesson asalnya'}" dulu untuk membuka cabang ini.`
  }
  const at = unit.lessons.findIndex((l) => l.id === lessonId)
  const waiting = unit.lessons.slice(0, at).filter((l) => l.branch?.kind === 'prereq' && states.lessons[l.id] !== 'done' && states.lessons[l.id] !== 'soon')
  if (waiting.length) return `Selesaikan cabang prasyarat "${waiting[waiting.length - 1].title}" dulu, atau lewati dengan tes lompat.`
  return 'Selesaikan lesson sebelumnya dulu untuk membuka lesson ini.'
}
