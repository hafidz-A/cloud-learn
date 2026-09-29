import { EXAM_TYPES } from '../content/examTypes'
import { initialResponse, isComplete, judge, makeLayout, type Response } from '../exercises/logic'
import { shuffle } from '../lib/shuffle'
import type { ExamAttempt, ExamMode, Exercise, PathId, Progress } from '../lib/types'

// Exam page rules from LANGIT_AZ900_PLAN.md section 12.

export type ExamQuestion = { exercise: Exercise; path: PathId }

export const EXAM_MODES: Record<ExamMode, { title: string; count: number; minutes: number; blurb: string }> = {
  full: { title: 'Simulasi penuh', count: 50, minutes: 45, blurb: 'Semua domain, sesuai bobot ujian asli.' },
  domain: { title: 'Mini ujian per domain', count: 15, minutes: 15, blurb: 'Satu domain pilihanmu.' },
  weak: { title: 'Ujian titik lemah', count: 20, minutes: 20, blurb: 'Konsep dengan akurasi terendah dari latihanmu.' },
}

/** Full simulation split by the midpoints of the domain weights (25-30 / 35-40 / 30-35 %). */
export const FULL_SPLIT: Record<PathId, number> = { 1: 14, 2: 19, 3: 17 }

export const PASS_SCORE = 700
export const READY_SCORE = 800
/** Questions from this many recent attempts are used last. */
const RECENT_ATTEMPTS = 3

export function isExamQuestion(e: Exercise): boolean {
  return !!e.examReady && EXAM_TYPES.has(e.type)
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

export function pickFull(pool: ExamQuestion[], history: ExamAttempt[], random = Math.random): ExamQuestion[] {
  const recent = recentIds(history, ['full'])
  const picked: ExamQuestion[] = []
  for (const path of [1, 2, 3] as PathId[]) {
    picked.push(...freshFirst(pool.filter((q) => q.path === path), recent, random).slice(0, FULL_SPLIT[path]))
  }
  // A thin domain is topped up from the others so the simulation keeps its length.
  const missing = EXAM_MODES.full.count - picked.length
  if (missing > 0) {
    const taken = new Set(picked.map((q) => q.exercise.id))
    picked.push(...freshFirst(pool.filter((q) => !taken.has(q.exercise.id)), recent, random).slice(0, missing))
  }
  return shuffle(picked, random)
}

export function pickDomain(pool: ExamQuestion[], path: PathId, history: ExamAttempt[], random = Math.random): ExamQuestion[] {
  const recent = recentIds(history, ['domain', 'full'])
  return freshFirst(pool.filter((q) => q.path === path), recent, random).slice(0, EXAM_MODES.domain.count)
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
): { questions: ExamQuestion[]; fromStats: boolean } {
  const count = EXAM_MODES.weak.count
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

export function createAttempt(mode: ExamMode, questions: ExamQuestion[], domain?: PathId, random = Math.random): ExamAttempt {
  const optionOrder: Record<string, number[]> = {}
  const responses: Record<string, unknown> = {}
  for (const { exercise } of questions) {
    const layout = makeLayout(exercise, random)
    optionOrder[exercise.id] = layout
    responses[exercise.id] = initialResponse(exercise, layout)
  }
  return {
    id: `exam-${Date.now().toString(36)}`,
    mode,
    domain,
    startedAt: new Date().toISOString(),
    timeLimitSec: EXAM_MODES[mode].minutes * 60,
    elapsedSec: 0,
    current: 0,
    questionIds: questions.map((q) => q.exercise.id),
    responses,
    flagged: [],
    optionOrder,
  }
}

export function isAnswered(e: Exercise, response: unknown): boolean {
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
  const domainScores = { 1: { right: 0, total: 0 }, 2: { right: 0, total: 0 }, 3: { right: 0, total: 0 } }
  const results: Record<string, QuestionResult> = {}
  let points = 0
  let max = 0
  for (const id of attempt.questionIds) {
    const q = lookup(id)
    if (!q) continue
    const response = attempt.responses[id] as Response
    const j = judge(q.exercise, response)
    results[id] = { ...j, answered: isAnswered(q.exercise, response) }
    points += j.points
    max += j.maxPoints
    domainScores[q.path].right += j.points
    domainScores[q.path].total += j.maxPoints
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
  const sums = { 1: { right: 0, total: 0 }, 2: { right: 0, total: 0 }, 3: { right: 0, total: 0 } }
  for (const a of history) {
    if (!a.domainScores) continue
    for (const p of [1, 2, 3] as PathId[]) {
      sums[p].right += a.domainScores[p]?.right ?? 0
      sums[p].total += a.domainScores[p]?.total ?? 0
    }
  }
  const scored = ([1, 2, 3] as PathId[]).filter((p) => sums[p].total > 0)
  if (!scored.length) return null
  return scored.sort((a, b) => sums[a].right / sums[a].total - sums[b].right / sums[b].total)[0]
}

export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
