import { describe, expect, it } from 'vitest'
import { isExamQuestion } from '../exam/examLogic'
import type { CourseId, Exercise } from '../lib/types'
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

/** What every outline item needs (docs/RENCANA_LULUS_UJIAN.md section 2). */
const STANDARD = { cards: 1, exercises: 8, examReady: 6, scenarios: 3, trueFalseShare: 1 / 3 }

/** Exam-style scenario wording, such as "A company needs... What should you use?". */
const SCENARIO = /\b(company|You need|you need|must|wants|plans?|A team|An admin|Your|users? (in|at)|requirement|least|minimi[sz]e|should you)\b/

/** Every outline item of a course that falls short of the standard, with what it has. */
function belowStandard(course: CourseId): string[] {
  const cards = new Map<string, number>()
  const exercises = new Map<string, Exercise[]>()
  const addExercise = (e: Exercise) => exercises.set(e.concept, [...(exercises.get(e.concept) ?? []), e])
  for (const unit of ALL_UNITS.filter((u) => courseOf(u.id) === course))
    for (const lesson of unit.lessons)
      for (const item of lesson.items) {
        if (item.type === 'learn') item.concepts.forEach((c) => cards.set(c, (cards.get(c) ?? 0) + 1))
        else if (item.type === 'intro') cards.set(item.concept, (cards.get(item.concept) ?? 0) + 1)
        else if (!item.retired) addExercise(item)
      }
  if (course === 'az104') for (const cs of CASE_STUDIES) cs.questions.forEach(addExercise)

  const out: string[] = []
  for (const item of outlineItems(course)) {
    const all = item.concepts.flatMap((c) => exercises.get(c) ?? [])
    const ready = all.filter(isExamQuestion)
    const scenarios = ready.filter((e) => SCENARIO.test(`${e.prompt} ${'scenario' in e ? e.scenario : ''}`)).length
    const trueFalse = ready.filter((e) => e.type === 'truefalse').length
    const cardCount = item.concepts.reduce((n, c) => n + (cards.get(c) ?? 0), 0)
    const ok =
      cardCount >= STANDARD.cards &&
      all.length >= STANDARD.exercises &&
      ready.length >= STANDARD.examReady &&
      scenarios >= STANDARD.scenarios &&
      trueFalse <= ready.length * STANDARD.trueFalseShare
    if (!ok) out.push(`${item.id}: ${cardCount} cards, ${all.length} exercises, ${ready.length} exam-ready, ${scenarios} scenarios, ${trueFalse} true/false`)
  }
  return out
}

describe.each(['az900', 'az104'] as CourseId[])('%s outline', (course) => {
  const outline = OUTLINES[course]!

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

  it('meets the standard on every outline item: a card, 8 exercises, 6 exam-ready, 3 scenarios, at most 1/3 true/false', () => {
    expect(belowStandard(course)).toEqual([])
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
