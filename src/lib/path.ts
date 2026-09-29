import { COURSES, exercisesInPath, hasContent } from '../content/course'
import type { CourseId, CourseProgress } from './types'

/**
 * done:   finished at least once (checkpoint: passed)
 * active: the next lesson to play (bounces on the map)
 * open:   playable but not the next one (e.g. a path opened by passing its checkpoint early)
 * locked: finish the previous lesson, or pass the previous path's checkpoint, first
 * soon:   no exercises yet (for a checkpoint: none in its whole path)
 */
export type NodeState = 'done' | 'active' | 'open' | 'locked' | 'soon'

export type PathStates = {
  lessons: Record<string, NodeState>
  checkpoints: Record<string, NodeState>
  /** A path opens when the checkpoint before it is passed. */
  pathOpen: Record<number, boolean>
}

export function pathStates(course: CourseId, progress: Pick<CourseProgress, 'lessonsDone' | 'checkpoints'>): PathStates {
  const { paths: PATHS, units: UNITS, checkpoints: CHECKPOINTS } = COURSES[course]
  const lessons: Record<string, NodeState> = {}
  const checkpoints: Record<string, NodeState> = {}
  const pathOpen: Record<number, boolean> = {}
  let activeFound = false

  PATHS.forEach((path, pi) => {
    const prevCheckpoint = pi === 0 ? undefined : CHECKPOINTS[pi - 1]
    const open = !prevCheckpoint || !!progress.checkpoints[prevCheckpoint.id]?.passedAt
    pathOpen[path.id] = open
    let previousDone = true // the first lesson of an open path is playable

    for (const unit of UNITS.filter((u) => u.path === path.id)) {
      for (const lesson of unit.lessons) {
        const done = !!progress.lessonsDone[lesson.id]
        let state: NodeState
        if (!hasContent(lesson)) state = 'soon'
        else if (done) state = 'done'
        else if (open && previousDone) {
          state = activeFound ? 'open' : 'active'
          activeFound = true
        } else state = 'locked'
        lessons[lesson.id] = state
        previousDone = done || state === 'soon'
      }
    }

    const cp = CHECKPOINTS[pi]
    const passed = !!progress.checkpoints[cp.id]?.passedAt
    // A checkpoint can be tried as soon as its path is open (passing it early
    // skips ahead); it becomes "active" once every lesson of the path is done.
    // With no exercises in its path yet (AZ-104 while its content is written)
    // there is nothing to ask, so it waits like a lesson without exercises.
    if (passed) checkpoints[cp.id] = 'done'
    else if (!exercisesInPath(course, path.id).length) checkpoints[cp.id] = 'soon'
    else if (!open) checkpoints[cp.id] = 'locked'
    else checkpoints[cp.id] = previousDone && !activeFound ? 'active' : 'open'
    if (checkpoints[cp.id] === 'active') activeFound = true
  })

  return { lessons, checkpoints, pathOpen }
}
