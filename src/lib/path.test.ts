import { describe, expect, it } from 'vitest'
import { AZ104_CHECKPOINTS, AZ104_UNITS, exercisesInPath, hasContent, UNITS } from '../content/course'
import { pathStates } from './path'

const empty = { lessonsDone: {}, checkpoints: {} }

describe('pathStates', () => {
  it('starts AZ-900 at unit 1 lesson 1 with checkpoint 1 open to try early', () => {
    const s = pathStates('az900', empty)
    expect(s.lessons[UNITS[0].lessons[0].id]).toBe('active')
    expect(s.lessons[UNITS[0].lessons[1].id]).toBe('locked')
    expect(s.checkpoints.cp1).toBe('open')
    expect(s.pathOpen).toEqual({ 1: true, 2: false, 3: false })
  })

  it('opens AZ-104 without any AZ-900 progress, and never offers a checkpoint with no exercises', () => {
    const s = pathStates('az104', empty)
    expect(s.pathOpen[1]).toBe(true)
    // A lesson or checkpoint waits as "soon" exactly while it has nothing to ask.
    for (const unit of AZ104_UNITS)
      for (const lesson of unit.lessons) expect(s.lessons[lesson.id] === 'soon').toBe(!hasContent(lesson))
    for (const cp of AZ104_CHECKPOINTS) expect(s.checkpoints[cp.id] === 'soon').toBe(!exercisesInPath('az104', cp.path).length)
    expect(Object.keys(s.checkpoints)).toEqual(['az104-cp1', 'az104-cp2', 'az104-cp3', 'az104-cp4', 'az104-cp5'])
  })

  it('keeps AZ-900 lessons out of the AZ-104 map and the other way round', () => {
    const s104 = pathStates('az104', empty)
    const s900 = pathStates('az900', empty)
    expect(Object.keys(s104.lessons).every((id) => id.startsWith('az104-'))).toBe(true)
    expect(Object.keys(s900.lessons).some((id) => id.startsWith('az104-'))).toBe(false)
  })
})
