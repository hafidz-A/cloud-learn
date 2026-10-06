import { describe, expect, it } from 'vitest'
import type { CourseId } from '../lib/types'
import { ALL_UNITS, CASE_STUDIES, COURSES, courseOf } from './course'
import { OUTLINES, inOutline, itemStatus, outlineItems } from './objectives'

// The official skills outlines (docs/RENCANA_LULUS_UJIAN.md).

/** Concept tags of a course's learn cards and exercises, retired exercises left out. */
function conceptsOf(course: CourseId): Set<string> {
  const out = new Set<string>()
  for (const unit of ALL_UNITS.filter((u) => courseOf(u.id) === course))
    for (const lesson of unit.lessons)
      for (const item of lesson.items) {
        if (item.type === 'learn') item.concepts.forEach((c) => out.add(c))
        else if (item.type === 'intro') out.add(item.concept)
        else if (!item.retired) out.add(item.concept)
      }
  if (course === 'az104') for (const cs of CASE_STUDIES) cs.questions.forEach((q) => out.add(q.concept))
  return out
}

describe.each(['az900', 'az104'] as CourseId[])('%s outline', (course) => {
  const outline = OUTLINES[course]

  it('covers every domain of the course, with unique item ids', () => {
    expect(outline.domains.map((d) => d.path).sort()).toEqual(COURSES[course].paths.map((p) => p.id))
    const ids = outlineItems(course).map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(outline.version).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(outline.source).toMatch(/^https:\/\/learn\.microsoft\.com\//)
  })

  it('maps every concept of the course to an outline item, or says why it is outside the outline', () => {
    const unmapped = [...conceptsOf(course)].filter((c) => !inOutline(course, c) && !(c in outline.outOfScope))
    expect(unmapped).toEqual([])
  })
})

describe('itemStatus', () => {
  const item = { id: 'x', text: 'x', concepts: ['a', 'b'] }
  it('is new without answers, mastered at 3 answers and 80% right, else practice', () => {
    expect(itemStatus(item, {}).status).toBe('new')
    expect(itemStatus(item, { a: { right: 2, wrong: 0 } }).status).toBe('practice')
    expect(itemStatus(item, { a: { right: 2, wrong: 0 }, b: { right: 1, wrong: 1 } }).status).toBe('practice')
    expect(itemStatus(item, { a: { right: 4, wrong: 0 }, b: { right: 4, wrong: 1 } }).status).toBe('mastered')
  })
})
