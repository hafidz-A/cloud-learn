import type { CourseId, PathId } from '../lib/types'
import az104 from './objectives/az104.json'
import az900 from './objectives/az900.json'

// The official skills outline of each exam (docs/RENCANA_LULUS_UJIAN.md), with
// the concept tags that teach and test every item. Exam questions only come from
// concepts in the outline, and the outline map shows how far the player is.

export type OutlineItem = { id: string; text: string; concepts: string[] }
export type OutlineGroup = { id: string; title: string; items: OutlineItem[] }
export type OutlineDomain = { path: PathId; title: string; weight: [number, number]; groups: OutlineGroup[] }
export type Outline = {
  course: CourseId
  exam: string
  /** "Skills measured as of" date of the study guide (YYYY-MM-DD). */
  version: string
  /** When the study guide was last checked for a newer version. */
  checkedAt: string
  source: string
  domains: OutlineDomain[]
  /** Concepts taught in the app that the current outline no longer lists, with the reason. */
  outOfScope: Record<string, string>
}

/** AZ-900 and AZ-104. CCNA tracks its exam topics per unit in LANGIT_CCNA_PLAN.md, not here. */
export const OUTLINES: Partial<Record<CourseId, Outline>> = { az900: az900 as unknown as Outline, az104: az104 as unknown as Outline }

export type PlacedItem = OutlineItem & { group: OutlineGroup; domain: OutlineDomain }

/** Every outline item of a course, in study guide order (none for a course without an outline). */
export function outlineItems(course: CourseId): PlacedItem[] {
  return (OUTLINES[course]?.domains ?? []).flatMap((domain) => domain.groups.flatMap((group) => group.items.map((item) => ({ ...item, group, domain }))))
}

const ITEMS_BY_CONCEPT: Partial<Record<CourseId, ReadonlyMap<string, PlacedItem[]>>> = (() => {
  const out: Partial<Record<CourseId, Map<string, PlacedItem[]>>> = {}
  for (const course of Object.keys(OUTLINES) as CourseId[]) {
    const map = new Map<string, PlacedItem[]>()
    for (const item of outlineItems(course)) for (const c of item.concepts) map.set(c, [...(map.get(c) ?? []), item])
    out[course] = map
  }
  return out
})()

/** The outline items a concept belongs to (empty when the outline does not list it). */
export function itemsForConcept(course: CourseId, concept: string): PlacedItem[] {
  return ITEMS_BY_CONCEPT[course]?.get(concept) ?? []
}

/** Whether questions about this concept can be on the real exam. Always true for a course without an outline here. */
export function inOutline(course: CourseId, concept: string): boolean {
  const map = ITEMS_BY_CONCEPT[course]
  return !map || map.has(concept)
}

export type ItemStatus = 'new' | 'practice' | 'mastered'

/** Answers needed on an item, and the share right, before it counts as mastered. */
export const MASTERY_ANSWERS = 3
export const MASTERY_RATE = 0.8

/**
 * Where the player stands on one outline item, from the concept stats of its
 * concepts: no answers yet ("new"), mastered (at least 3 answers, 80% right), or
 * still to practice.
 */
export function itemStatus(item: OutlineItem, conceptStats: Record<string, { right: number; wrong: number }>): { status: ItemStatus; right: number; total: number } {
  let right = 0
  let total = 0
  for (const c of item.concepts) {
    const s = conceptStats[c]
    if (!s) continue
    right += s.right
    total += s.right + s.wrong
  }
  const status: ItemStatus = total === 0 ? 'new' : total >= MASTERY_ANSWERS && right / total >= MASTERY_RATE ? 'mastered' : 'practice'
  return { status, right, total }
}

/** "20 Juli 2026" */
export function outlineDate(iso: string): string {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${months[m - 1]} ${y}`
}
