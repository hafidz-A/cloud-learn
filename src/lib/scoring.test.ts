import { describe, expect, it } from 'vitest'
import { summarizeLesson } from './scoring'

describe('summarizeLesson', () => {
  it('gives 10 XP plus a 5 XP bonus for a flawless lesson', () => {
    expect(summarizeLesson('u04-l1', [true, true, true], 1000)).toMatchObject({ xp: 15, accuracy: 1, correct: 3 })
  })

  it('gives 10 XP when there was at least one mistake', () => {
    expect(summarizeLesson('u04-l1', [true, false, true, true], 1000)).toMatchObject({ xp: 10, accuracy: 0.75 })
  })
})
