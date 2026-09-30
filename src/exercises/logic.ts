import { shuffle } from '../lib/shuffle'
import type { ConfigExercise, ConfigValue, Exercise, PlaceExercise } from '../lib/types'

// Answers ("responses") and judging for every exercise type, kept apart from
// the UI so lessons, practice, and the exam page all judge the same way.

/** Response shape per exercise type. Indices always point into the exercise's own arrays. */
export type Responses = {
  choice: number | null
  fix: number | null
  multi: number[]
  truefalse: boolean | null
  yesno: (boolean | null)[]
  match: (number | null)[] // left pair index -> chosen right pair index
  order: number[] // current order of item indices
  sort: (number | null)[] // bucket per item
  fill: (number | null)[] // bank index per blank
  place: (number | null)[] // zone per piece
  shell: number[] // token indices in the order they were tapped
  rules: number | null
  template: number | null
  topology: number | null
  config: (ConfigValue | null)[] // value per field index
  kql: number[] // token indices in the order they were tapped
}

export type Response = Responses[keyof Responses]

export type Judgement = {
  correct: boolean
  /** Exam points: one per yes/no statement, one per question for every other type. */
  points: number
  maxPoints: number
}

/** Number of blanks ("___") in a fill sentence. */
export function blanksIn(sentence: string): number {
  return sentence.split('___').length - 1
}

/** Length of the list a type shuffles for display (options, cards, bank, tokens...). */
function shuffledLength(e: Exercise): number {
  switch (e.type) {
    case 'choice':
    case 'fix':
    case 'multi':
    case 'rules':
    case 'template':
    case 'topology':
      return e.options.length
    case 'match':
      return e.pairs.length
    case 'order':
    case 'sort':
      return e.items.length
    case 'fill':
      return e.bank.length
    case 'shell':
    case 'kql':
      return e.tokens.length
    default:
      return 0
  }
}

/**
 * Display order for one attempt: option order, right-hand match column, sort
 * cards, word bank, or shell tokens. For "order" it is the starting order, and
 * never the solved one.
 */
export function makeLayout(e: Exercise, random: () => number = Math.random): number[] {
  const identity = Array.from({ length: shuffledLength(e) }, (_, i) => i)
  if (identity.length < 2) return identity
  let out = shuffle(identity, random)
  if (e.type === 'order') {
    for (let tries = 0; tries < 10 && out.every((v, i) => v === i); tries++) out = shuffle(identity, random)
    if (out.every((v, i) => v === i)) out = [...identity].reverse()
  }
  return out
}

export function initialResponse(e: Exercise, layout: number[]): Response {
  switch (e.type) {
    case 'choice':
    case 'fix':
    case 'truefalse':
    case 'rules':
    case 'template':
    case 'topology':
      return null
    case 'multi':
    case 'shell':
    case 'kql':
      return []
    case 'config':
      return e.fields.map((f) => f.value ?? (f.kind === 'toggle' ? false : null))
    case 'yesno':
      return e.statements.map(() => null)
    case 'match':
      return e.pairs.map(() => null)
    case 'order':
      return [...layout]
    case 'sort':
      return e.items.map(() => null)
    case 'fill':
      return Array.from({ length: blanksIn(e.sentence) }, () => null)
    case 'place':
      return e.pieces.map(() => null)
  }
}

/** True once the player gave a full answer, which enables "Periksa". */
export function isComplete(e: Exercise, r: Response): boolean {
  switch (e.type) {
    case 'choice':
    case 'fix':
    case 'truefalse':
    case 'rules':
    case 'template':
    case 'topology':
      return r !== null && r !== undefined
    case 'multi':
      return Array.isArray(r) && r.length === e.answers.length
    case 'shell':
    case 'kql':
      return Array.isArray(r) && r.length > 0
    case 'config':
      return Array.isArray(r) && r.length === e.fields.length && r.every((v) => v !== null && v !== undefined && v !== '')
    case 'order':
      return Array.isArray(r) && r.length === e.items.length
    case 'yesno':
    case 'match':
    case 'sort':
    case 'fill':
    case 'place':
      return Array.isArray(r) && r.length > 0 && r.every((v) => v !== null && v !== undefined)
  }
}

/** Which pieces sit well, per the exercise's rule. */
export function judgePlace(e: PlaceExercise, placement: (number | null)[]): { correct: boolean; pieceOk: boolean[] } {
  const pieceOk = e.pieces.map((p, i) => placement[i] !== null && p.validZones.includes(placement[i]!))
  if (e.rule === 'one-per-zone') {
    placement.forEach((z, i) => {
      if (z !== null && placement.some((other, j) => j !== i && other === z)) pieceOk[i] = false
    })
  }
  let correct = pieceOk.every(Boolean)
  if (e.rule === 'spread') correct = correct && new Set(placement).size >= 2
  return { correct, pieceOk }
}

const sameSet = (a: number[], b: number[]) => a.length === b.length && a.every((v) => b.includes(v))

/** Whether a config field value matches the expected one. Text ignores case and surrounding spaces. */
export function sameConfigValue(expected: ConfigValue, got: ConfigValue | null | undefined): boolean {
  if (got === null || got === undefined) return false
  if (typeof expected === 'string' && typeof got === 'string') return expected.trim().toLowerCase() === got.trim().toLowerCase()
  if (typeof expected === 'number') return Number(got) === expected
  return expected === got
}

/** Per graded field of a config exercise: its index and whether the player's value is right. */
export function judgeConfig(e: ConfigExercise, values: (ConfigValue | null)[]): { field: number; ok: boolean }[] {
  return Object.entries(e.answer).map(([label, expected]) => {
    const field = e.fields.findIndex((f) => f.label === label)
    return { field, ok: field >= 0 && sameConfigValue(expected, values[field]) }
  })
}

/** How a config value reads in text: toggles as On/Off. */
export const configValueText = (v: ConfigValue): string => (typeof v === 'boolean' ? (v ? 'On' : 'Off') : String(v))

export function judge(e: Exercise, r: Response): Judgement {
  const one = (correct: boolean): Judgement => ({ correct, points: correct ? 1 : 0, maxPoints: 1 })
  switch (e.type) {
    case 'choice':
    case 'fix':
    case 'rules':
    case 'template':
    case 'topology':
      return one(r === e.answer)
    case 'truefalse':
      return one(r === e.answer)
    case 'multi':
      return one(Array.isArray(r) && sameSet(r as number[], e.answers))
    case 'yesno': {
      const answers = (r ?? []) as (boolean | null)[]
      const points = e.statements.filter((st, i) => answers[i] === st.answer).length
      return { correct: points === e.statements.length, points, maxPoints: e.statements.length }
    }
    case 'match':
      return one(e.pairs.every((_, i) => (r as (number | null)[])?.[i] === i))
    case 'order':
      return one(e.items.every((_, i) => (r as number[])?.[i] === i))
    case 'sort':
      return one(e.items.every((item, i) => (r as (number | null)[])?.[i] === item.bucket))
    case 'fill': {
      const picks = (r ?? []) as (number | null)[]
      return one(e.answers.every((a, k) => picks[k] !== null && picks[k] !== undefined && e.bank[picks[k]!] === a))
    }
    case 'place':
      return one(judgePlace(e, (r ?? []) as (number | null)[]).correct)
    case 'shell':
    case 'kql': {
      const typed = ((r ?? []) as number[]).map((i) => e.tokens[i]).join(' ')
      return one(typed === e.answer.join(' '))
    }
    case 'config':
      return one(judgeConfig(e, (r ?? []) as (ConfigValue | null)[]).every((f) => f.ok))
  }
}

/** Text for "Jawaban benar: ..." in the feedback sheet, when a short one exists. */
export function correctAnswerText(e: Exercise): string | undefined {
  switch (e.type) {
    case 'choice':
    case 'fix':
    case 'rules':
    case 'template':
    case 'topology':
      return e.options[e.answer]
    case 'config':
      return Object.entries(e.answer)
        .map(([label, v]) => `${label}: ${configValueText(v)}`)
        .join(' · ')
    case 'multi':
      return e.answers.map((a) => e.options[a]).join(' · ')
    case 'truefalse':
      return e.answer ? 'Benar' : 'Salah'
    case 'yesno':
      return e.statements.map((st, i) => `${i + 1}. ${st.answer ? 'Yes' : 'No'}`).join(', ')
    case 'order':
      return e.items.join(' → ')
    case 'fill': {
      let k = 0
      return e.sentence.replace(/___/g, () => e.answers[k++] ?? '___')
    }
    case 'shell':
    case 'kql':
      return e.answer.join(' ')
    default:
      return undefined
  }
}
