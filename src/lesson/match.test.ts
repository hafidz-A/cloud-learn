import { describe, expect, it } from 'vitest'
import { createMatchState, isMatchDone, tapCard } from './match'

const pairs: [string, string][] = [
  ['Region', 'Geographic area'],
  ['Availability zone', 'Separate datacenter'],
]

describe('match exercise', () => {
  it('locks in a right pair from either side', () => {
    let s = createMatchState(pairs)
    s = tapCard(s, 'R1')
    s = tapCard(s, 'L1')
    expect(s.matched).toEqual([1])
    expect(s.flash).toEqual({ ids: ['R1', 'L1'], ok: true })
    expect(s.mistakes).toBe(0)
  })

  it('counts a wrong pair as a mistake and clears the selection', () => {
    let s = createMatchState(pairs)
    s = tapCard(s, 'L0')
    s = tapCard(s, 'R1')
    expect(s.matched).toEqual([])
    expect(s.mistakes).toBe(1)
    expect(s.selected).toBeNull()
  })

  it('switches selection within the same side and toggles off on a second tap', () => {
    let s = createMatchState(pairs)
    s = tapCard(s, 'L0')
    s = tapCard(s, 'L1')
    expect(s.selected).toBe('L1')
    s = tapCard(s, 'L1')
    expect(s.selected).toBeNull()
  })

  it('ignores taps on matched cards and reports when every pair is found', () => {
    let s = createMatchState(pairs)
    s = tapCard(tapCard(s, 'L0'), 'R0')
    expect(tapCard(s, 'L0')).toBe(s)
    s = tapCard(tapCard(s, 'L1'), 'R1')
    expect(isMatchDone(s)).toBe(true)
  })
})
