import { describe, expect, it } from 'vitest'
import type { Fact, LearnCard, Lesson, LessonItem, Unit } from '../lib/types'
import { AZ104_UNITS, UNITS, courseOf } from './course'
import { GLOSSARY } from './glossary'
import { glossaryGaps, unexpandedAbbreviations, validateUnits, type Issue } from './validate'

/**
 * Coverage errors (LANGIT_AZ900_PERBAIKAN_MATERI.md section 4) count once a unit
 * has its facts list, that is, once the unit went through the material rework.
 * Every other error counts everywhere.
 */
export function blockingErrors(issues: Issue[], units: Unit[]): Issue[] {
  const reworked = new Set(units.filter((u) => Array.isArray(u.facts)).map((u) => u.id))
  return issues.filter((i) => i.level === 'error' && (!i.coverage || (i.unit !== undefined && reworked.has(i.unit))))
}

describe('AZ-104 content (LANGIT_AZ104_PLAN.md)', () => {
  const issues = validateUnits(AZ104_UNITS, 'az104')

  it('has all 15 units in order, on the 5 paths of section 3', () => {
    expect(AZ104_UNITS.map((u) => u.id.slice(0, 9))).toEqual(Array.from({ length: 15 }, (_, i) => `az104-u${String(i + 1).padStart(2, '0')}`))
    expect(AZ104_UNITS.map((u) => u.path)).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5])
  })

  it('has no content errors, and every id starts with "az104-"', () => {
    const warnings = issues.filter((i) => i.level === 'warn')
    if (warnings.length) console.warn(warnings.map((w) => `warn  ${w.where}: ${w.message}`).join('\n'))
    expect(blockingErrors(issues, AZ104_UNITS)).toEqual([])
    const ids = AZ104_UNITS.flatMap((u) => [u.id, ...(u.facts ?? []).map((f) => f.id), ...u.lessons.flatMap((l) => [l.id, ...l.items.map((i) => i.id)])])
    expect(ids.filter((id) => courseOf(id) !== 'az104')).toEqual([])
  })

  it('shares no id with AZ-900', () => {
    const az900 = new Set(UNITS.flatMap((u) => [u.id, ...u.lessons.flatMap((l) => [l.id, ...l.items.map((i) => i.id)])]))
    expect(AZ104_UNITS.flatMap((u) => [u.id, ...u.lessons.map((l) => l.id)]).filter((id) => az900.has(id))).toEqual([])
  })

  it('expands every abbreviation on first use, and explains it in the glossary', () => {
    expect(issues.filter((i) => i.message.startsWith('expand on first use'))).toEqual([])
    expect(glossaryGaps(AZ104_UNITS, new Set(GLOSSARY.map((g) => g.term)))).toEqual([])
  })

  it('marks at least 30% of the exercises of every written unit examReady (Prompt B, step 6)', () => {
    for (const unit of AZ104_UNITS) {
      const exercises = unit.lessons.flatMap((l) => l.items).filter((i) => i.type !== 'learn' && i.type !== 'intro' && !i.retired)
      if (exercises.length === 0) continue
      const ready = exercises.filter((e) => 'examReady' in e && e.examReady).length
      expect(ready / exercises.length, unit.id).toBeGreaterThanOrEqual(0.3)
    }
  })

  it('rejects an AZ-104 id without the prefix', () => {
    const bad: Unit = { id: 'az104-u01-identity', path: 1, title: 'x', lessons: [{ id: 'u01-l1', title: 'x', items: [] }] }
    expect(validateUnits([bad], 'az104').some((i) => i.level === 'error' && i.message.includes('must start with "az104-"'))).toBe(true)
  })
})

describe('course content', () => {
  const issues = validateUnits(UNITS)

  it('has all 12 units in order', () => {
    expect(UNITS.map((u) => Number(u.id.slice(1, 3)))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('has no content errors', () => {
    const warnings = issues.filter((i) => i.level === 'warn')
    if (warnings.length) console.warn(warnings.map((w) => `warn  ${w.where}: ${w.message}`).join('\n'))
    expect(blockingErrors(issues, UNITS)).toEqual([])
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

const tf = (id: string, concept: string, requires?: string[]): LessonItem => ({
  id,
  type: 'truefalse',
  concept,
  prompt: 'Statement.',
  explanation: 'Penjelasan.',
  answer: true,
  requires,
})

const unitWith = (items: Lesson['items'], facts?: Fact[], more: Lesson['items'] = []): Unit => ({
  id: 'u99-test',
  path: 1,
  title: 'Test',
  facts,
  lessons: [
    { id: 'u99-l1', title: 'L', items },
    { id: 'u99-l2', title: 'L', items: more },
    { id: 'u99-l3', title: 'L', items: [] },
  ],
})

const messages = (u: Unit) => validateUnits([u]).map((i) => i.message)
const errors = (u: Unit) => validateUnits([u]).filter((i) => i.level === 'error').map((i) => i.message)

describe('lesson order rules (plan section 11.2)', () => {
  it('warns when a concept is tested before its intro card', () => {
    expect(messages(unitWith([tf('u99-l1-e1', 'zones')]))).toContain('concept "zones" is tested before any intro card introduces it')
    const withIntro = unitWith([{ id: 'u99-l1-i1', type: 'intro', concept: 'zones', title: 'Zone', body: 'Kenalan dulu.' }, tf('u99-l1-e1', 'zones')])
    expect(messages(withIntro).some((m) => m.includes('before any intro card'))).toBe(false)
  })

  it('warns when a recall exercise comes before 2 easier ones on the same concept', () => {
    const fill: LessonItem = {
      id: 'u99-l1-e2',
      type: 'fill',
      concept: 'zones',
      prompt: 'Complete.',
      sentence: 'A ___ zone.',
      bank: ['b', 'c'],
      answers: ['b'],
      explanation: 'Penjelasan.',
    }
    const items: Lesson['items'] = [{ id: 'u99-l1-i1', type: 'intro', concept: 'zones', title: 'Zone', body: 'Kenalan dulu.' }, tf('u99-l1-e1', 'zones'), fill]
    expect(messages(unitWith(items))).toContain('fill should only test a concept already seen in 2 easier exercises, found 1')
  })

  it('rejects unknown diagrams and ids that do not belong to their lesson', () => {
    const items: Lesson['items'] = [
      { id: 'u99-l1-i1', type: 'intro', concept: 'zones', title: 'Zone', body: 'Kenalan.', visual: 'Nope' },
      tf('u98-l1-e1', 'zones'),
    ]
    const found = errors(unitWith(items))
    expect(found.some((e) => e.startsWith('unknown visual "Nope"'))).toBe(true)
    expect(found).toContain('exercise id should look like "u99-l1-e1"')
  })
})

describe('material coverage (perbaikan materi section 4)', () => {
  const source = 'https://learn.microsoft.com/azure/reliability/availability-zones-overview'
  const fact = (id: string, extra: Partial<Fact> = {}): Fact => ({ id, statement: 'Fakta.', source, ...extra })
  const learn = (id: string, teaches: string[], extra: Partial<LearnCard> = {}): LearnCard => ({
    id,
    type: 'learn',
    concepts: ['zones'],
    title: 'Zone',
    body: 'Satu kalimat. Dua kalimat. Tiga kalimat.',
    keyPoints: ['Satu', 'Dua'],
    teaches,
    ...extra,
  })

  it('accepts an exercise whose facts were taught earlier in the lesson', () => {
    const u = unitWith([learn('u99-l1-m1', ['f-u99-a']), tf('u99-l1-e1', 'zones', ['f-u99-a'])], [fact('f-u99-a')])
    expect(errors(u)).toEqual([])
  })

  it('rejects an exercise without requires, and marks it as a coverage error', () => {
    const issues = validateUnits([unitWith([learn('u99-l1-m1', ['f-u99-a']), tf('u99-l1-e1', 'zones')], [fact('f-u99-a')])])
    const missing = issues.find((i) => i.message.startsWith('requires is empty'))
    expect(missing).toMatchObject({ level: 'error', coverage: true, unit: 'u99-test' })
  })

  it('rejects facts that are unknown, taught only later, or never taught', () => {
    const u = unitWith(
      [tf('u99-l1-e1', 'zones', ['f-u99-a']), tf('u99-l1-e2', 'zones', ['f-u99-x']), tf('u99-l1-e3', 'zones', ['f-u99-b'])],
      [fact('f-u99-a'), fact('f-u99-b')],
      [learn('u99-l2-m1', ['f-u99-a'])],
    )
    expect(errors(u)).toEqual(
      expect.arrayContaining([
        'fact "f-u99-a" is only taught after this exercise',
        'requires unknown fact "f-u99-x"',
        'fact "f-u99-b" is not taught by any learn card',
      ]),
    )
  })

  it('needs a Microsoft Learn source unless the fact is marked verify', () => {
    const items = [learn('u99-l1-m1', ['f-u99-a', 'f-u99-b']), tf('u99-l1-e1', 'zones', ['f-u99-a', 'f-u99-b'])]
    const u = unitWith(items, [fact('f-u99-a', { source: 'https://example.com/blog' }), fact('f-u99-b', { source: '', verify: true })])
    expect(errors(u)).toEqual(['fact "f-u99-a" needs a Microsoft Learn source, or verify: true'])
  })

  it('requires a visual for concepts in the visual catalog', () => {
    const card = learn('u99-l1-m1', ['f-u99-a'], { concepts: ['availability-zones'] })
    const u = unitWith([card, tf('u99-l1-e1', 'zones', ['f-u99-a'])], [fact('f-u99-a')])
    expect(errors(u)).toContain('"availability-zones" needs a visual (ZonesInRegion)')
    const withVisual = unitWith([{ ...card, visual: 'ZonesInRegion' }, tf('u99-l1-e1', 'zones', ['f-u99-a'])], [fact('f-u99-a')])
    expect(errors(withVisual)).toEqual([])
  })

  it('warns about long learn cards and long runs of exercises', () => {
    const long = learn('u99-l1-m1', ['f-u99-a'], { body: `${'kata '.repeat(101).trim()}.` })
    const run = Array.from({ length: 5 }, (_, i) => tf(`u99-l1-e${i + 1}`, 'zones', ['f-u99-a']))
    const warnings = validateUnits([unitWith([long, ...run], [fact('f-u99-a')])])
      .filter((i) => i.level === 'warn')
      .map((i) => i.message)
    expect(warnings).toContain('learn body should be at most about 100 words, found 101')
    expect(warnings).toContain('5 exercises in a row without a learn card between them')
  })

  it('skips retired exercises', () => {
    const retired = { ...tf('u99-l1-e1', 'zones'), retired: true, retiredReason: 'Faktanya sudah tidak berlaku.' } as LessonItem
    expect(errors(unitWith([learn('u99-l1-m1', ['f-u99-a']), retired], [fact('f-u99-a')]))).toEqual([])
  })
})

describe('admin exercise types (LANGIT_AZ104_PLAN.md section 6)', () => {
  const options = ['A', 'B', 'C', 'D']
  const base = { concept: 'zones', prompt: 'Which one?', explanation: 'Karena itu.', examReady: true }
  const shapeErrors = (item: LessonItem) => errors(unitWith([{ ...item }])).filter((m) => !m.includes('requires') && !m.includes('fact'))

  it('accepts well-formed rules, template, topology, config, and kql exercises', () => {
    const items: LessonItem[] = [
      { ...base, id: 'u99-l1-e1', type: 'rules', tables: [{ title: 'NSG', columns: ['Priority', 'Action'], rows: [['100', 'Allow']] }], options, answer: 0 },
      { ...base, id: 'u99-l1-e2', type: 'template', language: 'json', code: '{ "resources": [] }', options, answer: 1 },
      {
        ...base,
        id: 'u99-l1-e3',
        type: 'topology',
        nodes: [
          { id: 'a', label: 'VNet A' },
          { id: 'b', label: 'VNet B' },
        ],
        links: [{ from: 'a', to: 'b', kind: 'peering' }],
        options,
        answer: 2,
      },
      {
        ...base,
        id: 'u99-l1-e4',
        type: 'config',
        portal: 'Microsoft Entra admin center',
        blade: 'Create',
        fields: [
          { label: 'Region', kind: 'select', choices: ['East US', 'West Europe'] },
          { label: 'Enabled', kind: 'toggle' },
        ],
        answer: { Region: 'West Europe', Enabled: true },
      },
      { ...base, id: 'u99-l1-e5', type: 'kql', examReady: false, tokens: ['T', '| take', '10'], answer: ['T', '| take', '10'], sampleResult: [['C'], ['1']] },
    ]
    for (const item of items) expect(shapeErrors(item)).toEqual([])
  })

  it('rejects broken shapes', () => {
    const rules = { ...base, id: 'u99-l1-e1', type: 'rules', tables: [{ title: 'NSG', columns: ['Priority', 'Action'], rows: [['100']] }], options, answer: 0 } as LessonItem
    expect(shapeErrors(rules)).toContain('table "NSG" has a row with the wrong number of cells')
    const template = { ...base, id: 'u99-l1-e2', type: 'template', language: 'json', code: '{ resources: [] }', options, answer: 0 } as LessonItem
    expect(shapeErrors(template)).toContain('template code is not valid JSON')
    const topology = { ...base, id: 'u99-l1-e3', type: 'topology', nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], links: [{ from: 'a', to: 'c', kind: 'peering' }], options, answer: 0 } as LessonItem
    expect(shapeErrors(topology)).toContain('link a -> c points to a node that does not exist')
    const config = {
      ...base,
      id: 'u99-l1-e4',
      type: 'config',
      portal: 'Entra portal',
      blade: 'Create',
      fields: [
        { label: 'Region', kind: 'select', choices: ['East US', 'West Europe'] },
        { label: 'Enabled', kind: 'toggle' },
      ],
      answer: { Region: 'North Europe', Enabled: 'yes' },
    } as unknown as LessonItem
    expect(shapeErrors(config)).toEqual(
      expect.arrayContaining([
        'answer "North Europe" is not a choice of "Region"',
        'answer for toggle "Enabled" must be true or false',
        expect.stringContaining('unknown portal "Entra portal"'),
      ]),
    )
    const kql = { ...base, id: 'u99-l1-e5', type: 'kql', examReady: true, tokens: ['T'], answer: ['T', '| take'], sampleResult: [['C'], ['1']] } as LessonItem
    expect(shapeErrors(kql)).toEqual(expect.arrayContaining(['answer token "| take" is not available in tokens', 'type "kql" cannot be examReady']))
  })
})
