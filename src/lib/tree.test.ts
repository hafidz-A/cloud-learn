import { describe, expect, it } from 'vitest'
import type { Checkpoint, PathInfo } from '../content/course'
import { shapeStates, lockReason, type CourseShape } from './path'
import { branchProblems, layoutUnit, prereqBranch } from './tree'
import type { BranchKind, Lesson, Unit } from './types'

// A lesson with one exercise, so it is playable; `branch` makes it a branch.
const lesson = (n: number, branch?: { kind: BranchKind; from: number; side?: 'left' | 'right' }): Lesson => ({
  id: `ccna-u01-l${n}`,
  title: `Lesson ${n}`,
  items: [{ id: `ccna-u01-l${n}-e1`, type: 'truefalse', concept: 'x', prompt: 'p', explanation: 'e', answer: true }],
  ...(branch ? { branch: { kind: branch.kind, from: `ccna-u01-l${branch.from}`, ...(branch.side ? { side: branch.side } : {}) } } : {}),
})
const unit = (lessons: Lesson[], path = 1, id = 'ccna-u01-test'): Unit => ({ id, path, title: 'Test', lessons })
const at = (u: Unit) => Object.fromEntries(layoutUnit(u).cells.map((c) => [c.lesson.id.replace('ccna-u01-', ''), [c.lane, c.row]]))

describe('layoutUnit', () => {
  it('puts a unit without branches straight down the trunk', () => {
    expect(at(unit([lesson(1), lesson(2), lesson(3)]))).toEqual({ l1: [0, 0], l2: [0, 1], l3: [0, 2] })
  })

  it('starts a branch level with its trunk lesson, and runs a chain down its lane', () => {
    const u = unit([lesson(1), lesson(2, { kind: 'prereq', from: 1 }), lesson(3), lesson(4, { kind: 'handson', from: 3 }), lesson(5, { kind: 'handson', from: 4 })])
    expect(at(u)).toEqual({ l1: [0, 0], l2: [1, 0], l3: [0, 1], l4: [1, 1], l5: [1, 2] })
    const tree = layoutUnit(u)
    expect(tree.rows).toBe(3)
    expect(tree.edges.find((e) => e.to === 'ccna-u01-l2')).toMatchObject({ optional: false, points: [[0, 0], [1, 0]] })
    expect(tree.edges.find((e) => e.to === 'ccna-u01-l5')).toMatchObject({ optional: true, points: [[1, 1], [1, 2]] })
    expect(tree.edges.find((e) => e.to === 'ccna-u01-l3')).toMatchObject({ points: [[0, 0], [0, 1]] })
  })

  it('pushes a trunk lesson down until its branch lane is free', () => {
    // l2 -> l3 runs down lane 1 for two rows, so l5 (the next trunk lesson with a right branch) waits below it.
    const u = unit([lesson(1), lesson(2, { kind: 'handson', from: 1 }), lesson(3, { kind: 'handson', from: 2 }), lesson(4), lesson(5), lesson(6, { kind: 'support', from: 5 })])
    expect(at(u)).toEqual({ l1: [0, 0], l2: [1, 0], l3: [1, 1], l4: [0, 1], l5: [0, 2], l6: [1, 2] })
    const v = unit([lesson(1), lesson(2, { kind: 'handson', from: 1 }), lesson(3, { kind: 'handson', from: 2 }), lesson(4, { kind: 'handson', from: 3 }), lesson(5), lesson(6, { kind: 'support', from: 5 })])
    // The trunk itself moves down, so the branch still starts level with it and no line crosses another node.
    expect(at(v)).toMatchObject({ l4: [1, 2], l5: [0, 3], l6: [1, 3] })
    expect(layoutUnit(v).edges.find((e) => e.to === 'ccna-u01-l6')!.points).toEqual([[0, 3], [1, 3]])
    expect(layoutUnit(v).edges.find((e) => e.to === 'ccna-u01-l5')!.points).toEqual([[0, 0], [0, 3]])
  })

  it('puts a second trunk branch on the other side, and forks a branch one lane further out', () => {
    const u = unit([lesson(1), lesson(2, { kind: 'support', from: 1 }), lesson(3, { kind: 'handson', from: 1 }), lesson(4, { kind: 'handson', from: 3 }), lesson(5, { kind: 'support', from: 3 })])
    expect(at(u)).toEqual({ l1: [0, 0], l2: [1, 0], l3: [-1, 0], l4: [-1, 1], l5: [-2, 0] })
    const left = unit([lesson(1), lesson(2, { kind: 'support', from: 1, side: 'left' }), lesson(3, { kind: 'handson', from: 1 })])
    expect(at(left)).toEqual({ l1: [0, 0], l2: [-1, 0], l3: [1, 0] })
  })

  it('lists cells in play order (file order)', () => {
    const u = unit([lesson(1), lesson(2, { kind: 'prereq', from: 1 }), lesson(3)])
    expect(layoutUnit(u).cells.map((c) => c.kind)).toEqual(['trunk', 'prereq', 'trunk'])
  })
})

describe('branchProblems', () => {
  const problems = (u: Unit) => branchProblems(u).map((p) => `${p.lesson.replace('ccna-u01-', '')}: ${p.message}`)

  it('accepts a well-formed tree', () => {
    expect(problems(unit([lesson(1), lesson(2, { kind: 'prereq', from: 1 }), lesson(3), lesson(4, { kind: 'handson', from: 3 }), lesson(5, { kind: 'handson', from: 4 })]))).toEqual([])
  })

  it('rejects unknown and later parents, prerequisites on optional branches, and prerequisites after the lesson they gate', () => {
    const bad = unit([
      lesson(1),
      lesson(2, { kind: 'handson', from: 9 }),
      lesson(3, { kind: 'support', from: 4 }),
      lesson(4),
      lesson(5, { kind: 'handson', from: 4 }),
      lesson(6, { kind: 'prereq', from: 5 }),
      lesson(7),
      lesson(8, { kind: 'prereq', from: 4 }),
    ])
    const found = problems(bad)
    expect(found).toContain('l2: branch grows from "ccna-u01-l9", which is not a lesson of this unit')
    expect(found).toContain('l3: branch grows from "ccna-u01-l4", which comes later in the unit')
    expect(found).toContain('l6: a prerequisite cannot grow from an optional branch')
    expect(found).toContain('l8: a prerequisite must come before "ccna-u01-l7", the trunk lesson that waits for it')
  })

  it('rejects two branches on one side, a third branch, and lanes past the edge', () => {
    expect(problems(unit([lesson(1), lesson(2, { kind: 'support', from: 1, side: 'left' }), lesson(3, { kind: 'handson', from: 1, side: 'left' })]))).toContain(
      'l1: two branches of this trunk lesson are on the same side',
    )
    const deep = unit([lesson(1), lesson(2, { kind: 'support', from: 1 }), lesson(3, { kind: 'support', from: 2 }), lesson(4, { kind: 'support', from: 2 }), lesson(5, { kind: 'support', from: 4 }), lesson(6, { kind: 'support', from: 4 })])
    expect(problems(deep)).toContain('l6: branch goes past lane 2: fork it from a node closer to the trunk')
    const three = unit([lesson(1), lesson(2, { kind: 'support', from: 1 }), lesson(3, { kind: 'support', from: 1 }), lesson(4, { kind: 'support', from: 1 })])
    expect(problems(three)).toContain('l1: a trunk lesson has at most 2 branches, found 3')
  })
})

describe('prereqBranch', () => {
  it('collects a prerequisite branch from its first lesson', () => {
    const u = unit([lesson(1), lesson(2, { kind: 'prereq', from: 1 }), lesson(3, { kind: 'prereq', from: 2 }), lesson(4, { kind: 'support', from: 2 }), lesson(5)])
    expect(prereqBranch(u, 'ccna-u01-l2')?.map((l) => l.id)).toEqual(['ccna-u01-l2', 'ccna-u01-l3'])
    expect(prereqBranch(u, 'ccna-u01-l3')).toBeUndefined()
    expect(prereqBranch(u, 'ccna-u01-l1')).toBeUndefined()
  })
})

describe('shapeStates with branches (LANGIT_CCNA_PLAN.md section 4.3)', () => {
  const paths: PathInfo[] = [
    { id: 1, title: 'A', short: 'A', domain: 'A', weight: [50, 50] },
    { id: 2, title: 'B', short: 'B', domain: 'B', weight: [50, 50] },
  ]
  const checkpoints: Checkpoint[] = [
    { id: 'ccna-cp1', path: 1, title: 'Checkpoint jalur 1', questionCount: 20 },
    { id: 'ccna-cp2', path: 2, title: 'Checkpoint jalur 2', questionCount: 20 },
  ]
  const u = unit([lesson(1), lesson(2, { kind: 'prereq', from: 1 }), lesson(3), lesson(4, { kind: 'handson', from: 3 }), lesson(5, { kind: 'support', from: 3 })])
  const shape: CourseShape = { paths, units: [u], checkpoints, hasExercises: (p) => p === 1 }
  const done = (...ns: number[]) => Object.fromEntries(ns.map((n) => [`ccna-u01-l${n}`, { bestAccuracy: 1, completedAt: '2026-10-03T00:00:00Z', count: 1 }]))
  const states = (lessonsDone: ReturnType<typeof done>) => {
    const s = shapeStates(shape, { lessonsDone, checkpoints: {} })
    return Object.fromEntries(Object.entries(s.lessons).map(([id, st]) => [id.replace('ccna-u01-', ''), st]))
  }

  it('holds the next trunk lesson until the prerequisite branch is done', () => {
    expect(states(done())).toEqual({ l1: 'active', l2: 'locked', l3: 'locked', l4: 'locked', l5: 'locked' })
    expect(states(done(1))).toEqual({ l1: 'done', l2: 'active', l3: 'locked', l4: 'locked', l5: 'locked' })
    expect(states(done(1, 2))).toMatchObject({ l2: 'done', l3: 'active' })
  })

  it('opens optional branches without making them the next lesson, and lets the checkpoint go first', () => {
    const s = shapeStates(shape, { lessonsDone: done(1, 2, 3), checkpoints: {} })
    expect(s.lessons['ccna-u01-l4']).toBe('open')
    expect(s.lessons['ccna-u01-l5']).toBe('open')
    expect(s.checkpoints['ccna-cp1']).toBe('active')
    expect(s.checkpoints['ccna-cp2']).toBe('soon')
  })

  it('says why a lesson is locked', () => {
    const s = shapeStates(shape, { lessonsDone: done(1), checkpoints: {} })
    expect(lockReason(u, 'ccna-u01-l3', s, true)).toBe('Selesaikan cabang prasyarat "Lesson 2" dulu, atau lewati dengan tes lompat.')
    expect(lockReason(u, 'ccna-u01-l4', s, true)).toBe('Selesaikan "Lesson 3" dulu untuk membuka cabang ini.')
    expect(lockReason(u, 'ccna-u01-l4', s, false)).toBe('Lulus checkpoint jalur sebelumnya dulu untuk membuka jalur ini.')
  })
})
