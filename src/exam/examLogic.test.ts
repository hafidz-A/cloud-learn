import { describe, expect, it } from 'vitest'
import type { ExamAttempt, Exercise, PathId } from '../lib/types'
import { EXAM_MODES, FULL_SPLIT, createAttempt, isAnswered, openRange, pickDomain, pickFull, pickWeak, readiness, scoreAttempt, weakestDomain, type CasePool, type ExamQuestion } from './examLogic'

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
    for (const p of [1, 2, 3] as PathId[]) expect(picked.filter((x) => x.path === p)).toHaveLength(FULL_SPLIT.az900[p])
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

describe('AZ-104 (LANGIT_AZ104_PLAN.md section 9)', () => {
  const choice = (id: string, path: PathId): ExamQuestion => ({
    path,
    exercise: { id, type: 'choice', concept: 'c', prompt: 'P', explanation: 'E', options: ['a', 'b', 'c', 'd'], answer: 0, examReady: true },
  })
  // Per domain: 20 true/false and 20 choice questions.
  const az104 = [1, 2, 3, 4, 5].flatMap((p) => [
    ...Array.from({ length: 20 }, (_, i) => q(`t${p}-${i}`, p)),
    ...Array.from({ length: 20 }, (_, i) => choice(`m${p}-${i}`, p)),
  ])
  const cases: CasePool[] = [
    { id: 'az104-cs01-a', questions: [choice('az104-cs01-e1', 1), choice('az104-cs01-e2', 2), choice('az104-cs01-e3', 2)] },
    { id: 'az104-cs02-b', questions: [choice('az104-cs02-e1', 4), choice('az104-cs02-e2', 5)] },
  ]

  it('uses 50 questions in 100 minutes, 15 in 30, and 20 in 40', () => {
    expect([EXAM_MODES.az104.full, EXAM_MODES.az104.domain, EXAM_MODES.az104.weak].map((m) => [m.count, m.minutes])).toEqual([
      [50, 100],
      [15, 30],
      [20, 40],
    ])
    expect(Object.values(FULL_SPLIT.az104).reduce((a, b) => a + b, 0)).toBe(50)
  })

  it('weights the domains 12 / 10 / 9 / 12 / 7 without a case study', () => {
    const picked = pickFull(az104, [], Math.random, 'az104')
    expect(picked).toHaveLength(50)
    for (const p of [1, 2, 3, 4, 5]) expect(picked.filter((x) => x.path === p)).toHaveLength(FULL_SPLIT.az104[p])
  })

  it('ends with one case study whose questions count toward their domains', () => {
    const picked = pickFull(az104, [], () => 0, 'az104', cases)
    expect(picked).toHaveLength(50)
    const cs = picked.filter((x) => x.caseStudy)
    expect(cs.length).toBeGreaterThan(0)
    expect(picked.slice(-cs.length).every((x) => x.caseStudy === cs[0].caseStudy)).toBe(true)
    for (const p of [1, 2, 3, 4, 5]) expect(picked.filter((x) => x.path === p)).toHaveLength(FULL_SPLIT.az104[p])
  })

  it('uses the case study of the last simulations last', () => {
    const history = [{ mode: 'full', questionIds: [], caseStudyId: 'az104-cs01-a' } as unknown as ExamAttempt]
    for (let i = 0; i < 5; i++) expect(pickFull(az104, history, Math.random, 'az104', cases).at(-1)?.caseStudy).toBe('az104-cs02-b')
  })

  it('keeps true/false questions to about a fifth when there are enough others', () => {
    const full = pickFull(az104, [], Math.random, 'az104')
    expect(full.filter((x) => x.exercise.type === 'truefalse').length).toBeLessThanOrEqual(10)
    const domain = pickDomain(az104, 3, [], Math.random, 'az104')
    expect(domain).toHaveLength(15)
    expect(domain.filter((x) => x.exercise.type === 'truefalse').length).toBeLessThanOrEqual(3)
    // Without enough other questions, true/false still fills the exam.
    expect(pickDomain(az104.filter((x) => x.exercise.type === 'truefalse'), 3, [], Math.random, 'az104')).toHaveLength(15)
  })

  it('marks where the case study section starts, and locks the questions before it once entered', () => {
    const attempt = createAttempt('full', pickFull(az104, [], Math.random, 'az104', cases), undefined, Math.random, 'az104')
    expect(attempt.timeLimitSec).toBe(6000)
    expect(attempt.caseStudyId).toMatch(/^az104-cs0[12]/)
    expect(attempt.questionIds.slice(attempt.caseStart).every((id) => id.startsWith(attempt.caseStudyId!.slice(0, 10)))).toBe(true)
    expect(openRange(attempt)).toEqual([0, attempt.caseStart])
    expect(openRange({ ...attempt, caseEntered: true })).toEqual([attempt.caseStart, 50])
    const plain = createAttempt('domain', pickDomain(az104, 1, [], Math.random, 'az104'), 1, Math.random, 'az104')
    expect(plain.caseStart).toBeUndefined()
    expect(openRange(plain)).toEqual([0, 15])
  })
})

describe('spreading over the outline', () => {
  it('takes questions from every outline item before taking a second one from any item', () => {
    // Item A has 30 questions, items B to E only 2 each.
    const many = [
      ...Array.from({ length: 30 }, (_, i) => ({ ...q(`a${i}`, 1), item: 'A' })),
      ...['B', 'C', 'D', 'E'].flatMap((item) => [0, 1].map((i) => ({ ...q(`${item}${i}`, 1), item }))),
    ]
    const picked = pickDomain(many, 1, [])
    expect(new Set(picked.map((x) => x.item))).toEqual(new Set(['A', 'B', 'C', 'D', 'E']))
    expect(picked.filter((x) => x.item !== 'A')).toHaveLength(8)
  })
})

describe('isAnswered', () => {
  it('does not count a config question as answered until a field changes', () => {
    const config: Exercise = {
      id: 'cfg',
      type: 'config',
      concept: 'c',
      prompt: 'P',
      explanation: 'E',
      blade: 'b',
      fields: [
        { label: 'Tier', kind: 'select', choices: ['Hot', 'Cool'], value: 'Hot' },
        { label: 'Days', kind: 'number', value: 7 },
      ],
      answer: { Tier: 'Cool', Days: 30 },
    }
    expect(isAnswered(config, ['Hot', 7])).toBe(false)
    expect(isAnswered(config, ['Cool', 7])).toBe(true)
    expect(isAnswered(config, ['Cool', null])).toBe(false)
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
    const a = { domainScores: { 1: { right: 9, total: 10 }, 2: { right: 3, total: 10 }, 3: { right: 6, total: 10 } } } as unknown as ExamAttempt
    expect(weakestDomain([a])).toBe(2)
  })
})
