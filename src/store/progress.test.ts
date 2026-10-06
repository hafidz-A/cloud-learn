import { beforeEach, describe, expect, it } from 'vitest'
import type { ExamAttempt } from '../lib/types'
import { courseProgress, initialProgress, useProgress } from './progress'

// Two courses in one store (LANGIT_AZ104_PLAN.md sections 3 and 11): AZ-104
// progress lands in courses.az104, AZ-900 stays where it always was, and XP,
// streak, and hearts are counted once for the whole app.

const store = () => useProgress.getState()

beforeEach(() => useProgress.setState({ ...initialProgress }))

describe('progress per course', () => {
  it('keeps an AZ-104 answer out of AZ-900 and the other way round', () => {
    store().recordAnswer('az104-u02-l1-e1', 'rbac', false)
    store().recordAnswer('u08-l3-e2', 'rbac', true)
    const az104 = courseProgress(store(), 'az104')
    const az900 = courseProgress(store(), 'az900')
    expect(Object.keys(az104.review)).toEqual(['az104-u02-l1-e1'])
    expect(az104.conceptStats.rbac).toEqual({ right: 0, wrong: 1 })
    expect(az900.review).toEqual({})
    expect(az900.conceptStats.rbac).toEqual({ right: 1, wrong: 0 })
    // AZ-900 stays at the top level, where saved data from before AZ-104 has it.
    expect(store().conceptStats.rbac).toEqual({ right: 1, wrong: 0 })
  })

  it('counts XP and the streak once, whichever course the lesson is in', () => {
    store().completeLesson('u01-l1', 1, 10, 'u01-cloud-computing', ['u01-l1'])
    store().completeLesson('az104-u01-l1', 1, 10, 'az104-u01-identity', ['az104-u01-l1'])
    expect(store().xp).toBe(20)
    expect(store().streak.current).toBe(1)
    expect(Object.keys(store().lessonsDone)).toEqual(['u01-l1'])
    expect(Object.keys(courseProgress(store(), 'az104').lessonsDone)).toEqual(['az104-u01-l1'])
    expect(courseProgress(store(), 'az104').unitLevel).toEqual({ 'az104-u01-identity': 1 })
  })

  it('never lowers a unit level when a lesson is added to a finished unit', () => {
    store().completeLesson('u04-l1', 1, 10, 'u04-core-architecture', ['u04-l1'])
    expect(courseProgress(store(), 'az900').unitLevel['u04-core-architecture']).toBe(1)
    // The unit gains an exam practice lesson that is not played yet.
    store().completeLesson('u04-l1', 1, 10, 'u04-core-architecture', ['u04-l1', 'u04-l5'])
    expect(courseProgress(store(), 'az900').unitLevel['u04-core-architecture']).toBe(1)
  })

  it('files checkpoints and finished exams under their own course', () => {
    store().completeCheckpoint('az104-cp1', 0.9, true, 20)
    store().completeCheckpoint('cp1', 0.5, false, 20)
    expect(Object.keys(courseProgress(store(), 'az104').checkpoints)).toEqual(['az104-cp1'])
    expect(Object.keys(store().checkpoints)).toEqual(['cp1'])

    const attempt = (id: string, course?: ExamAttempt['course']): ExamAttempt => ({
      id,
      course,
      mode: 'domain',
      startedAt: '2026-09-30T08:00:00Z',
      timeLimitSec: 900,
      elapsedSec: 10,
      current: 0,
      questionIds: [],
      responses: {},
      flagged: [],
      optionOrder: {},
    })
    store().finishExam(attempt('old'))
    store().finishExam(attempt('new', 'az104'))
    expect(store().examHistory.map((a) => a.id)).toEqual(['old'])
    expect(courseProgress(store(), 'az104').examHistory.map((a) => a.id)).toEqual(['new'])
  })
})

describe('placement test (LANGIT_AZ104_PLAN.md section 3)', () => {
  it('marks every lesson of the chosen units done without XP, and keeps AZ-900 as it was', () => {
    store().finishPlacement({ 'az104-u01-identity': { right: 2, total: 2 }, 'az104-u02-rbac': { right: 2, total: 2 }, 'az104-u03-governance': { right: 1, total: 2 } })
    store().applyPlacement(['az104-u02-rbac'])
    const az104 = courseProgress(store(), 'az104')
    expect(Object.keys(az104.lessonsDone).every((id) => id.startsWith('az104-u02-'))).toBe(true)
    expect(Object.keys(az104.lessonsDone).length).toBeGreaterThanOrEqual(4)
    expect(az104.unitLevel['az104-u02-rbac']).toBe(1)
    expect(az104.placement?.applied).toEqual(['az104-u02-rbac'])
    expect(az104.conceptStats).toEqual({})
    expect(store().xp).toBe(0)
    expect(store().lessonsDone).toEqual({})
  })

  it('keeps a lesson result that is already better', () => {
    store().completeLesson('az104-u02-l1', 1, 10, 'az104-u02-rbac', ['az104-u02-l1'])
    store().finishPlacement({ 'az104-u02-rbac': { right: 2, total: 2 } })
    store().applyPlacement(['az104-u02-rbac'])
    expect(courseProgress(store(), 'az104').lessonsDone['az104-u02-l1'].bestAccuracy).toBe(1)
  })
})

