import { CASE_STUDIES, EXERCISES, caseStudyOf, courseOf } from '../content/course'
import { navigate } from '../lib/router'
import type { CourseId, ExamAttempt } from '../lib/types'
import { useProgress } from '../store/progress'
import { isExamQuestion, scoreAttempt, type CasePool, type ExamQuestion } from './examLogic'

/** Every examReady question of a course outside the case studies, which only come as a whole section. */
function poolOf(course: CourseId): ExamQuestion[] {
  return [...EXERCISES.values()]
    .filter((r) => courseOf(r.unit.id) === course && !caseStudyOf(r.exercise.id) && isExamQuestion(r.exercise))
    .map((r) => ({ exercise: r.exercise, path: r.path }))
}

export const EXAM_POOLS: Record<CourseId, ExamQuestion[]> = { az900: poolOf('az900'), az104: poolOf('az104'), ccna: poolOf('ccna') }

/** Case studies per course, for the full simulation (AZ-104 only). */
export const CASE_POOLS: Record<CourseId, CasePool[]> = {
  az900: [],
  ccna: [],
  az104: CASE_STUDIES.map((cs) => ({
    id: cs.id,
    questions: cs.questions.flatMap((exercise) => {
      const ref = EXERCISES.get(exercise.id)
      return ref && isExamQuestion(exercise) ? [{ exercise, path: ref.path, caseStudy: cs.id }] : []
    }),
  })).filter((c) => c.questions.length > 0),
}

export function examQuestion(id: string): ExamQuestion | undefined {
  const ref = EXERCISES.get(id)
  if (!ref) return undefined
  const cs = caseStudyOf(id)
  return cs ? { exercise: ref.exercise, path: ref.path, caseStudy: cs.id } : { exercise: ref.exercise, path: ref.path }
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
