// Card and chip looks shared by every exercise input. Borders carry the state,
// text always stays Tinta so contrast holds on every tint.

export type Look = 'idle' | 'selected' | 'right' | 'wrong' | 'dim'

export const CARD_LOOKS: Record<Look, { className: string; edge: string }> = {
  idle: { className: 'border-kabut bg-white', edge: 'var(--color-kabut)' },
  selected: { className: 'border-biru bg-biru-muda', edge: 'var(--color-biru)' },
  right: { className: 'border-mint bg-mint-muda', edge: 'var(--color-mint)' },
  wrong: { className: 'border-koral bg-koral-muda', edge: 'var(--color-koral)' },
  dim: { className: 'border-kabut bg-white opacity-60', edge: 'var(--color-kabut)' },
}

export const BADGE_LOOKS: Record<Look, string> = {
  idle: 'border-kabut text-tinta-lembut',
  selected: 'border-biru-dalam bg-biru-dalam text-white',
  right: 'border-mint bg-mint text-tinta',
  wrong: 'border-koral bg-koral text-tinta',
  dim: 'border-kabut text-tinta-lembut',
}

/** Common props for answer inputs. `reveal` shows right and wrong; it also locks the input. */
export type InputProps<E, R> = {
  exercise: E
  response: R
  onChange: (response: R) => void
  layout: number[]
  reveal: boolean
  /** Locks the input without showing the answer (e.g. a finished exam being reviewed elsewhere). */
  locked?: boolean
}
