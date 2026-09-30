import { describe, expect, it } from 'vitest'
import { COURSES, EXERCISES, caseStudyOf } from '../content/course'
import { addDays, dayKey } from '../lib/date'
import { PLACEMENT_PER_UNIT, placementPlan, practicePlan } from './plans'

const [first, second] = [...EXERCISES.keys()]
const tomorrow = () => addDays(dayKey(), 1)

describe('practicePlan', () => {
  it('is empty before any lesson or mistake', () => {
    expect(practicePlan('az900', { review: {}, lessonsDone: {} }).items).toEqual([])
  })

  it('offers mistakes that are not due yet, so hearts can be refilled before the first lesson is done', () => {
    const review = { [first]: { dueDay: tomorrow(), correctStreak: 0 }, [second]: { dueDay: tomorrow(), correctStreak: 0 } }
    const items = practicePlan('az900', { review, lessonsDone: {} }).items
    expect(items.map((i) => i.item.id).sort()).toEqual([first, second].sort())
    // Played as plain practice, so the review ladder is left alone.
    expect(items.every((i) => !i.fromReview)).toBe(true)
  })

  it('puts due items first and marks them as review', () => {
    const review = { [first]: { dueDay: tomorrow(), correctStreak: 0 }, [second]: { dueDay: dayKey(), correctStreak: 1 } }
    const items = practicePlan('az900', { review, lessonsDone: {} }).items
    expect(items[0]).toMatchObject({ item: { id: second }, fromReview: true })
    expect(items[1]).toMatchObject({ item: { id: first } })
    expect(items[1].fromReview).toBeFalsy()
  })
})

describe('placementPlan (LANGIT_AZ104_PLAN.md section 3)', () => {
  it('asks 30 exam-ready AZ-104 questions, 2 from every unit, in course order', () => {
    const { kind, items } = placementPlan()
    expect(kind).toBe('placement')
    expect(items).toHaveLength(30)
    const units = items.map(({ item }) => EXERCISES.get(item.id)!.unit.id)
    for (const unit of COURSES.az104.units) expect(units.filter((u) => u === unit.id)).toHaveLength(PLACEMENT_PER_UNIT)
    expect(units).toEqual([...units].sort())
    for (const { item } of items) {
      expect(item.type === 'learn' || item.type === 'intro').toBe(false)
      if (item.type !== 'learn' && item.type !== 'intro') expect(item.examReady).toBe(true)
      expect(caseStudyOf(item.id)).toBeUndefined()
    }
  })

  it('uses true/false only when a unit has too few other questions', () => {
    for (let i = 0; i < 5; i++) expect(placementPlan().items.filter(({ item }) => item.type === 'truefalse')).toEqual([])
  })
})
