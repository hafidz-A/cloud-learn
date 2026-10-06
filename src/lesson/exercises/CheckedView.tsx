import { useState } from 'react'
import { ExerciseInput } from '../../exercises/ExerciseInput'
import { INSTRUCTIONS } from '../../exercises/instructions'
import { correctAnswerText, initialResponse, isComplete, judge, judgeIos, makeLayout } from '../../exercises/logic'
import { ExerciseHeader } from '../ExerciseHeader'
import { CheckFooter } from '../LessonFooter'
import type { ExerciseProps } from '../types'

/** Build an answer, then "Periksa": every type except the swipe true/false and the instant match. */
export function CheckedView({ exercise, answered, onVerdict }: ExerciseProps) {
  const [layout] = useState(() => makeLayout(exercise))
  const [response, setResponse] = useState(() => initialResponse(exercise, layout))
  const complete = isComplete(exercise, response)

  const check = () => {
    if (!complete || answered) return
    const j = judge(exercise, response)
    // The terminal itself lists what is missing and an example solution, so the sheet only counts.
    const missing = exercise.type === 'ios' && !j.correct ? judgeIos(exercise, response as string[]).missing.length : 0
    onVerdict({
      correct: j.correct,
      correctAnswer: j.correct || exercise.type === 'ios' ? undefined : correctAnswerText(exercise),
      note:
        exercise.type === 'yesno' && !j.correct
          ? `${j.points} dari ${j.maxPoints} pernyataan benar.`
          : missing
            ? `${missing} syarat belum terpenuhi. Lihat daftarnya di bawah terminal.`
            : undefined,
    })
  }

  return (
    <>
      <ExerciseHeader instruction={INSTRUCTIONS[exercise.type]} prompt={exercise.prompt} verify={exercise.verify} />
      <div className="mt-6">
        <ExerciseInput exercise={exercise} response={response} onChange={setResponse} layout={layout} reveal={answered} />
      </div>
      <CheckFooter disabled={!complete} answered={answered} onCheck={check} />
    </>
  )
}
