// XP rules from LANGIT_AZ900_PLAN.md section 4 ("Mekanik game").
export const XP_PER_LESSON = 10
export const XP_FLAWLESS_BONUS = 5

export type LessonSummary = {
  lessonId: string
  total: number
  correct: number
  accuracy: number // 0..1
  xp: number
  durationMs: number
}

export function summarizeLesson(
  lessonId: string,
  results: readonly boolean[],
  durationMs: number,
): LessonSummary {
  const total = results.length
  const correct = results.filter(Boolean).length
  const flawless = total > 0 && correct === total
  return {
    lessonId,
    total,
    correct,
    accuracy: total === 0 ? 0 : correct / total,
    xp: XP_PER_LESSON + (flawless ? XP_FLAWLESS_BONUS : 0),
    durationMs,
  }
}
