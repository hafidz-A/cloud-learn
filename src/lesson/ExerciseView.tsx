import { caseStudyOf } from '../content/course'
import { CaseScenarioPanel } from '../exam/CaseScenario'
import { CheckedView } from './exercises/CheckedView'
import { MatchView } from './exercises/MatchView'
import { TrueFalseView } from './exercises/TrueFalseView'
import type { ExerciseProps } from './types'

/** Lesson view per type: swipe for true/false, instant pairs for match, "Periksa" for the rest. */
export function ExerciseView(props: ExerciseProps) {
  // A case study question from the review queue can't be answered without its scenario.
  const caseStudy = caseStudyOf(props.exercise.id)
  return (
    <>
      {caseStudy && <CaseScenarioPanel caseStudy={caseStudy} />}
      <TypeView {...props} />
    </>
  )
}

function TypeView({ exercise, ...props }: ExerciseProps) {
  switch (exercise.type) {
    case 'truefalse':
      return <TrueFalseView exercise={exercise} {...props} />
    case 'match':
      return <MatchView exercise={exercise} {...props} />
    default:
      return <CheckedView exercise={exercise} {...props} />
  }
}
