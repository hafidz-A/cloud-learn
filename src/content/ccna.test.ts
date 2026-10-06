import { describe, expect, it } from 'vitest'
import plan from '../../LANGIT_CCNA_PLAN.md?raw'
import type { Exercise, Fact, LearnCard, Unit } from '../lib/types'
import { AZ104_UNITS, CCNA_UNITS, UNITS, courseOf, isExercise } from './course'
import { GLOSSARY } from './glossary'
import { LABS } from './labs'
import { glossaryGaps, validateLabs, validateUnits, type Issue } from './validate'

/** Errors that count: coverage errors only in units that have their facts list (as in validate.test.ts). */
function blockingErrors(issues: Issue[], units: Unit[]): Issue[] {
  const reworked = new Set(units.filter((u) => Array.isArray(u.facts)).map((u) => u.id))
  return issues.filter((i) => i.level === 'error' && (!i.coverage || (i.unit !== undefined && reworked.has(i.unit))))
}

/** The tree in the plan's curriculum tables (section 6): per unit, each lesson's title, kind, and parent. */
function planTree(): { unit: number; path: number; title: string; lessons: { title: string; kind: string; from?: number }[] }[] {
  const out: ReturnType<typeof planTree> = []
  let path = 0
  for (const block of plan.split('\n**Unit ').slice(1)) {
    const before = plan.slice(0, plan.indexOf(block))
    path = Number([...before.matchAll(/### Jalur (\d)/g)].at(-1)?.[1] ?? path)
    const head = /^(\d+)\. (.+?)\*\*/.exec(block)!
    const lessons = [...block.matchAll(/^\| (\d+)\. (.+?) \| ([TPHS]) \| (\d*)/gm)].map((m) => ({
      title: m[2],
      kind: { T: 'trunk', P: 'prereq', H: 'handson', S: 'support' }[m[3]]!,
      ...(m[4] ? { from: Number(m[4]) } : {}),
    }))
    out.push({ unit: Number(head[1]), path, title: head[2], lessons })
  }
  return out
}

describe('CCNA content (LANGIT_CCNA_PLAN.md)', () => {
  const issues = validateUnits(CCNA_UNITS, 'ccna')

  it('has the 28 units and 156 lessons of the plan, on the 5 paths, with the same tree', () => {
    const tree = planTree()
    expect(tree).toHaveLength(28)
    expect(CCNA_UNITS.map((u) => u.id.slice(0, 8))).toEqual(tree.map((t) => `ccna-u${String(t.unit).padStart(2, '0')}`))
    expect(CCNA_UNITS.map((u) => u.path)).toEqual(tree.map((t) => t.path))
    expect(CCNA_UNITS.flatMap((u) => u.lessons)).toHaveLength(156)
    CCNA_UNITS.forEach((unit, i) => {
      const prefix = unit.id.slice(0, 8)
      expect(unit.title, unit.id).toBe(tree[i].title)
      expect(
        unit.lessons.map((l) => ({ title: l.title, kind: l.branch?.kind ?? 'trunk', ...(l.branch ? { from: Number(l.branch.from.replace(`${prefix}-l`, '')) } : {}) })),
        unit.id,
      ).toEqual(tree[i].lessons)
    })
  })

  it('has no content errors, and every id starts with "ccna-"', () => {
    const warnings = issues.filter((i) => i.level === 'warn')
    if (warnings.length) console.warn(warnings.map((w) => `warn  ${w.where}: ${w.message}`).join('\n'))
    expect(blockingErrors(issues, CCNA_UNITS)).toEqual([])
    const ids = CCNA_UNITS.flatMap((u) => [u.id, ...(u.facts ?? []).map((f) => f.id), ...u.lessons.flatMap((l) => [l.id, ...l.items.map((i) => i.id)])])
    expect(ids.filter((id) => courseOf(id) !== 'ccna')).toEqual([])
  })

  it('shares no id with the Azure courses', () => {
    const azure = new Set([...UNITS, ...AZ104_UNITS].flatMap((u) => [u.id, ...u.lessons.flatMap((l) => [l.id, ...l.items.map((i) => i.id)])]))
    expect(CCNA_UNITS.flatMap((u) => [u.id, ...u.lessons.flatMap((l) => [l.id, ...l.items.map((i) => i.id)])]).filter((id) => azure.has(id))).toEqual([])
  })

  it('expands every abbreviation on first use, and explains it in the glossary', () => {
    expect(issues.filter((i) => i.message.startsWith('expand on first use'))).toEqual([])
    expect(glossaryGaps(CCNA_UNITS, new Set(GLOSSARY.map((g) => g.term)))).toEqual([])
  })

  it('has a valid Packet Tracer lab for every written hands-on lesson (section 8)', () => {
    const issues = validateLabs(LABS, CCNA_UNITS)
    const warnings = issues.filter((i) => i.level === 'warn')
    if (warnings.length) console.warn(warnings.map((w) => `warn  ${w.where}: ${w.message}`).join('\n'))
    expect(issues.filter((i) => i.level === 'error')).toEqual([])
  })

  it('marks at least 30% of the exercises of every written unit examReady', () => {
    for (const unit of CCNA_UNITS) {
      const exercises = unit.lessons.flatMap((l) => l.items).filter(isExercise).filter((e) => !e.retired)
      if (exercises.length === 0) continue
      expect(exercises.filter((e) => e.examReady).length / exercises.length, unit.id).toBeGreaterThanOrEqual(0.3)
    }
  })
})

describe('CCNA rules in the validator (LANGIT_CCNA_PLAN.md sections 4.2 and 5)', () => {
  const fact = (id: string, source = 'https://www.cisco.com/c/en/us/support/docs/x.html'): Fact => ({ id, statement: 'Sebuah fakta.', source })
  const card = (id: string, teaches: string[]): LearnCard => ({ id, type: 'learn', concepts: ['x'], title: 'X', body: 'Satu. Dua. Tiga.', keyPoints: ['a', 'b'], teaches })
  const tf = (id: string, requires: string[]): Exercise => ({ id, type: 'truefalse', concept: 'x', prompt: 'p', explanation: 'e', answer: true, requires })
  const errors = (u: Unit) => validateUnits([u], 'ccna').filter((i) => i.level === 'error').map((i) => i.message)

  it('rejects a required lesson that needs a fact only taught in an optional branch', () => {
    const u: Unit = {
      id: 'ccna-u99-test',
      path: 1,
      title: 'Test',
      facts: [fact('ccna-f-u99-a'), fact('ccna-f-u99-b')],
      lessons: [
        { id: 'ccna-u99-l1', title: 'A', items: [card('ccna-u99-l1-m1', ['ccna-f-u99-a']), tf('ccna-u99-l1-e1', ['ccna-f-u99-a'])] },
        { id: 'ccna-u99-l2', title: 'B', branch: { kind: 'support', from: 'ccna-u99-l1' }, items: [card('ccna-u99-l2-m1', ['ccna-f-u99-b']), tf('ccna-u99-l2-e1', ['ccna-f-u99-b'])] },
        { id: 'ccna-u99-l3', title: 'C', items: [tf('ccna-u99-l3-e1', ['ccna-f-u99-b'])] },
      ],
    }
    expect(errors(u)).toEqual(['fact "ccna-f-u99-b" is only taught in an optional branch, which the player may skip'])
    // The same fact taught in a prerequisite is fine.
    const prereq = structuredClone(u)
    prereq.lessons[1].branch = { kind: 'prereq', from: 'ccna-u99-l1' }
    expect(errors(prereq)).toEqual([])
  })

  it('accepts Cisco, IETF, IEEE, and Ansible sources, and rejects others', () => {
    const u = (source: string): Unit => ({
      id: 'ccna-u99-test',
      path: 1,
      title: 'Test',
      facts: [fact('ccna-f-u99-a', source)],
      lessons: [{ id: 'ccna-u99-l1', title: 'A', items: [card('ccna-u99-l1-m1', ['ccna-f-u99-a']), tf('ccna-u99-l1-e1', ['ccna-f-u99-a'])] }],
    })
    for (const ok of [
      'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/x.html',
      'https://developer.cisco.com/docs/modeling-labs/cml-free/',
      'https://www.rfc-editor.org/rfc/rfc1918',
      'https://datatracker.ietf.org/doc/html/rfc5952',
      'https://standards.ieee.org/ieee/802.1Q/10323/',
      'https://docs.ansible.com/ansible/latest/collections/cisco/ios/index.html',
    ])
      expect(errors(u(ok)), ok).toEqual([])
    expect(errors(u('https://learn.microsoft.com/en-us/azure/x'))).toHaveLength(1)
    expect(errors(u('https://example.com/ccna-notes'))).toHaveLength(1)
  })

  it('rejects branches outside CCNA', () => {
    const az: Unit = { id: 'u99-test', path: 1, title: 'T', lessons: [{ id: 'u99-l1', title: 'A', items: [] }, { id: 'u99-l2', title: 'B', branch: { kind: 'support', from: 'u99-l1' }, items: [] }] }
    expect(validateUnits([az]).map((i) => i.message)).toContain('only CCNA lessons can be branches')
  })
})
