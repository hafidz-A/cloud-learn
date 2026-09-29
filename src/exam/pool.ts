import { EXERCISES, courseOf } from '../content/course'
import { navigate } from '../lib/router'
import type { ExamAttempt } from '../lib/types'
import { useProgress } from '../store/progress'
import { isExamQuestion, scoreAttempt, type ExamQuestion } from './examLogic'

/** Every examReady AZ-900 question. AZ-104 gets its own pool with its exam page (plan stage 6). */
export const EXAM_POOL: ExamQuestion[] = [...EXERCISES.values()]
  .filter((r) => courseOf(r.unit.id) === 'az900' && isExamQuestion(r.exercise))
  .map((r) => ({ exercise: r.exercise, path: r.path }))

const BY_ID = new Map(EXAM_POOL.map((q) => [q.exercise.id, q]))

export function examQuestion(id: string): ExamQuestion | undefined {
  return BY_ID.get(id) ?? (EXERCISES.get(id) ? { exercise: EXERCISES.get(id)!.exercise, path: EXERCISES.get(id)!.path } : undefined)
}

/**
 * Scores the attempt, feeds the answers into the concept stats (misses go to
 * the review queue, plan section 12.5), stores it in the history, and opens the
 * result. Unanswered questions count as wrong in the score, but say nothing about
 * what the player knows, so they stay out of the stats and the review queue.
 */
export function submitExam(attempt: ExamAttempt) {
  const { score, domainScores, results } = scoreAttempt(attempt, examQuestion)
  const store = useProgress.getState()
  for (const id of attempt.questionIds) {
    const q = examQuestion(id)
    if (q && results[id]?.answered) store.recordAnswer(id, q.exercise.concept, results[id].correct)
  }
  const finished: ExamAttempt = { ...attempt, finishedAt: new Date().toISOString(), score, domainScores }
  store.finishExam(finished)
  navigate({ name: 'exam-result', attemptId: finished.id }, { replace: true })
}
