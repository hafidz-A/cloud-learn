import { describe, expect, it } from 'vitest'
import type { ExamAttempt, Exercise, PathId } from '../lib/types'
import { FULL_SPLIT, createAttempt, isAnswered, pickFull, pickWeak, readiness, scoreAttempt, weakestDomain, type ExamQuestion } from './examLogic'

const q = (id: string, path: PathId, concept = 'c'): ExamQuestion => ({
  path,
  exercise: { id, type: 'truefalse', concept, prompt: 'P', explanation: 'E', answer: true, examReady: true },
})

const pool = [
  ...Array.from({ length: 30 }, (_, i) => q(`a${i}`, 1)),
  ...Array.from({ length: 30 }, (_, i) => q(`b${i}`, 2)),
  ...Array.from({ length: 30 }, (_, i) => q(`c${i}`, 3)),
]

describe('pickFull', () => {
  it('takes 14 / 19 / 17 questions from the three domains', () => {
    const picked = pickFull(pool, [])
    expect(picked).toHaveLength(50)
    for (const p of [1, 2, 3] as PathId[]) expect(picked.filter((x) => x.path === p)).toHaveLength(FULL_SPLIT[p])
  })

  it('prefers questions not used in the last 3 simulations', () => {
    const used = pool.filter((x) => x.path === 1).slice(0, 16).map((x) => x.exercise.id)
    const history = [{ mode: 'full', questionIds: used } as ExamAttempt]
    const picked = pickFull(pool, history).filter((x) => x.path === 1)
    expect(picked.every((x) => !used.includes(x.exercise.id))).toBe(true)
  })

  it('tops up from other domains when one is thin', () => {
    const thin = [...pool.filter((x) => x.path !== 1), q('only', 1)]
    expect(pickFull(thin, [])).toHaveLength(50)
  })
})

describe('pickWeak', () => {
  it('starts from the weakest concepts', () => {
    const mixed = [q('w1', 1, 'weak'), q('w2', 2, 'weak'), q('s1', 1, 'strong'), ...pool]
    const { questions, fromStats } = pickWeak(mixed, { weak: { right: 1, wrong: 4 }, strong: { right: 4, wrong: 1 } })
    expect(fromStats).toBe(true)
    expect(questions).toHaveLength(20)
    const ids = questions.map((x) => x.exercise.id)
    expect(ids).toEqual(expect.arrayContaining(['w1', 'w2', 's1']))
  })

  it('falls back to random questions without practice data', () => {
    expect(pickWeak(pool, {}).fromStats).toBe(false)
  })
})

describe('scoring', () => {
  it('scores out of 1000 with yes/no worth a point per statement', () => {
    const yesno: Exercise = {
      id: 'y',
      type: 'yesno',
      concept: 'c',
      prompt: 'P',
      explanation: 'E',
      scenario: 'S',
      statements: [
        { text: '1', answer: true },
        { text: '2', answer: true },
        { text: '3', answer: false },
      ],
    }
    const questions: ExamQuestion[] = [q('t', 1), { exercise: yesno, path: 2 }]
    const attempt = createAttempt('domain', questions)
    attempt.responses = { t: false, y: [true, true, true] }
    const lookup = (id: string) => questions.find((x) => x.exercise.id === id)
    const { score, domainScores, results } = scoreAttempt(attempt, lookup)
    expect(score).toBe(500) // 2 of 4 points
    expect(domainScores[1]).toEqual({ right: 0, total: 1 })
    expect(domainScores[2]).toEqual({ right: 2, total: 3 })
    expect(results.t.answered).toBe(true)
  })

  it('counts an order question as answered only once the player moved something', () => {
    const order: Exercise = { id: 'o', type: 'order', concept: 'c', prompt: 'P', explanation: 'E', items: ['1', '2', '3'] }
    const questions: ExamQuestion[] = [{ exercise: order, path: 1 }]
    const lookup = (id: string) => questions.find((x) => x.exercise.id === id)
    const attempt = createAttempt('domain', questions)
    // A fresh attempt holds the shown (shuffled) order as its response.
    expect(scoreAttempt(attempt, lookup).results.o.answered).toBe(false)
    expect(isAnswered(order, attempt.responses.o, attempt.optionOrder.o)).toBe(false)
    attempt.responses = { o: [0, 1, 2] }
    expect(scoreAttempt(attempt, lookup).results.o).toMatchObject({ answered: true, correct: true })
  })
})

describe('readiness', () => {
  const full = (score: number) => ({ mode: 'full', score, domainScores: undefined }) as ExamAttempt
  it('needs 3 full simulations averaging 800', () => {
    expect(readiness([full(900), full(900)]).ready).toBe(false)
    expect(readiness([full(600), full(820), full(800), full(790)])).toEqual({ ready: true, average: 803, fullCount: 4 })
  })
  it('finds the weakest domain', () => {
    const a = { domainScores: { 1: { right: 9, total: 10 }, 2: { right: 3, total: 10 }, 3: { right: 6, total: 10 } } } as ExamAttempt
    expect(weakestDomain([a])).toBe(2)
  })
})
