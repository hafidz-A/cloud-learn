import { shuffle } from '../lib/shuffle'

// State machine for the "match" exercise: tap a card on one side, then a card
// on the other side. Right pairs lock in, wrong pairs count as a mistake.

export type MatchCard = { id: string; text: string; pair: number; side: 'L' | 'R' }

export type MatchState = {
  left: MatchCard[]
  right: MatchCard[]
  selected: string | null
  matched: number[]
  flash: { ids: [string, string]; ok: boolean } | null
  mistakes: number
}

export function createMatchState(pairs: [string, string][], random: () => number = Math.random): MatchState {
  const cards = (side: 'L' | 'R') =>
    pairs.map(([l, r], pair) => ({ id: `${side}${pair}`, text: side === 'L' ? l : r, pair, side }))
  return {
    left: shuffle(cards('L'), random),
    right: shuffle(cards('R'), random),
    selected: null,
    matched: [],
    flash: null,
    mistakes: 0,
  }
}

export function findCard(state: MatchState, id: string): MatchCard | undefined {
  return state.left.find((c) => c.id === id) ?? state.right.find((c) => c.id === id)
}

export function isMatchDone(state: MatchState): boolean {
  return state.matched.length === state.left.length
}

export function tapCard(state: MatchState, id: string): MatchState {
  const card = findCard(state, id)
  if (!card || state.matched.includes(card.pair)) return state
  const base = { ...state, flash: null }
  const selected = state.selected ? findCard(state, state.selected) : undefined

  if (!selected || selected.id === card.id) {
    return { ...base, selected: selected?.id === card.id ? null : card.id }
  }
  if (selected.side === card.side) return { ...base, selected: card.id }

  const ok = selected.pair === card.pair
  return {
    ...base,
    selected: null,
    matched: ok ? [...state.matched, card.pair] : state.matched,
    mistakes: ok ? state.mistakes : state.mistakes + 1,
    flash: { ids: [selected.id, card.id], ok },
  }
}

export function clearFlash(state: MatchState): MatchState {
  return state.flash ? { ...state, flash: null } : state
}
