import { describe, expect, it } from 'vitest'
import type { LessonItem } from '../lib/types'
import { advance, answerCurrent, currentEntry, firstTryResults, progressOf, readIntro, startSession, type Session } from './session'

const intro: LessonItem = { id: 'x-i1', type: 'intro', concept: 'c', title: 'C', body: 'Kenalan.' }
const tf = (n: number): LessonItem => ({ id: `x-e${n}`, type: 'truefalse', concept: 'c', prompt: 'P', explanation: 'E', answer: true })

/** Plays the whole queue: answers from `answers` in order, reads intro cards. */
function play(items: LessonItem[], answers: boolean[]) {
  let s: Session | null = startSession(items)
  const seen: string[] = []
  let last: Session = s
  while (s) {
    const entry = currentEntry(s)
    seen.push(entry.retry ? `${entry.item.id} (retry)` : entry.item.id)
    s = entry.item.type === 'intro' ? readIntro(s) : answerCurrent(s, answers.shift()!)
    last = s
    s = advance(s)
  }
  return { seen, last }
}

describe('lesson session', () => {
  it('plays intro cards and exercises in order when every answer is right', () => {
    const { seen, last } = play([intro, tf(1), tf(2)], [true, true])
    expect(seen).toEqual(['x-i1', 'x-e1', 'x-e2'])
    expect(progressOf(last)).toBe(1)
    expect(firstTryResults(last)).toEqual([true, true])
  })

  it('repeats a wrong exercise at the end until it is right', () => {
    const { seen, last } = play([intro, tf(1), tf(2)], [false, true, false, true])
    expect(seen).toEqual(['x-i1', 'x-e1', 'x-e2', 'x-e1 (retry)', 'x-e1 (retry)'])
    expect(firstTryResults(last)).toEqual([false, true])
    expect(progressOf(last)).toBe(1)
  })

  it('does not move the progress bar on a wrong answer', () => {
    let s = readIntro(startSession([intro, tf(1)]))
    s = advance(s)!
    const before = progressOf(s)
    s = answerCurrent(s, false)
    expect(progressOf(s)).toBe(before)
    expect(advance(s)).not.toBeNull() // the retry is still ahead
  })
})
