import { describe, expect, it } from 'vitest'
import { addDays, daysBetween } from './date'
import { dueIds, scheduleReview } from './review'
import { bumpStreak, liveStreak } from './streak'

describe('dates', () => {
  it('adds days across month and year ends', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(daysBetween('2026-02-27', '2026-03-02')).toBe(3)
  })
})

describe('streak', () => {
  const empty = { current: 0, best: 0, lastDay: '' }
  it('starts at 1, grows on consecutive days, and ignores a second lesson the same day', () => {
    let s = bumpStreak(empty, '2026-09-01')
    s = bumpStreak(s, '2026-09-01')
    s = bumpStreak(s, '2026-09-02')
    expect(s).toEqual({ current: 2, best: 2, lastDay: '2026-09-02' })
  })
  it('restarts after a skipped day but keeps the best', () => {
    let s = bumpStreak(bumpStreak(empty, '2026-09-01'), '2026-09-02')
    s = bumpStreak(s, '2026-09-04')
    expect(s).toEqual({ current: 1, best: 2, lastDay: '2026-09-04' })
  })
  it('shows 0 once a whole day was skipped', () => {
    const s = { current: 5, best: 5, lastDay: '2026-09-01' }
    expect(liveStreak(s, '2026-09-02')).toBe(5)
    expect(liveStreak(s, '2026-09-03')).toBe(0)
  })
})

describe('review queue', () => {
  it('walks 1, 3, 7 days and clears after 3 right answers in a row', () => {
    const today = '2026-09-10'
    const a = scheduleReview(undefined, false, today)
    expect(a).toEqual({ dueDay: '2026-09-11', correctStreak: 0 })
    const b = scheduleReview(a!, true, '2026-09-11')
    expect(b).toEqual({ dueDay: '2026-09-14', correctStreak: 1 })
    const c = scheduleReview(b!, true, '2026-09-14')
    expect(c).toEqual({ dueDay: '2026-09-21', correctStreak: 2 })
    expect(scheduleReview(c!, true, '2026-09-21')).toBeNull()
  })
  it('a miss starts the ladder again', () => {
    expect(scheduleReview({ dueDay: '2026-09-10', correctStreak: 2 }, false, '2026-09-10')).toEqual({
      dueDay: '2026-09-11',
      correctStreak: 0,
    })
  })
  it('lists due items, oldest first', () => {
    const review = {
      a: { dueDay: '2026-09-12', correctStreak: 0 },
      b: { dueDay: '2026-09-09', correctStreak: 1 },
      c: { dueDay: '2026-09-10', correctStreak: 0 },
    }
    expect(dueIds(review, '2026-09-10')).toEqual(['b', 'c'])
  })
})
