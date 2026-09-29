import { describe, expect, it } from 'vitest'
import type { Exercise } from '../lib/types'
import { correctAnswerText, initialResponse, isComplete, judge, judgePlace, makeLayout } from './logic'

const base = { id: 'x', concept: 'c', prompt: 'P', explanation: 'E' }

describe('judge', () => {
  it('multi is right only when exactly the right options are picked', () => {
    const e: Exercise = { ...base, type: 'multi', options: ['a', 'b', 'c', 'd'], answers: [0, 2] }
    expect(judge(e, [2, 0]).correct).toBe(true)
    expect(judge(e, [0, 1]).correct).toBe(false)
    expect(isComplete(e, [0])).toBe(false)
  })

  it('yesno scores one point per statement', () => {
    const e: Exercise = {
      ...base,
      type: 'yesno',
      scenario: 'S',
      statements: [
        { text: 'a', answer: true },
        { text: 'b', answer: false },
        { text: 'c', answer: true },
      ],
    }
    expect(judge(e, [true, false, false])).toEqual({ correct: false, points: 2, maxPoints: 3 })
    expect(judge(e, [true, false, true]).correct).toBe(true)
    expect(correctAnswerText(e)).toBe('1. Yes, 2. No, 3. Yes')
  })

  it('fill compares words, so duplicate words in the bank both work', () => {
    const e: Exercise = { ...base, type: 'fill', sentence: 'A ___ and ___.', bank: ['x', 'y', 'x'], answers: ['x', 'y'] }
    expect(judge(e, [2, 1]).correct).toBe(true)
    expect(judge(e, [1, 0]).correct).toBe(false)
    expect(initialResponse(e, [0, 1, 2])).toEqual([null, null])
    expect(correctAnswerText(e)).toBe('A x and y.')
  })

  it('shell compares the typed command with the answer', () => {
    const e: Exercise = { ...base, type: 'shell', tokens: ['az', 'group', 'create', 'delete'], answer: ['az', 'group', 'create'] }
    expect(judge(e, [0, 1, 2]).correct).toBe(true)
    expect(judge(e, [0, 1, 3]).correct).toBe(false)
  })

  it('sort and order', () => {
    const sort: Exercise = { ...base, type: 'sort', buckets: ['A', 'B'], items: [{ text: 'a', bucket: 0 }, { text: 'b', bucket: 1 }] }
    expect(judge(sort, [0, 1]).correct).toBe(true)
    expect(judge(sort, [1, 1]).correct).toBe(false)
    const order: Exercise = { ...base, type: 'order', items: ['1', '2', '3'] }
    expect(judge(order, [0, 1, 2]).correct).toBe(true)
    expect(judge(order, [1, 0, 2]).correct).toBe(false)
  })
})

describe('place rules', () => {
  const pieces = [
    { text: 'VM A', validZones: [0, 1, 2] },
    { text: 'VM B', validZones: [0, 1, 2] },
    { text: 'VM C', validZones: [0, 1, 2] },
  ]
  const e = { ...base, type: 'place' as const, zones: ['Z1', 'Z2', 'Z3'], pieces, rule: 'one-per-zone' as const }

  it('one-per-zone flags pieces that share a zone', () => {
    expect(judgePlace(e, [0, 1, 2]).correct).toBe(true)
    expect(judgePlace(e, [0, 0, 2])).toEqual({ correct: false, pieceOk: [false, false, true] })
  })

  it('valid only checks allowed zones; spread also needs 2 zones', () => {
    const web = { ...e, rule: 'valid' as const, pieces: [{ text: 'web', validZones: [0] }, { text: 'db', validZones: [1] }] }
    expect(judgePlace(web, [0, 1]).correct).toBe(true)
    expect(judgePlace(web, [1, 1]).pieceOk).toEqual([false, true])
    const spread = { ...e, rule: 'spread' as const }
    expect(judgePlace(spread, [0, 0, 0]).correct).toBe(false)
    expect(judgePlace(spread, [0, 0, 1]).correct).toBe(true)
  })
})

describe('makeLayout', () => {
  it('never starts an order exercise already solved', () => {
    const e: Exercise = { ...base, type: 'order', items: ['a', 'b'] }
    const alwaysSame = () => 0.99 // shuffle keeps identity with this random
    expect(makeLayout(e, alwaysSame)).toEqual([1, 0])
  })
})
