import { describe, expect, it } from 'vitest'
import { EXERCISES } from '../content/course'
import { addDays, dayKey } from '../lib/date'
import { practicePlan } from './plans'

const [first, second] = [...EXERCISES.keys()]
const tomorrow = () => addDays(dayKey(), 1)

describe('practicePlan', () => {
  it('is empty before any lesson or mistake', () => {
    expect(practicePlan({ review: {}, lessonsDone: {} }).items).toEqual([])
  })

  it('offers mistakes that are not due yet, so hearts can be refilled before the first lesson is done', () => {
    const review = { [first]: { dueDay: tomorrow(), correctStreak: 0 }, [second]: { dueDay: tomorrow(), correctStreak: 0 } }
    const items = practicePlan({ review, lessonsDone: {} }).items
    expect(items.map((i) => i.item.id).sort()).toEqual([first, second].sort())
    // Played as plain practice, so the review ladder is left alone.
    expect(items.every((i) => !i.fromReview)).toBe(true)
  })

  it('puts due items first and marks them as review', () => {
    const review = { [first]: { dueDay: tomorrow(), correctStreak: 0 }, [second]: { dueDay: dayKey(), correctStreak: 1 } }
    const items = practicePlan({ review, lessonsDone: {} }).items
    expect(items[0]).toMatchObject({ item: { id: second }, fromReview: true })
    expect(items[1]).toMatchObject({ item: { id: first } })
    expect(items[1].fromReview).toBeFalsy()
  })
})
