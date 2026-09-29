import { describe, expect, it } from 'vitest'
import type { Lesson, Unit } from '../lib/types'
import { UNITS } from './course'
import { GLOSSARY } from './glossary'
import { glossaryGaps, unexpandedAbbreviations, validateUnits } from './validate'

describe('course content', () => {
  const issues = validateUnits(UNITS)

  it('has all 12 units in order', () => {
    expect(UNITS.map((u) => Number(u.id.slice(1, 3)))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('has no content errors', () => {
    const warnings = issues.filter((i) => i.level === 'warn')
    if (warnings.length) console.warn(warnings.map((w) => `warn  ${w.where}: ${w.message}`).join('\n'))
    expect(issues.filter((i) => i.level === 'error')).toEqual([])
  })

  it('has no abbreviation warnings in lessons that already have content', () => {
    expect(issues.filter((i) => i.message.startsWith('expand on first use'))).toEqual([])
  })

  it('explains every abbreviation in the glossary', () => {
    expect(glossaryGaps(UNITS, new Set(GLOSSARY.map((g) => g.term)))).toEqual([])
  })
})

describe('unexpandedAbbreviations', () => {
  it('accepts both expansion styles', () => {
    expect(unexpandedAbbreviations(['Use an NSG (Network Security Group).'])).toEqual([])
    expect(unexpandedAbbreviations(['Use a Network Security Group (NSG).'])).toEqual([])
  })

  it('only checks the first use, and handles plurals', () => {
    expect(unexpandedAbbreviations(['Two VMs (Virtual Machines).', 'Then VM A and VM B.'])).toEqual([])
  })

  it('flags a bare abbreviation, including mixed case ones', () => {
    expect(unexpandedAbbreviations(['Deploy a VM to IaaS.'])).toEqual(['VM', 'IaaS'])
  })

  it('does not flag product names such as Entra ID', () => {
    expect(unexpandedAbbreviations(['Sign in with Microsoft Entra ID.'])).toEqual([])
  })
})

describe('lesson order rules (plan section 11.2)', () => {
  const tf = (id: string, concept: string) => ({
    id,
    type: 'truefalse' as const,
    concept,
    prompt: 'Statement.',
    explanation: 'Penjelasan.',
    answer: true,
  })
  const unitWith = (items: Lesson['items']): Unit => ({
    id: 'u99-test',
    path: 1,
    title: 'Test',
    lessons: [{ id: 'u99-l1', title: 'L', items }, { id: 'u99-l2', title: 'L', items: [] }, { id: 'u99-l3', title: 'L', items: [] }],
  })
  const messages = (u: Unit) => validateUnits([u]).map((i) => i.message)

  it('warns when a concept is tested before its intro card', () => {
    expect(messages(unitWith([tf('u99-l1-e1', 'zones')]))).toContain('concept "zones" is tested before any intro card introduces it')
    const withIntro = unitWith([
      { id: 'u99-l1-i1', type: 'intro', concept: 'zones', title: 'Zone', body: 'Kenalan dulu.' },
      tf('u99-l1-e1', 'zones'),
    ])
    expect(messages(withIntro).some((m) => m.includes('before any intro card'))).toBe(false)
  })

  it('warns when a recall exercise comes before 2 easier ones on the same concept', () => {
    const fill = {
      id: 'u99-l1-e2',
      type: 'fill' as const,
      concept: 'zones',
      prompt: 'Complete.',
      sentence: 'A ___ zone.',
      bank: ['b', 'c'],
      answers: ['b'],
      explanation: 'Penjelasan.',
    }
    const items: Lesson['items'] = [
      { id: 'u99-l1-i1', type: 'intro', concept: 'zones', title: 'Zone', body: 'Kenalan dulu.' },
      tf('u99-l1-e1', 'zones'),
      fill,
    ]
    expect(messages(unitWith(items))).toContain('fill should only test a concept already seen in 2 easier exercises, found 1')
  })

  it('rejects unknown diagrams and numbers intro and exercise ids separately', () => {
    const items: Lesson['items'] = [
      { id: 'u99-l1-i1', type: 'intro', concept: 'zones', title: 'Zone', body: 'Kenalan.', visual: 'Nope' },
      tf('u99-l1-e2', 'zones'),
    ]
    const errors = validateUnits([unitWith(items)]).filter((i) => i.level === 'error').map((i) => i.message)
    expect(errors.some((e) => e.startsWith('unknown visual "Nope"'))).toBe(true)
    expect(errors).toContain('exercise id should be "u99-l1-e1"')
  })
})
