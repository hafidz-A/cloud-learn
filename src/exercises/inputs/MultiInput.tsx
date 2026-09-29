import type { MultiExercise } from '../../lib/types'
import type { InputProps, Look } from '../looks'
import { OptionList } from './OptionList'

/** Pick exactly N answers ("Choose two."). */
export function MultiInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<MultiExercise, number[]>) {
  const need = exercise.answers.length
  const toggle = (option: number) => {
    if (response.includes(option)) onChange(response.filter((o) => o !== option))
    else if (response.length < need) onChange([...response, option])
  }
  const lookFor = (option: number): Look => {
    const picked = response.includes(option)
    if (!reveal) return picked ? 'selected' : 'idle'
    if (exercise.answers.includes(option)) return 'right'
    return picked ? 'wrong' : 'dim'
  }
  return (
    <div>
      <p className="mb-3 font-display text-15 font-semibold text-tinta-lembut" aria-live="polite">
        Pilih {need} jawaban · {response.length}/{need} dipilih
      </p>
      <OptionList
        options={exercise.options}
        layout={layout}
        selected={response}
        onToggle={toggle}
        lookFor={lookFor}
        locked={reveal || !!locked}
        checkbox
      />
    </div>
  )
}
