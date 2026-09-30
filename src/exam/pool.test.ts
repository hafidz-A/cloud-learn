import { describe, expect, it } from 'vitest'
import { courseOf } from '../content/course'
import { FULL_SPLIT, createAttempt, pickFull } from './examLogic'
import { CASE_POOLS, EXAM_POOLS, examQuestion } from './pool'

describe('exam pools (LANGIT_AZ104_PLAN.md section 9.3)', () => {
  it('keeps each course to its own questions', () => {
    expect(EXAM_POOLS.az900.every((q) => courseOf(q.exercise.id) === 'az900')).toBe(true)
    expect(EXAM_POOLS.az104.every((q) => courseOf(q.exercise.id) === 'az104')).toBe(true)
    expect(CASE_POOLS.az900).toEqual([])
  })

  it('meets the AZ-104 bank target: 300 questions, per domain 75 / 55 / 55 / 75 / 40, and 5 case studies', () => {
    const pool = EXAM_POOLS.az104
    expect(pool.length).toBeGreaterThanOrEqual(300)
    const target: Record<number, number> = { 1: 75, 2: 55, 3: 55, 4: 75, 5: 40 }
    for (const p of [1, 2, 3, 4, 5]) expect(pool.filter((q) => q.path === p).length, `domain ${p}`).toBeGreaterThanOrEqual(target[p])
    expect(CASE_POOLS.az104.length).toBeGreaterThanOrEqual(5)
  })

  it('keeps case study questions out of the other modes', () => {
    const caseIds = new Set(CASE_POOLS.az104.flatMap((c) => c.questions.map((q) => q.exercise.id)))
    expect(EXAM_POOLS.az104.filter((q) => caseIds.has(q.exercise.id))).toEqual([])
  })

  it('builds a full AZ-104 simulation from the real bank, with the case study last', () => {
    const attempt = createAttempt('full', pickFull(EXAM_POOLS.az104, [], Math.random, 'az104', CASE_POOLS.az104), undefined, Math.random, 'az104')
    expect(attempt.questionIds).toHaveLength(50)
    expect(new Set(attempt.questionIds).size).toBe(50)
    const paths = attempt.questionIds.map((id) => examQuestion(id)!.path)
    for (const p of [1, 2, 3, 4, 5]) expect(paths.filter((x) => x === p)).toHaveLength(FULL_SPLIT.az104[p])
    expect(attempt.questionIds.slice(attempt.caseStart).every((id) => examQuestion(id)?.caseStudy === attempt.caseStudyId)).toBe(true)
  })
})
