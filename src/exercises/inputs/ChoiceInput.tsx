import type { ChoiceExercise, FixExercise } from '../../lib/types'
import type { Look, InputProps } from '../looks'
import { FixScene } from './FixScene'
import { OptionList } from './OptionList'

/** Pick one of four (choice), optionally under a fake portal or error scene (fix). */
export function ChoiceInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<ChoiceExercise | FixExercise, number | null>) {
  const lookFor = (option: number): Look => {
    if (!reveal) return option === response ? 'selected' : 'idle'
    if (option === exercise.answer) return 'right'
    return option === response ? 'wrong' : 'dim'
  }
  return (
    <div className="space-y-5">
      {exercise.type === 'fix' && <FixScene scene={exercise.scene} />}
      <OptionList
        options={exercise.options}
        layout={layout}
        selected={response === null ? [] : [response]}
        onToggle={(o) => onChange(o)}
        lookFor={lookFor}
        locked={reveal || !!locked}
      />
    </div>
  )
}
