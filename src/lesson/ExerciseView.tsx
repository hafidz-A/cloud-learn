import { ChoiceView } from './exercises/ChoiceView'
import { MatchView } from './exercises/MatchView'
import { TrueFalseView } from './exercises/TrueFalseView'
import type { ExerciseProps } from './types'

/** Picks the view for an exercise type. Stage 3 adds the remaining six types here. */
export function ExerciseView({ exercise, ...props }: ExerciseProps) {
  switch (exercise.type) {
    case 'choice':
      return <ChoiceView exercise={exercise} {...props} />
    case 'truefalse':
      return <TrueFalseView exercise={exercise} {...props} />
    case 'match':
      return <MatchView exercise={exercise} {...props} />
    default:
      return null
  }
}
