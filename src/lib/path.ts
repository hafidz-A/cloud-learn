import { hasContent } from '../content/course'
import type { Progress, Unit } from './types'

/**
 * done:   finished at least once
 * active: the next lesson to play (bounces on the map)
 * open:   playable but not the next one
 * soon:   no playable exercises yet, shown faded and locked
 *
 * Stage 4 of the plan replaces "soon" with real locking (finish the previous
 * lesson, pass the checkpoint to open the next path).
 */
export type NodeState = 'done' | 'active' | 'open' | 'soon'

export function lessonStates(units: Unit[], lessonsDone: Progress['lessonsDone']): Record<string, NodeState> {
  const states: Record<string, NodeState> = {}
  let activeFound = false
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      if (lessonsDone[lesson.id]) states[lesson.id] = 'done'
      else if (!hasContent(lesson)) states[lesson.id] = 'soon'
      else if (!activeFound) {
        states[lesson.id] = 'active'
        activeFound = true
      } else states[lesson.id] = 'open'
    }
  }
  return states
}
