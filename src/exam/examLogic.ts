import { EXAM_TYPES } from '../content/examTypes'
import { initialResponse, isComplete, judge, makeLayout, type Response } from '../exercises/logic'
import { shuffle } from '../lib/shuffle'
import type { CourseId, ExamAttempt, ExamMode, Exercise, PathId, Progress } from '../lib/types'

// Exam page rules from LANGIT_AZ900_PLAN.md section 12 and LANGIT_AZ104_PLAN.md section 9.

/**
 * `caseStudy`: the case study the question belongs to (AZ-104 full simulation only).
 * `item`: the outline item it tests, so a simulation spreads over the whole outline.
 */
export type ExamQuestion = { exercise: Exercise; path: PathId; caseStudy?: string; item?: string }

/** A case study as the picker sees it: its questions, in the order they are asked. */
export type CasePool = { id: string; questions: ExamQuestion[] }

export type ModeInfo = { title: string; count: number; minutes: number; blurb: string }

export const EXAM_MODES: Record<CourseId, Record<ExamMode, ModeInfo>> = {
  az900: {
    full: { title: 'Simulasi penuh', count: 50, minutes: 45, blurb: 'Semua domain, sesuai bobot ujian asli.' },
    domain: { title: 'Mini ujian per domain', count: 15, minutes: 15, blurb: 'Satu domain pilihanmu.' },
    weak: { title: 'Ujian titik lemah', count: 20, minutes: 20, blurb: 'Konsep dengan akurasi terendah dari latihanmu.' },
  },
  // AZ-104: 100 minutes like the real exam without labs (plan section 1), and the same pace for the shorter modes.
  az104: {
    full: { title: 'Simulasi penuh', count: 50, minutes: 100, blurb: 'Semua domain sesuai bobot ujian asli, ditutup satu studi kasus.' },
    domain: { title: 'Mini ujian per domain', count: 15, minutes: 30, blurb: 'Satu domain pilihanmu, tanpa studi kasus.' },
    weak: { title: 'Ujian titik lemah', count: 20, minutes: 40, blurb: 'Konsep dengan akurasi terendah dari latihanmu.' },
  },
}

/**
 * Full simulation per domain. AZ-900: the midpoints of 25-30 / 35-40 / 30-35 %.
 * AZ-104 (plan section 9.3): identity 12, networking 10, storage 9, compute 12, monitoring 7.
 */
export const FULL_SPLIT: Record<CourseId, Record<PathId, number>> = {
  az900: { 1: 14, 2: 19, 3: 17 },
  az104: { 1: 12, 2: 10, 3: 9, 4: 12, 5: 7 },
}

/**
 * Largest share of true/false questions in an AZ-104 pick. The real exam asks
 * few single statements, and a third of the AZ-104 bank is true/false, so without
 * a cap a simulation would be easier than the real thing. AZ-900 has no cap.
 */
const TRUEFALSE_SHARE: Record<CourseId, number | null> = { az900: null, az104: 0.2 }

export const PASS_SCORE = 700
export const READY_SCORE = 800
/** Questions from this many recent attempts are used last. */
const RECENT_ATTEMPTS = 3

export function isExamQuestion(e: Exercise): boolean {
  return !!e.examReady && !e.retired && EXAM_TYPES.has(e.type)
}

/** Recently used question ids (latest `n` attempts of the given modes). */
function recentIds(history: ExamAttempt[], modes: ExamMode[], n = RECENT_ATTEMPTS): Set<string> {
  return new Set(
    history
      .filter((a) => modes.includes(a.mode))
      .slice(-n)
      .flatMap((a) => a.questionIds),
  )
}

/** Shuffled, with questions that were not used recently first. */
function freshFirst(pool: ExamQuestion[], recent: Set<string>, random: () => number): ExamQuestion[] {
  const all = shuffle(pool, random)
  return [...all.filter((q) => !recent.has(q.exercise.id)), ...all.filter((q) => recent.has(q.exercise.id))]
}

/**
 * Freshest questions first, taken in turns from every outline item (items in
 * random order), so a short exam touches as many items as it can instead of
 * piling up on the items with the most questions.
 */
function acrossItems(pool: ExamQuestion[], recent: Set<string>, random: () => number): ExamQuestion[] {
  const queues = new Map<string, ExamQuestion[]>()
  for (const q of freshFirst(pool, recent, random)) {
    const key = q.item ?? ''
    queues.set(key, [...(queues.get(key) ?? []), q])
  }
  const order = shuffle([...queues.values()], random)
  const out: ExamQuestion[] = []
  for (let round = 0; out.length < pool.length; round++) for (const queue of order) if (queue[round]) out.push(queue[round])
  return out
}

/** The first `n` of an ordered list, with at most the course's share of true/false questions when there are enough others. */
function take(list: ExamQuestion[], n: number, course: CourseId): ExamQuestion[] {
  const share = TRUEFALSE_SHARE[course]
  if (share === null) return list.slice(0, n)
  const cap = Math.round(n * share)
  const picked: ExamQuestion[] = []
  const skipped: ExamQuestion[] = []
  let tf = 0
  for (const q of list) {
    if (picked.length === n) break
    if (q.exercise.type !== 'truefalse') picked.push(q)
    else if (tf < cap) {
      picked.push(q)
      tf++
    } else skipped.push(q)
  }
  return [...picked, ...skipped].slice(0, n)
}

/**
 * Full simulation: questions per domain by weight, freshest first. With case
 * studies (AZ-104), one of them, the least recently used, closes the exam as its
 * own section, and its questions count toward their domains (plan section 9.3).
 */
export function pickFull(
  pool: ExamQuestion[],
  history: ExamAttempt[],
  random = Math.random,
  course: CourseId = 'az900',
  cases: CasePool[] = [],
): ExamQuestion[] {
  const recent = recentIds(history, ['full'])
  const count = EXAM_MODES[course].full.count
  const split = { ...FULL_SPLIT[course] }

  let caseQuestions: ExamQuestion[] = []
  if (cases.length) {
    const recentCases = new Set(history.filter((a) => a.mode === 'full').slice(-RECENT_ATTEMPTS).map((a) => a.caseStudyId))
    const order = shuffle(cases, random)
    const chosen = [...order.filter((c) => !recentCases.has(c.id)), ...order.filter((c) => recentCases.has(c.id))][0]
    caseQuestions = chosen.questions.map((q) => ({ ...q, caseStudy: chosen.id }))
    for (const q of caseQuestions) split[q.path] = Math.max(0, (split[q.path] ?? 0) - 1)
  }

  const picked: ExamQuestion[] = []
  for (const path of Object.keys(split).map(Number)) {
    picked.push(...take(acrossItems(pool.filter((q) => q.path === path), recent, random), split[path], course))
  }
  // A thin domain is topped up from the others so the simulation keeps its length.
  const missing = count - caseQuestions.length - picked.length
  if (missing > 0) {
    const taken = new Set(picked.map((q) => q.exercise.id))
    picked.push(...take(freshFirst(pool.filter((q) => !taken.has(q.exercise.id)), recent, random), missing, course))
  }
  return [...shuffle(picked, random), ...caseQuestions]
}

export function pickDomain(pool: ExamQuestion[], path: PathId, history: ExamAttempt[], random = Math.random, course: CourseId = 'az900'): ExamQuestion[] {
  const recent = recentIds(history, ['domain', 'full'])
  return take(acrossItems(pool.filter((q) => q.path === path), recent, random), EXAM_MODES[course].domain.count, course)
}

/**
 * Weakest concepts first (lowest share right, then most answered), a few
 * questions each, round-robin. Returns `fromStats: false` when there is no
 * practice data yet and the questions are simply random.
 */
export function pickWeak(
  pool: ExamQuestion[],
  conceptStats: Progress['conceptStats'],
  random = Math.random,
  course: CourseId = 'az900',
): { questions: ExamQuestion[]; fromStats: boolean } {
  const count = EXAM_MODES[course].weak.count
  const ranked = Object.entries(conceptStats)
    .map(([concept, s]) => ({ concept, total: s.right + s.wrong, rate: s.right / Math.max(1, s.right + s.wrong) }))
    .filter((c) => c.total > 0 && c.rate < 1)
    .sort((a, b) => a.rate - b.rate || b.total - a.total)
  if (ranked.length === 0) return { questions: shuffle(pool, random).slice(0, count), fromStats: false }

  const byConcept = new Map<string, ExamQuestion[]>()
  for (const q of shuffle(pool, random)) {
    const list = byConcept.get(q.exercise.concept) ?? []
    list.push(q)
    byConcept.set(q.exercise.concept, list)
  }
  const queues = ranked.map((c) => byConcept.get(c.concept) ?? []).filter((l) => l.length)
  const picked: ExamQuestion[] = []
  while (picked.length < count && queues.some((l) => l.length)) {
    for (const l of queues) if (l.length && picked.length < count) picked.push(l.shift()!)
  }
  if (picked.length < count) {
    const taken = new Set(picked.map((q) => q.exercise.id))
    picked.push(...shuffle(pool.filter((q) => !taken.has(q.exercise.id)), random).slice(0, count - picked.length))
  }
  return { questions: shuffle(picked, random), fromStats: true }
}

export function createAttempt(mode: ExamMode, questions: ExamQuestion[], domain?: PathId, random = Math.random, course: CourseId = 'az900'): ExamAttempt {
  const optionOrder: Record<string, number[]> = {}
  const responses: Record<string, unknown> = {}
  for (const { exercise } of questions) {
    const layout = makeLayout(exercise, random)
    optionOrder[exercise.id] = layout
    responses[exercise.id] = initialResponse(exercise, layout)
  }
  const caseStart = questions.findIndex((q) => q.caseStudy)
  return {
    id: `exam-${Date.now().toString(36)}`,
    course,
    mode,
    domain,
    startedAt: new Date().toISOString(),
    timeLimitSec: EXAM_MODES[course][mode].minutes * 60,
    elapsedSec: 0,
    current: 0,
    questionIds: questions.map((q) => q.exercise.id),
    responses,
    flagged: [],
    optionOrder,
    ...(caseStart >= 0 ? { caseStudyId: questions[caseStart].caseStudy, caseStart, caseEntered: false } : {}),
  }
}

/**
 * Whether the player answered the question. An order question always holds a
 * complete order, and a config question starts with every field filled in, so
 * each only counts as answered once it differs from how it was shown (`layout`,
 * or the starting field values); that starting state is never the solution.
 */
export function isAnswered(e: Exercise, response: unknown, layout?: number[]): boolean {
  if (e.type === 'order' && layout) {
    const order = response as number[] | undefined
    return Array.isArray(order) && order.some((v, i) => v !== layout[i])
  }
  if (e.type === 'config') {
    const start = initialResponse(e, []) as unknown[]
    return isComplete(e, response as Response) && (response as unknown[]).some((v, i) => v !== start[i])
  }
  return isComplete(e, response as Response)
}

export type QuestionResult = { correct: boolean; points: number; maxPoints: number; answered: boolean }

/**
 * Score out of 1000 (plan section 12.5): points right / total points. Yes/No
 * questions give a point per statement, every other type one per question.
 */
export function scoreAttempt(
  attempt: ExamAttempt,
  lookup: (id: string) => ExamQuestion | undefined,
): { score: number; domainScores: NonNullable<ExamAttempt['domainScores']>; results: Record<string, QuestionResult> } {
  const domainScores: NonNullable<ExamAttempt['domainScores']> = {}
  const results: Record<string, QuestionResult> = {}
  let points = 0
  let max = 0
  for (const id of attempt.questionIds) {
    const q = lookup(id)
    if (!q) continue
    const response = attempt.responses[id] as Response
    const j = judge(q.exercise, response)
    results[id] = { ...j, answered: isAnswered(q.exercise, response, attempt.optionOrder[id]) }
    points += j.points
    max += j.maxPoints
    const domain = (domainScores[q.path] ??= { right: 0, total: 0 })
    domain.right += j.points
    domain.total += j.maxPoints
  }
  return { score: max ? Math.round((points / max) * 1000) : 0, domainScores, results }
}

/** "Siap ujian" when the last 3 full simulations average at least 800 (plan section 12.6). */
export function readiness(history: ExamAttempt[]): { ready: boolean; average: number | null; fullCount: number } {
  const full = history.filter((a) => a.mode === 'full' && a.score !== undefined)
  const last = full.slice(-3)
  if (last.length < 3) return { ready: false, average: last.length ? avg(last) : null, fullCount: full.length }
  const average = avg(last)
  return { ready: average >= READY_SCORE, average, fullCount: full.length }
}

function avg(list: ExamAttempt[]): number {
  return Math.round(list.reduce((a, b) => a + (b.score ?? 0), 0) / list.length)
}

/** Domain with the lowest share of points across the given attempts. */
export function weakestDomain(history: ExamAttempt[]): PathId | null {
  const sums = new Map<PathId, { right: number; total: number }>()
  for (const a of history) {
    for (const [key, score] of Object.entries(a.domainScores ?? {})) {
      const sum = sums.get(Number(key)) ?? { right: 0, total: 0 }
      sums.set(Number(key), { right: sum.right + score.right, total: sum.total + score.total })
    }
  }
  const rate = (p: PathId) => sums.get(p)!.right / sums.get(p)!.total
  const scored = [...sums.keys()].filter((p) => sums.get(p)!.total > 0).sort((a, b) => a - b)
  if (!scored.length) return null
  return scored.sort((a, b) => rate(a) - rate(b))[0]
}

export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/**
 * The questions the player may open now (index range, end excluded). With a case
 * study, the main section comes first; once the case study is entered, only its
 * questions stay open, like a section of the real exam that you can't return to.
 */
export function openRange(a: ExamAttempt): [number, number] {
  if (a.caseStart === undefined) return [0, a.questionIds.length]
  return a.caseEntered ? [a.caseStart, a.questionIds.length] : [0, a.caseStart]
}
