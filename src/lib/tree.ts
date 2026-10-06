import type { BranchKind, Lesson, Unit } from './types'

// The CCNA lesson tree (LANGIT_CCNA_PLAN.md section 4.5). Every unit is laid out
// on its own grid of five lanes: the trunk in lane 0, branches in lanes -1 and 1,
// and branches of branches in lanes -2 and 2. A branch starts level with the node
// it grows from and goes down its lane; a node's second child forks one lane
// further out. Rows are pushed down only as far as needed to keep lanes apart.

export const MAX_LANE = 2

export type NodeKind = 'trunk' | BranchKind

export type TreeCell = { lesson: Lesson; kind: NodeKind; lane: number; row: number }

/** An orthogonal line between two cells, as points in lane/row space. */
export type TreeEdge = { from: string; to: string; optional: boolean; points: [number, number][] }

export type UnitTree = { cells: TreeCell[]; edges: TreeEdge[]; rows: number }

export const kindOf = (lesson: Lesson): NodeKind => lesson.branch?.kind ?? 'trunk'

export const KIND_LABEL: Record<BranchKind, string> = { prereq: 'Prasyarat', handson: 'Hands-on', support: 'Pendukung' }

/** Lessons that grow from `id`, in file order. */
function childrenOf(unit: Unit, id: string): Lesson[] {
  return unit.lessons.filter((l) => l.branch?.from === id)
}

/** The side (1 right, -1 left) of every branch growing from a trunk lesson. The first unspecified one goes right. */
export function trunkSides(children: Lesson[]): number[] {
  const taken = new Set(children.map((c) => c.branch?.side).filter(Boolean))
  return children.map((c) => {
    if (c.branch?.side) return c.branch.side === 'left' ? -1 : 1
    const side = taken.has('right') ? 'left' : 'right'
    taken.add(side)
    return side === 'left' ? -1 : 1
  })
}

type Placed = { lesson: Lesson; lane: number; row: number; parent?: Placed }

/**
 * Lays out one trunk lesson and everything growing from it, with the trunk
 * lesson at row 0. `bottom` holds the lowest row used per lane, so far.
 */
function layoutSubtree(unit: Unit, trunk: Lesson): { placed: Placed[]; top: Map<number, number>; bottom: Map<number, number> } {
  const placed: Placed[] = []
  const top = new Map<number, number>()
  const bottom = new Map<number, number>()
  const put = (p: Placed) => {
    placed.push(p)
    if (!top.has(p.lane)) top.set(p.lane, p.row)
    top.set(p.lane, Math.min(top.get(p.lane)!, p.row))
    bottom.set(p.lane, Math.max(bottom.get(p.lane) ?? -1, p.row))
  }
  const root: Placed = { lesson: trunk, lane: 0, row: 0 }
  put(root)

  const chain = (lesson: Lesson, lane: number, minRow: number, parent: Placed) => {
    const row = Math.max(minRow, (bottom.get(lane) ?? -1) + 1)
    const node: Placed = { lesson, lane, row, parent }
    put(node)
    const [next, fork] = childrenOf(unit, lesson.id)
    const out = lane + Math.sign(lane)
    // The fork first: it starts on this row, one lane further out.
    if (fork && Math.abs(out) <= MAX_LANE) chain(fork, out, row, node)
    if (next) chain(next, lane, row + 1, node)
  }

  const branches = childrenOf(unit, trunk.id)
  const sides = trunkSides(branches)
  branches.forEach((b, i) => chain(b, sides[i], 0, root))
  return { placed, top, bottom }
}

/** Lays out one unit of the tree. Lessons that do not fit the rules (checked by the validator) are left out. */
export function layoutUnit(unit: Unit): UnitTree {
  const laneBottom = new Map<number, number>()
  const cells: TreeCell[] = []
  const edges: TreeEdge[] = []
  const cellOf = new Map<string, TreeCell>()
  let previousTrunk: TreeCell | undefined

  for (const trunk of unit.lessons.filter((l) => !l.branch)) {
    const { placed, top, bottom } = layoutSubtree(unit, trunk)
    let row = previousTrunk ? previousTrunk.row + 1 : 0
    for (const [lane, t] of top) row = Math.max(row, (laneBottom.get(lane) ?? -1) + 1 - t)
    for (const p of placed) {
      const cell: TreeCell = { lesson: p.lesson, kind: kindOf(p.lesson), lane: p.lane, row: row + p.row }
      cells.push(cell)
      cellOf.set(p.lesson.id, cell)
    }
    for (const [lane, b] of bottom) laneBottom.set(lane, Math.max(laneBottom.get(lane) ?? -1, row + b))

    const trunkCell = cellOf.get(trunk.id)!
    if (previousTrunk) edges.push({ from: previousTrunk.lesson.id, to: trunk.id, optional: false, points: [[0, previousTrunk.row], [0, trunkCell.row]] })
    for (const p of placed) {
      if (!p.parent) continue
      const a = cellOf.get(p.parent.lesson.id)!
      const b = cellOf.get(p.lesson.id)!
      const points: [number, number][] = a.row === b.row || a.lane === b.lane ? [[a.lane, a.row], [b.lane, b.row]] : [[a.lane, a.row], [b.lane, a.row], [b.lane, b.row]]
      edges.push({ from: a.lesson.id, to: b.lesson.id, optional: b.kind !== 'prereq', points })
    }
    previousTrunk = trunkCell
  }

  // Cells in play order (file order), which is also the order screen readers meet them.
  const order = new Map(unit.lessons.map((l, i) => [l.id, i]))
  cells.sort((x, y) => order.get(x.lesson.id)! - order.get(y.lesson.id)!)
  const rows = cells.reduce((n, c) => Math.max(n, c.row + 1), 0)
  return { cells, edges, rows }
}

/**
 * Problems with a unit's branches (LANGIT_CCNA_PLAN.md section 4.2), for the
 * validator: unknown or later parents, prerequisites on optional nodes or placed
 * after the trunk lesson they gate, too many children, and lanes past the edge.
 */
export function branchProblems(unit: Unit): { lesson: string; message: string }[] {
  const out: { lesson: string; message: string }[] = []
  const index = new Map(unit.lessons.map((l, i) => [l.id, i]))
  const byId = new Map(unit.lessons.map((l) => [l.id, l]))
  const laneOf = new Map<string, number>()

  unit.lessons.forEach((lesson, i) => {
    const push = (message: string) => out.push({ lesson: lesson.id, message })
    if (!lesson.branch) {
      laneOf.set(lesson.id, 0)
      const kids = childrenOf(unit, lesson.id)
      if (kids.length > 2) push(`a trunk lesson has at most 2 branches, found ${kids.length}`)
      const sides = trunkSides(kids)
      if (new Set(sides).size !== sides.length) push('two branches of this trunk lesson are on the same side')
      return
    }
    const { kind, from, side } = lesson.branch
    if (!['prereq', 'handson', 'support'].includes(kind)) return push(`unknown branch kind "${String(kind)}"`)
    const parent = byId.get(from)
    if (!parent) return push(`branch grows from "${from}", which is not a lesson of this unit`)
    if (index.get(from)! >= i) return push(`branch grows from "${from}", which comes later in the unit`)
    if (kind === 'prereq' && parent.branch && parent.branch.kind !== 'prereq') push('a prerequisite cannot grow from an optional branch')
    if (side !== undefined && parent.branch) push('only branches that grow from the trunk may choose a side')
    if (side !== undefined && side !== 'left' && side !== 'right') push(`side must be "left" or "right"`)

    const parentLane = laneOf.get(from) ?? 0
    let lane: number
    if (!parent.branch) {
      const siblings = childrenOf(unit, from)
      lane = trunkSides(siblings)[siblings.indexOf(lesson)]
    } else {
      const siblings = childrenOf(unit, from)
      const at = siblings.indexOf(lesson)
      if (at > 1) push(`a branch lesson has at most 2 children ("${from}" has ${siblings.length})`)
      lane = at === 0 ? parentLane : parentLane + Math.sign(parentLane)
    }
    if (Math.abs(lane) > MAX_LANE) push(`branch goes past lane ${MAX_LANE}: fork it from a node closer to the trunk`)
    laneOf.set(lesson.id, lane)

    if (kind === 'prereq') {
      // The trunk lesson after this branch's trunk root waits for it, so it must come before that one.
      let root = parent
      while (root.branch) root = byId.get(root.branch.from) ?? root
      const nextTrunk = unit.lessons.slice(index.get(root.id)! + 1).find((l) => !l.branch)
      if (nextTrunk && index.get(nextTrunk.id)! < i) push(`a prerequisite must come before "${nextTrunk.id}", the trunk lesson that waits for it`)
    }
  })
  return out
}

/**
 * The prerequisite branch a skip test covers: the lesson and every prerequisite
 * growing from it, in play order. Undefined when `lessonId` is not the first
 * lesson of a prerequisite branch (one that grows from the trunk).
 */
export function prereqBranch(unit: Unit, lessonId: string): Lesson[] | undefined {
  const first = unit.lessons.find((l) => l.id === lessonId)
  if (!first || first.branch?.kind !== 'prereq') return undefined
  const parent = unit.lessons.find((l) => l.id === first.branch!.from)
  if (!parent || parent.branch) return undefined
  const ids = new Set([first.id])
  for (const l of unit.lessons) if (l.branch?.kind === 'prereq' && ids.has(l.branch.from)) ids.add(l.id)
  return unit.lessons.filter((l) => ids.has(l.id))
}
