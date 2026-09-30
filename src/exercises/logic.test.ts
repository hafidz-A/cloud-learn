import { describe, expect, it } from 'vitest'
import type { Exercise } from '../lib/types'
import { correctAnswerText, initialResponse, isComplete, judge, judgePlace, makeLayout, sameCommand } from './logic'

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

  it('shell accepts parameters in any order, but not a different command or value', () => {
    const answer = ['az', 'group', 'create', '--name', 'MyRG', '--location', 'eastus']
    expect(sameCommand(['az', 'group', 'create', '--location', 'eastus', '--name', 'MyRG'], answer)).toBe(true)
    expect(sameCommand(['az', 'group', 'create', '--name', 'eastus', '--location', 'MyRG'], answer)).toBe(false)
    expect(sameCommand(['az', 'create', 'group', '--name', 'MyRG', '--location', 'eastus'], answer)).toBe(false)
    expect(sameCommand(['az', 'group', 'create', '--name', 'MyRG'], answer)).toBe(false)
    // Parameter tokens that carry their value, including a quoted value with spaces.
    const role = ['az role assignment create', '--assignee ani@contoso.com', '--role "Virtual Machine Contributor"', '--scope /subscriptions/1/resourceGroups/rg-web']
    expect(sameCommand([role[0], role[3], role[1], role[2]], role)).toBe(true)
    expect(sameCommand([role[0], role[1], '--role "Virtual Machine"', role[3]], role)).toBe(false)
    // PowerShell parameters use one dash.
    expect(sameCommand(['New-AzResourceGroup', '-Location', 'eastus', '-Name', 'MyRG'], ['New-AzResourceGroup', '-Name', 'MyRG', '-Location', 'eastus'])).toBe(true)
  })

  it('kql still needs the exact order, because pipe order changes the result', () => {
    const e: Exercise = { ...base, type: 'kql', tokens: ['T', '| take 10', '| sort by x'], answer: ['T', '| sort by x', '| take 10'], sampleResult: [['x'], ['1']] }
    expect(judge(e, [0, 2, 1]).correct).toBe(true)
    expect(judge(e, [0, 1, 2]).correct).toBe(false)
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

describe('admin exercise types (LANGIT_AZ104_PLAN.md section 6)', () => {
  const options = ['a', 'b', 'c', 'd']

  it('rules, template, and topology are judged like one-answer choices', () => {
    const rules: Exercise = { ...base, type: 'rules', tables: [{ title: 'T', columns: ['A', 'B'], rows: [['1', '2']] }], options, answer: 2 }
    const template: Exercise = { ...base, type: 'template', language: 'json', code: '{}', options, answer: 1 }
    const topology: Exercise = {
      ...base,
      type: 'topology',
      nodes: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
      links: [{ from: 'a', to: 'b', kind: 'peering' }],
      options,
      answer: 0,
    }
    for (const e of [rules, template, topology]) {
      const layout = makeLayout(e, () => 0.3)
      expect([...layout].sort()).toEqual([0, 1, 2, 3])
      expect(initialResponse(e, layout)).toBeNull()
      expect(isComplete(e, null)).toBe(false)
      const right = (e as { answer: number }).answer
      expect(judge(e, right).correct).toBe(true)
      expect(judge(e, (right + 1) % 4).correct).toBe(false)
      expect(correctAnswerText(e)).toBe(options[right])
    }
  })

  it('config judges only the fields in the answer, text without case, and keeps presets', () => {
    const e: Exercise = {
      ...base,
      type: 'config',
      blade: 'Create budget',
      fields: [
        { label: 'Name', kind: 'text' },
        { label: 'Reset period', kind: 'select', choices: ['Monthly', 'Quarterly'] },
        { label: 'Alert', kind: 'toggle' },
        { label: 'Threshold (%)', kind: 'number', value: 50 },
        { label: 'Scope', kind: 'select', choices: ['Subscription'], value: 'Subscription', readOnly: true },
      ],
      answer: { Name: 'Budget-Dev', 'Reset period': 'Monthly', Alert: true, 'Threshold (%)': 80 },
    }
    const start = initialResponse(e, [])
    expect(start).toEqual([null, null, false, 50, 'Subscription'])
    expect(isComplete(e, start)).toBe(false)
    expect(judge(e, ['  budget-dev ', 'Monthly', true, 80, 'Subscription']).correct).toBe(true)
    expect(judge(e, ['budget-dev', 'Monthly', true, 50, 'Subscription']).correct).toBe(false)
    expect(judge(e, ['budget-dev', 'Monthly', false, 80, 'Subscription']).correct).toBe(false)
    expect(correctAnswerText(e)).toBe('Name: Budget-Dev · Reset period: Monthly · Alert: On · Threshold (%): 80')
  })

  it('kql compares the query token by token', () => {
    const e: Exercise = {
      ...base,
      type: 'kql',
      tokens: ['Event', '|', 'where', 'Level == 1', '| summarize', 'count()'],
      answer: ['Event', '|', 'where', 'Level == 1'],
      sampleResult: [['EventID'], ['7000']],
    }
    expect(judge(e, [0, 1, 2, 3]).correct).toBe(true)
    expect(judge(e, [0, 2, 1, 3]).correct).toBe(false)
    expect(isComplete(e, [])).toBe(false)
    expect(correctAnswerText(e)).toBe('Event | where Level == 1')
  })
})
